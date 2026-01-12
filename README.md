# AInalyst 🚀

**AI-Powered Competitive Intelligence Platform**

AInalyst is a cutting-edge web application that leverages artificial intelligence to provide comprehensive competitor analysis for startups and businesses. Simply enter a company name and get detailed insights about competitors, market positioning, and strategic intelligence.

## 🌐 Live Demo

🔗 **[Try AInalyst Now](https://ainalyst.vercel.app)**

## ✨ Features

### 🔐 **Authentication & Security**
- Secure API key management with environment variables
- Rate limiting protection and retry mechanisms
- Error handling with graceful fallbacks

### 📊 **Advanced Analytics**
- **Interactive Market Comparison Charts** - Visual representation of market share and revenue
- **Competitor Performance Metrics** - Real-time data visualization using Recharts
- **Market Position Analysis** - Comprehensive competitive landscape mapping
- **PDF Report Generation** - Export detailed analysis reports with charts and insights

### 🤖 **AI API Integration**
- **Groq Llama 3.1 8B Instant Model** - Chosen specifically for faster response times (sub-second analysis)
- **Smart Data Processing** - Advanced JSON parsing and data validation
- **Intelligent Retry Logic** - Automatic retry with exponential backoff for reliability
- **Real-time Analysis** - Live competitor research and market intelligence

### ⚡ **Performance Optimization**
- **Vite Build System** - Lightning-fast development and production builds
- **React 19** - Latest React features for optimal performance
- **Lazy Loading** - Efficient resource management
- **Responsive Design** - Optimized for all devices and screen sizes
- **Caching Strategy** - Prevents duplicate API calls during session

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- React Router DOM for navigation
- Recharts for data visualization
- HTML2Canvas + jsPDF for report generation

**AI & APIs:**
- Groq SDK (Llama 3.1 8B Instant)
- Google Generative AI integration ready

**Styling & UI:**
- Custom CSS with modern design patterns
- Font Awesome icons
- Responsive grid layouts
- Glass morphism effects

**Deployment:**
- Vercel (Production)
- Environment-based configuration

## 📈 Data Sources

### **AI-Generated Intelligence**
- **Primary Source**: Groq's Llama 3.1 8B Instant model
- **Data Type**: Real-time AI analysis of publicly available business information
- **Why Groq**: Selected specifically for **faster response times** compared to other AI APIs
- **Processing**: Advanced prompt engineering for accurate business intelligence

### **Data Categories Analyzed:**
- Company profiles and business models
- Market share and revenue estimates
- Competitive positioning
- Recent developments and news
- Innovation tracking
- Strategic advantages

*Note: All data is AI-generated based on publicly available information and should be used for research and strategic planning purposes.*

## 🎯 Use Cases

### **For Startups**
- **Market Entry Strategy** - Identify key competitors before launching
- **Positioning Analysis** - Understand competitive landscape
- **Investment Preparation** - Comprehensive market research for pitches

### **For Business Development**
- **Competitive Intelligence** - Stay updated on competitor activities
- **Market Research** - Quick industry analysis and insights
- **Strategic Planning** - Data-driven decision making

### **For Investors**
- **Due Diligence** - Rapid competitor analysis for investment decisions
- **Market Assessment** - Understand competitive dynamics
- **Portfolio Analysis** - Compare portfolio companies with competitors

### **For Consultants**
- **Client Research** - Quick competitive analysis for client presentations
- **Market Reports** - Generate professional analysis reports
- **Industry Insights** - Comprehensive sector analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/AInalyst.git
   cd AInalyst
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
AInalyst/
├── public/                 # Static assets
│   ├── favicon2.png
│   └── image2.png
├── src/
│   ├── assets/            # React assets
│   ├── App.css           # Global styles
│   ├── Home.css          # Component styles
│   ├── Home.jsx          # Home component
│   ├── SearchPage.jsx    # Search interface
│   ├── ResultsPage.jsx   # Results display
│   ├── PromptGenerator.jsx # AI integration
│   ├── ComparisonGraphs.jsx # Data visualization
│   ├── main.jsx          # App entry point
│   └── index.css         # Base styles
├── .env                  # Environment variables
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md
```

## 🔧 Configuration

### Environment Variables
```env
VITE_GROQ_API_KEY=your_groq_api_key
```

### Build Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}
```

## 📊 API Usage

The application uses Groq's Llama 3.1 8B Instant model for:
- Company analysis and profiling
- Competitor identification
- Market research and insights
- Strategic intelligence gathering

**Why Groq?** Selected for superior response speed, delivering analysis in under 2 seconds compared to 10-15 seconds with other AI providers.

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Parth Tandalwade**
- GitHub: [@KhanjarSingh](https://github.com/KhanjarSingh)
- LinkedIn: [Parth Tandalwade](https://www.linkedin.com/in/parth-tandalwade-295882323/)

## 🙏 Acknowledgments

- Groq for providing fast AI inference
- Vercel for seamless deployment
- React team for the amazing framework
- Open source community for inspiration

---

**Empowering businesses with AI-driven competitive intelligence** 🎯
