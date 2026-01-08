import Groq from "groq-sdk";
import { useEffect, useRef, useState } from "react";
import ComparisonGraphs from "./ComparisonGraphs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



export default function PromptGenerator({ company }) {
  const [companyData, setCompanyData] = useState(null);
  const [competitorsData, setCompetitorsData] = useState([]);
  const [promptResponse, setPromptResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const hasFetched = useRef(false);
  const isRequesting = useRef(false);

  useEffect(() => {
    hasFetched.current = false;
  }, [company]);

  useEffect(() => {
    if (!company || hasFetched.current || isRequesting.current) return;
    hasFetched.current = true;
    setCompanyData(null);
    setCompetitorsData([]);
    setPromptResponse("");
    setError(null);
    generateResponse();
  }, [company]);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const filterData = (data) => {
    try {
      const validCompanyData = {
        ...data.company,
        marketShare: parseFloat(data.company.marketShare) || 0,
        revenue: parseFloat(data.company.revenue) || 0,
        founded: String(data.company.founded || ""),
        name: data.company.name || company,
        uniqueDetails: data.company.uniqueDetails || [],
        latestNews: data.company.latestNews || [],
        keyInnovations: data.company.keyInnovations || [],
        marketPosition: data.company.marketPosition || "",
        futureOutlook: data.company.futureOutlook || ""
      };

      const validCompetitors = (data.competitors || [])
        .filter(comp => comp.name && (comp.marketShare || comp.revenue))
        .map(comp => ({
          ...comp,
          marketShare: parseFloat(comp.marketShare) || 0,
          revenue: parseFloat(comp.revenue) || 0,
          strengths: comp.strengths || [],
          weaknesses: comp.weaknesses || [],
          uniqueFeatures: comp.uniqueFeatures || [],
          recentDevelopments: comp.recentDevelopments || []
        }))
        .sort((a, b) => b.marketShare - a.marketShare)
        .slice(0, 3);

      return {
        company: validCompanyData,
        competitors: validCompetitors
      };
    } catch (error) {
      console.error('Error filtering data:', error);
      throw new Error('Invalid data structure received');
    }
  };

  async function generateResponse(retryCount = 0) {
    if (isRequesting.current) return;
    
    try {
      isRequesting.current = true;
      setLoading(true);
      setError(null);
      
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        max_tokens: 1500,
        messages: [{ 
          role: "user", 
          content: `You are a business analyst. Research and analyze the real company "${company}". Provide actual facts, not generic placeholders. Return only valid JSON:

{
  "company": {
    "name": "${company}",
    "description": "[Write actual description of ${company} - what they do, their business model, key products/services]",
    "marketShare": [actual number],
    "revenue": [actual revenue in millions],
    "industry": "[actual industry]",
    "founded": "[actual founding year]",
    "headquarters": "[actual location]",
    "keyStrengths": ["actual strength 1", "actual strength 2"],
    "uniqueSellingPoints": ["actual USP 1", "actual USP 2"],
    "uniqueDetails": [{"title": "Real feature", "description": "Actual details about ${company}"}],
    "latestNews": [{"date": "2024-01-01", "headline": "Real news about ${company}", "summary": "Actual summary"}],
    "keyInnovations": ["actual innovation"],
    "marketPosition": "[actual market position]",
    "futureOutlook": "[realistic outlook]"
  },
  "competitors": [{
    "name": "[Real competitor name]",
    "marketShare": [actual number],
    "revenue": [actual number],
    "strengths": ["real strength"],
    "weaknesses": ["real weakness"],
    "uniqueFeatures": ["real feature"],
    "recentDevelopments": ["real development"],
    "competitiveAdvantage": "real advantage"
  }]
}

IMPORTANT: Replace ALL bracketed placeholders with real information about ${company}.` 
        }],
      });

      try {
        let cleanedResponse = completion.choices[0].message.content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/\n/g, ' ')
          .trim();
        
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
        }
        
        cleanedResponse = cleanedResponse
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/\\'/g, "'")
          .replace(/(["'])(\w+)(["']):/g, '"$2":')
          .replace(/:\s*(["'])(.*?)(["'])\s*([,}])/g, ': "$2"$4');
        
        const data = JSON.parse(cleanedResponse);
        const filtered = filterData(data);
        
        setCompanyData(filtered.company);
        setCompetitorsData(filtered.competitors);
        setPromptResponse(filtered.company.description);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw response:', completion.choices[0].message.content);
        if (retryCount < 2) {
          await sleep(2000);
          return generateResponse(retryCount + 1);
        }
        throw new Error('Failed to parse response');
      }
      
    } catch (error) {
      console.error('Error:', error);
      if (error.status === 429 && retryCount < 3) {
        const waitTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
        setError(`Rate limited. Retrying in ${waitTime/1000}s...`);
        await sleep(waitTime);
        return generateResponse(retryCount + 1);
      }
      if (retryCount < 2) {
        await sleep(2000);
        return generateResponse(retryCount + 1);
      }
      setError('Service temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setError(null);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(24);
      pdf.text(`${company} Analysis Report`, pageWidth / 2, 40, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 50, { align: 'center' });

      const sections = [
        { id: 'overview', title: 'Company Overview' },
        { id: 'unique-details', title: 'Unique Details' },
        { id: 'innovations', title: 'Key Innovations' },
        { id: 'competitors', title: 'Competitor Analysis' },
        { id: 'news', title: 'Latest News' },
        { id: 'comparison', title: 'Market Comparison' }
      ];

      let firstSection = true;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        element.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 400));

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#fff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (firstSection) {
          pdf.addPage();
          firstSection = false;
        } else {
          pdf.addPage();
        }

        pdf.setFontSize(16);
        pdf.text(section.title, 10, 15);

        pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
      }

      pdf.save(`${company}-analysis-report.pdf`);
    } catch (error) {
      setError('Error generating PDF. Please try again.');
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-card">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error && !promptResponse) {
    return (
      <div className="prompt-response">
        <div className="error-message">
          {error}
          <button onClick={() => generateResponse()} style={{marginLeft: '10px'}}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!promptResponse && !loading && !error) {
    return (
      <div className="prompt-response">
        <div className="error-message">
          No data available. 
          <button onClick={() => generateResponse()} style={{marginLeft: '10px'}}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-response">
      {error && !loading && (
        <div className="error-message">
          {error}
        </div>
      )}
      {promptResponse && !error && (
        <>
          <nav className="section-nav">
            <ul>
              <li>
                <button 
                  onClick={() => scrollToSection('overview')}
                  className={activeSection === 'overview' ? 'active' : ''}
                  title="Overview"
                >
                  <i className="fa-solid fa-building"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('unique-details')}
                  className={activeSection === 'unique-details' ? 'active' : ''}
                  title="Unique Details"
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('innovations')}
                  className={activeSection === 'innovations' ? 'active' : ''}
                  title="Innovations"
                >
                  <i className="fa-solid fa-lightbulb"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('competitors')}
                  className={activeSection === 'competitors' ? 'active' : ''}
                  title="Competitors"
                >
                  <i className="fa-solid fa-users"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('news')}
                  className={activeSection === 'news' ? 'active' : ''}
                  title="Latest News"
                >
                  <i className="fa-solid fa-newspaper"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('comparison')}
                  className={activeSection === 'comparison' ? 'active' : ''}
                  title="Comparison"
                >
                  <i className="fa-solid fa-chart-bar"></i>
                </button>
              </li>
              <li>
                <button 
                  onClick={downloadPDF}
                  title="Download PDF"
                  className="download-button"
                  disabled={isGeneratingPDF}
                >
                  <i className={`fa-solid ${isGeneratingPDF ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
                </button>
              </li>
            </ul>
          </nav>

          {isGeneratingPDF && (
            <div className="loading-pdf">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Generating PDF...</p>
            </div>
          )}

          <div className="content-wrapper">
            <div id="overview" className="response-content">
              <h2>About {company}</h2>
              <div className="company-details">
                <p>{promptResponse}</p>
                {companyData && (
                  <div className="company-info">
                    <div className="basic-info">
                      <p><strong>Industry:</strong> {companyData.industry}</p>
                      <p><strong>Founded:</strong> {companyData.founded}</p>
                      <p><strong>Headquarters:</strong> {companyData.headquarters}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {companyData && companyData.uniqueDetails && companyData.uniqueDetails.length > 0 && (
              <div id="unique-details" className="unique-details-section">
                <h2>What Makes {company} Unique</h2>
                <div className="unique-details-grid">
                  {companyData.uniqueDetails.map((detail, index) => (
                    <div key={index} className="unique-detail-card">
                      <h4>{detail.title}</h4>
                      <p>{detail.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {companyData && companyData.keyInnovations && companyData.keyInnovations.length > 0 && (
              <div id="innovations" className="innovations-section">
                <h2>Key Innovations</h2>
                <ul>
                  {companyData.keyInnovations.map((innovation, index) => (
                    <li key={index}>{innovation}</li>
                  ))}
                </ul>
              </div>
            )}

            {companyData && competitorsData.length > 0 && (
              <div id="competitors" className="competitors-section">
                <h2>Competitor Analysis</h2>
                <div className="competitors-grid">
                  {competitorsData.map((competitor, index) => (
                    <div key={index} className="competitor-card">
                      <h3>{competitor.name}</h3>
                      <div className="competitor-stats">
                        <p><strong>Market Share:</strong> {competitor.marketShare}%</p>
                        <p><strong>Revenue:</strong> ${competitor.revenue}M</p>
                      </div>
                      <div className="competitor-details">
                        {competitor.uniqueFeatures && competitor.uniqueFeatures.length > 0 && (
                          <div className="feature-section">
                            <h4>Unique Features</h4>
                            <ul>
                              {competitor.uniqueFeatures.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {competitor.recentDevelopments && competitor.recentDevelopments.length > 0 && (
                          <div className="developments-section">
                            <h4>Recent Developments</h4>
                            <ul>
                              {competitor.recentDevelopments.map((dev, idx) => (
                                <li key={idx}>{dev}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {competitor.competitiveAdvantage && (
                          <div className="advantage-section">
                            <h4>Competitive Advantage</h4>
                            <p>{competitor.competitiveAdvantage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {companyData && companyData.latestNews && companyData.latestNews.length > 0 && (
              <div id="news" className="news-section">
                <h2>Latest News</h2>
                <div className="news-timeline">
                  {companyData.latestNews.map((news, index) => (
                    <div key={index} className="news-card">
                      <div className="news-date">{news.date}</div>
                      <h3>{news.headline}</h3>
                      <p>{news.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {companyData && competitorsData.length > 0 && (
              <div id="comparison" className="comparison-section">
                <h2>Market Comparison</h2>
                <ComparisonGraphs 
                  companyData={companyData}
                  competitorsData={competitorsData}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
