import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";
import ComparisonGraphs from './ComparisonGraphs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PromptGenerator({ company }) {
  const [promptResponse, setPromptResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [competitorsData, setCompetitorsData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (company) {
      generateResponse();
    }
  }, [company]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const filterData = (data) => {
    try {
      const validCompanyData = {
        ...data.company,
        marketShare: parseFloat(data.company.marketShare) || 0,
        revenue: parseFloat(data.company.revenue) || 0,
        name: data.company.name || company,
        uniqueDetails: data.company.uniqueDetails || [],
        latestNews: data.company.latestNews || [],
        keyInnovations: data.company.keyInnovations || [],
        marketPosition: data.company.marketPosition || "",
        futureOutlook: data.company.futureOutlook || ""
      };

      const validCompetitors = data.competitors
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
    try {
      setLoading(true);
      setError(null);
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDumxpXsDvXiEPtCnZ085xO0tqlWfknACM" });
      
      const prompt = `Analyze the company "${company}" and provide a response in the following exact JSON format without any additional text or explanation:
      {
        "company": {
          "name": "${company}",
          "description": "string",
          "marketShare": number,
          "revenue": number,
          "industry": "string",
          "founded": "string",
          "headquarters": "string",
          "keyStrengths": ["string"],
          "uniqueSellingPoints": ["string"],
          "uniqueDetails": [
            {
              "title": "string",
              "description": "string"
            }
          ],
          "latestNews": [
            {
              "date": "string",
              "headline": "string",
              "summary": "string"
            }
          ],
          "keyInnovations": ["string"],
          "marketPosition": "string",
          "futureOutlook": "string"
        },
        "competitors": [
          {
            "name": "string",
            "marketShare": number,
            "revenue": number,
            "strengths": ["string"],
            "weaknesses": ["string"],
            "uniqueFeatures": ["string"],
            "recentDevelopments": ["string"],
            "competitiveAdvantage": "string"
          }
        ]
      }

      Rules:
      1. All numbers must be actual numbers, not strings
      2. Include exactly 3 top competitors
      3. Market share should be a percentage (0-100)
      4. Revenue should be in millions
      5. For each competitor, provide at least 2-3 unique features and recent developments
      6. Include at least 3-4 unique details about the company
      7. Include at least 3 latest news items from the past year
      8. Make the analysis detailed and specific
      9. Ensure all required fields are present`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      try {
        const cleanedResponse = response.text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const data = JSON.parse(cleanedResponse);
        const filtered = filterData(data);
        
        setCompanyData(filtered.company);
        setCompetitorsData(filtered.competitors);
        setPromptResponse(filtered.company.description);
        setFilteredData(filtered);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Raw response:', response.text);
        setError('Error processing company data. Please try again.');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      if (error.message?.includes('429') && retryCount < 3) {
        const backoffTime = Math.pow(2, retryCount) * 1000;
        setError(`Rate limit reached. Retrying in ${backoffTime/1000} seconds...`);
        await sleep(backoffTime);
        return generateResponse(retryCount + 1);
      }
      
      setError('Unable to generate response. Please try again in a few minutes.');
      setPromptResponse('');
    } finally {
      setLoading(false);
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
