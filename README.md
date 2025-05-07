# Creating a README.md file with the content provided

readme_content = """
# AInalyst

**AI-Powered Competitor Analysis Tool**

AInalyst is an AI-driven web application designed to help startups and businesses identify and understand their key competitors within any industry. By leveraging Google’s Gemini Pro API, AInalyst generates detailed competitor reports based on your startup's name and sector input — providing you with market insights, competitor profiles, and a summarized comparison.

## 🌐 Live Demo

🔗 [Visit AInalyst](https://ainalyst.vercel.app)

Try a sample:  
👉 [Propacity Competitor Report](https://ainalyst.vercel.app/results/Propacity)

## 🚀 Features

- 🔍 Smart Competitor Discovery – Just input your startup and sector; let the AI do the research.  
- 📊 Detailed Analysis – Get names, descriptions, market positions, and websites of top 5–6 competitors.  
- 🧠 AI-Powered Insights – Uses Google Gemini Pro for deep, contextual competitor analysis.  
- 🖥️ Clean & Responsive UI – Built with React and Tailwind CSS for modern and accessible design.  
- ⚡ Fast Performance – Powered by Vite and deployed on Vercel for instant load times.

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Styling**: Tailwind CSS  
- **AI Integration**: Google Generative AI (Gemini Pro)  
- **Deployment**: Vercel

## 📁 Project Structure

AInalyst/  
├── public/               # Static assets  
├── src/  
│   ├── App.jsx           # Main app component  
│   ├── main.jsx          # Entry point  
│   └── gemini.js         # Google Gemini API integration  
├── .env                  # Environment variables  
├── vite.config.js        # Vite configuration  
├── package.json  
└── README.md

## ▶️ Getting Started

### Prerequisites

- Node.js (v14 or later)  
- Google Generative AI API key (Gemini Pro)

### Installation

1. **Clone the repository:**

   git clone https://github.com/KhanjarSingh/AInalyst.git  
   cd AInalyst

2. **Install dependencies:**

   npm install  
   (or)  
   yarn install

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following:

   VITE_GEMINI_API_KEY=your_google_gemini_api_key

4. **Start the development server:**

   npm run dev  
   (or)  
   yarn dev

   Your app will be running at `http://localhost:5173`

## 🧪 How It Works

- The app takes two inputs: the **startup name** and its **sector**.  
- These inputs are used to construct a prompt, sent to Google’s Gemini Pro model.  
- The AI returns a well-structured competitor analysis with 5–6 similar companies, their descriptions, and a comparison summary.  
- This information is rendered in the app as a readable report.

## 🤝 Contributing

Contributions are welcome! 🚀

To contribute:

1. Fork the repository  
2. Create your feature branch: `git checkout -b feature/myFeature`  
3. Commit your changes: `git commit -m 'Add my feature'`  
4. Push to the branch: `git push origin feature/myFeature`  
5. Open a pull request

## 📄 License

This project is open-source and available under the MIT License.

## 🙋‍♂️ Author

- **Parth Tandalwade**  
- GitHub: [@KhanjarSingh](https://github.com/KhanjarSingh)  
- LinkedIn: [Parth Tandalwade](https://www.linkedin.com/in/parth-tandalwade-295882323/)

---

Empowering startups with intelligent, AI-driven market insight — one report at a time.
"""

# Save the README content to a file
file_path = "/mnt/data/README.md"
with open(file_path, "w") as f:
    f.write(readme_content)

file_path
