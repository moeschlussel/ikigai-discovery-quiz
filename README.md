# 🌸 Ikigai Discovery Quiz

An AI-powered interactive quiz that helps you discover your Ikigai - your reason for being. This personalized assessment combines the ancient Japanese concept of Ikigai with modern AI to provide deep insights into your purpose, passions, and path forward.

## ✨ Features

- **AI-Powered Adaptive Questions**: Personalized questions that adapt based on your responses
- **Multiple Quiz Styles**: Choose from playful, introspective, narrative, or rapid-fire question formats
- **Comprehensive Analysis**: Deep AI analysis of your responses to create a detailed profile
- **Beautiful Results**: Visual Ikigai diagram with personalized insights
- **Career & Lifestyle Recommendations**: AI-generated suggestions tailored to your unique profile
- **Downloadable Reports**: Save your results as an HTML report
- **Analytics Integration**: Built-in Vercel Analytics and Google Analytics tracking

## 🚀 Live Demo

Visit the live application: **[ikigaime.com](https://ikigaime.com)**

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui Components
- **AI Integration**: OpenAI GPT-4 for adaptive questions and analysis
- **Analytics**: Vercel Analytics + Google Analytics 4
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works beautifully on all devices

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moeschlussel/ikigai-discovery-quiz.git
   cd ikigai-discovery-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Required: OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Google Analytics Measurement ID (starts with G-)
   NEXT_PUBLIC_GA_ID=G-PZ51XB3FX4
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Analytics Setup

### Google Analytics (Optional)
1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (starts with `G-`)
3. Add it to your environment variables as `NEXT_PUBLIC_GA_ID`
4. Deploy - analytics will start tracking automatically!

### Vercel Analytics
- Automatically enabled when deployed to Vercel
- No additional setup required
- View analytics in your Vercel dashboard

## 🌟 How It Works

1. **Choose Your Journey**: Select a quiz style that resonates with you
2. **Answer Fixed Questions**: 9 carefully crafted baseline questions
3. **AI Adaptive Questions**: 11 personalized questions generated by AI based on your responses
4. **Get Your Results**: Receive a comprehensive Ikigai profile with actionable insights

## 🎯 About Ikigai

Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." It represents the intersection of four fundamental elements:

- **What you Love** (Passion)
- **What you're Good At** (Profession) 
- **What the World Needs** (Mission)
- **What you can be Paid For** (Vocation)

This quiz helps you explore these dimensions through thoughtful questions and AI-powered analysis.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with love using modern web technologies
- Inspired by the timeless wisdom of Ikigai
- Powered by OpenAI's advanced language models
- Analytics by Vercel Analytics and Google Analytics

---

**Ready to discover your Ikigai?** 🌸 Start your journey at [ikigaime.com](https://ikigaime.com)! 