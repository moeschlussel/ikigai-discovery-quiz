interface AIQuestionRequest {
  currentProfile: any;
  targetCategory: string;
  quizStyle: string;
  questionNumber: number;
  previousQuestions?: string[]; // Add this to avoid repetition
  usedAnswerOptions?: string[]; // Add this to avoid repeated answers
}

interface AIQuestionResponse {
  targetCategory: string;
  question: string;
  options: string[];
  reasoning?: string;
}

interface AIProfileRequest {
  quizStyle: string;
  answers: Array<{
    question: string;
    options: string[];
    selected: string;
  }>;
}

interface AIProfileResponse {
  userProfile: any;
  insights: string[];
}

interface AIUpdateRequest {
  currentProfile: any;
  targetCategory: string;
  question: string;
  selectedAnswer: string;
  quizStyle: string;
}

interface AIUpdateResponse {
  updatedProfile: any;
  insights: string[];
}

interface AIFinalSummaryRequest {
  profile: any;
  quizStyle: string;
  allAnswers: any[];
}

interface AIFinalSummaryResponse {
  IkigaiSummary: string;
  Persona: string;
  CareerSuggestions: string[];
  HobbySuggestions: string[];
  ConfidenceRadar: {
    Passion: number;
    Profession: number;
    Mission: number;
    Vocation: number;
  };
  DetailedInsights: string[];
}

interface ComprehensiveAnalysisRequest {
  questionsAndAnswers: Array<{
    questionNumber: number;
    questionText: string;
    options: string[];
    selectedAnswer: string;
    selectedIndex: number;
  }>;
}

interface ComprehensiveAnalysisResponse {
  // Individual question analysis
  questionAnalysis: Array<{
    questionNumber: number;
    choiceAnalysis: string;
    valueInsights: string;
  }>;
  
  // Core Ikigai categories
  ikigaiProfile: {
    Passion: {
      description: string;
      confidence: number;
    };
    Profession: {
      description: string;
      confidence: number;
    };
    Vocation: {
      description: string;
      confidence: number;
    };
    Mission: {
      description: string;
      confidence: number;
    };
  };
  
  // Personality traits
  personalityTraits: {
    'Risk Tolerance': { value: string; explanation: string; confidence: number };
    'Time Horizon': { value: string; explanation: string; confidence: number };
    'Lifestyle Desires': { value: string; explanation: string; confidence: number };
    'Biggest Fears': { value: string; explanation: string; confidence: number };
    'Ideal Work Environment': { value: string; explanation: string; confidence: number };
    'Social Orientation': { value: string; explanation: string; confidence: number };
    'Monetization Preference': { value: string; explanation: string; confidence: number };
  };
  
  // Final synthesis
  ikigaiStatement: string;
  personaLabel: string;
  careerPaths: string[];
  lifestyleSuggestions: string[];
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'gpt-3.5-turbo';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initializeProfile(request: AIProfileRequest): Promise<AIProfileResponse> {
    const prompt = this.buildInitialProfilePrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert Ikigai counselor. Analyze responses objectively and build accurate personality profiles. Follow the user\'s actual interests and values - don\'t impose your own assumptions about what they should care about.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1200,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseProfileResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI profile initialization failed:', error);
      return this.generateFallbackProfile(request);
    }
  }

  async generateAdaptiveQuestion(request: AIQuestionRequest): Promise<AIQuestionResponse> {
    // DISABLED: No curated questions - only AI-generated based on profile
    // const curatedQuestion = this.getCuratedQuestion(request);
    // if (curatedQuestion) {
    //   return curatedQuestion;
    // }

    const prompt = this.buildAdaptiveQuestionPrompt(request);
    
    try {
      console.log('Attempting AI question generation for:', request.targetCategory);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at creating personalized Ikigai questions. Generate diverse questions that explore the user\'s actual interests and values. Don\'t assume what they should care about - follow their lead. Create varied questions about personal growth, career development, relationships, creativity, values, and individual fulfillment. Be responsive to their unique profile.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 400,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API Error:', response.status, response.statusText, errorText);
        throw new Error(`AI service failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Question Generated Successfully:', data.choices[0].message.content);
      
      const aiQuestion = this.parseQuestionResponse(data.choices[0].message.content);
      console.log('Parsed AI Question:', aiQuestion);
      
      return aiQuestion;
    } catch (error) {
      console.error('AI question generation failed completely:', error);
      
      // NO FALLBACKS - throw error to stop the quiz
      throw new Error(`Failed to generate AI question: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`);
    }
  }

  private getCuratedQuestion(request: AIQuestionRequest): AIQuestionResponse | null {
    // Check if we should avoid duplicates
    const previousQuestions = request.previousQuestions || [];
    const usedAnswers = request.usedAnswerOptions || [];

    // Diverse, balanced questions that respond to user interests
    const curatedQuestions = {
      Passion: [
        {
          question: "When you lose track of time, what are you usually doing?",
          options: [
            "Creating art, music, or writing something meaningful",
            "Learning new skills or mastering technical challenges",
            "Having deep conversations or helping someone",
            "Planning projects or organizing something important"
          ],
          reasoning: "Understanding your natural flow states and intrinsic motivations"
        },
        {
          question: "What type of content do you find yourself consuming in your free time?",
          options: [
            "Art, design, music, or creative inspiration",
            "Educational content, tutorials, or skill-building materials",
            "Stories about people overcoming challenges or making a difference",
            "Business insights, productivity tips, or success stories"
          ],
          reasoning: "Revealing what naturally draws your attention and interest"
        },
        {
          question: "If you could spend a year learning anything without worrying about money, what would it be?",
          options: [
            "A creative skill like painting, music, or creative writing",
            "A technical skill like programming, engineering, or data science",
            "Skills for helping others like counseling, teaching, or healthcare",
            "Business skills like entrepreneurship, investing, or leadership"
          ],
          reasoning: "Exploring your deepest learning desires and natural curiosity"
        },
        {
          question: "What kind of conversations energize you most?",
          options: [
            "Discussing art, creativity, and self-expression",
            "Exploring how things work and sharing knowledge",
            "Talking about personal growth and helping others",
            "Planning projects and discussing opportunities"
          ],
          reasoning: "Understanding what topics naturally engage and inspire you"
        }
      ],
      Profession: [
        {
          question: "What type of problem-solving energizes you most?",
          options: [
            "Creative challenges that require original thinking",
            "Technical puzzles with clear, logical solutions",
            "People problems that require empathy and understanding",
            "Strategic challenges that require planning and execution"
          ],
          reasoning: "Identifying your natural problem-solving strengths and preferences"
        },
        {
          question: "When working on a team project, what role do you naturally gravitate toward?",
          options: [
            "The creative visionary who generates innovative ideas",
            "The technical expert who ensures quality and accuracy",
            "The people person who facilitates communication and collaboration",
            "The project leader who coordinates and drives results"
          ],
          reasoning: "Understanding your natural professional strengths and working style"
        },
        {
          question: "What type of feedback makes you feel most accomplished?",
          options: [
            "\"Your work is beautiful and inspiring\"",
            "\"Your solution is brilliant and well-executed\"",
            "\"You really helped me and made a difference\"",
            "\"Your leadership delivered excellent results\""
          ],
          reasoning: "Revealing what type of professional impact fulfills you most"
        },
        {
          question: "Which skill development excites you most right now?",
          options: [
            "Artistic and creative abilities that let me express myself",
            "Technical and analytical skills that solve complex problems",
            "Communication and interpersonal skills for working with people",
            "Strategic and business skills for creating value"
          ],
          reasoning: "Understanding where you want to grow professionally"
        }
      ],
      Mission: [
        {
          question: "What kind of positive impact do you most want to have on others?",
          options: [
            "Inspiring them to express themselves and pursue their dreams",
            "Teaching them valuable skills or helping them solve problems",
            "Supporting them through difficult times and helping them heal",
            "Creating opportunities that help them succeed and prosper"
          ],
          reasoning: "Understanding your desire to contribute and serve others"
        },
        {
          question: "When you see someone struggling, what's your first instinct?",
          options: [
            "Help them find creative ways to express their feelings",
            "Teach them skills or knowledge that could help",
            "Listen to them and provide emotional support",
            "Connect them with resources or opportunities"
          ],
          reasoning: "Revealing your natural approach to helping and serving others"
        },
        {
          question: "What type of legacy would make you feel most fulfilled?",
          options: [
            "Being remembered for beautiful work that inspired people",
            "Being known for innovations that improved how things work",
            "Being remembered for the lives you touched and helped",
            "Being known for creating lasting value and opportunities"
          ],
          reasoning: "Exploring your deeper sense of purpose and desired impact"
        },
        {
          question: "Which cause or area would you most like to contribute to?",
          options: [
            "Arts, culture, and creative expression in society",
            "Education, knowledge sharing, and skill development",
            "Mental health, wellness, and personal development",
            "Economic opportunity and community development"
          ],
          reasoning: "Understanding what areas of contribution resonate with your values"
        }
      ],
      Vocation: [
        {
          question: "What's your relationship with money and financial success?",
          options: [
            "Money should support my creative freedom and authentic expression",
            "Money should reflect the value of my expertise and skills",
            "Money should enable me to help more people and causes I care about",
            "Money is a tool for creating more opportunities and building wealth"
          ],
          reasoning: "Understanding your values around money and economic success"
        },
        {
          question: "How do you prefer to create value for others?",
          options: [
            "Through beautiful, meaningful experiences or creative work",
            "Through expertise, knowledge, and high-quality solutions",
            "Through care, support, and helping people improve their lives",
            "Through efficient systems, opportunities, and profitable ventures"
          ],
          reasoning: "Identifying how you naturally create economic value"
        },
        {
          question: "What type of work environment would you pay to be part of?",
          options: [
            "A creative studio or artistic community",
            "A cutting-edge research lab or innovation center",
            "A mission-driven organization helping people",
            "A dynamic startup or entrepreneurial environment"
          ],
          reasoning: "Understanding what type of work culture energizes and motivates you"
        },
        {
          question: "How do you prefer to approach financial planning and career growth?",
          options: [
            "Focus on creative fulfillment first, money will follow passion",
            "Build valuable skills and expertise that command good compensation",
            "Ensure my work serves others while providing sustainable income",
            "Strategically build wealth and create multiple income streams"
          ],
          reasoning: "Understanding your approach to building financial security"
        }
      ]
    };

    const categoryQuestions = curatedQuestions[request.targetCategory as keyof typeof curatedQuestions];
    if (!categoryQuestions) return null;

    // Find a question that hasn't been asked and doesn't have repeated answers
    for (let i = 0; i < categoryQuestions.length; i++) {
      const questionIndex = (request.questionNumber - 10 + i) % categoryQuestions.length;
      const selectedQuestion = categoryQuestions[questionIndex];
      
      // Check if this question has been asked before
      if (previousQuestions.includes(selectedQuestion.question)) {
        continue;
      }
      
      // Check if any of the answer options have been used before
      const hasRepeatedAnswers = selectedQuestion.options.some(option => 
        usedAnswers.some(usedAnswer => 
          option.toLowerCase().trim() === usedAnswer.toLowerCase().trim() ||
          this.calculateSimilarity(option.toLowerCase(), usedAnswer.toLowerCase()) > 0.8
        )
      );
      
      if (hasRepeatedAnswers) {
        continue;
      }
      
      // This question is unique, use it
      return {
        targetCategory: request.targetCategory,
        question: selectedQuestion.question,
        options: selectedQuestion.options,
        reasoning: selectedQuestion.reasoning
      };
    }
    
    // If no unique curated question found, let AI generate one
    return null;
  }

  // Helper method for similarity calculation
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ').filter(word => word.length > 2);
    const words2 = str2.split(' ').filter(word => word.length > 2);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  async updateProfile(request: AIUpdateRequest): Promise<AIUpdateResponse> {
    const prompt = this.buildUpdatePrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at interpreting quiz responses and updating profiles efficiently. Analyze answers objectively and update profiles with meaningful insights based on what the user actually said, not assumptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 800,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseUpdateResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI profile update failed:', error);
      return this.generateFallbackUpdate(request);
    }
  }

  async generateFinalSummary(request: AIFinalSummaryRequest): Promise<AIFinalSummaryResponse> {
    const prompt = this.buildFinalSummaryPrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert Ikigai counselor. Create comprehensive, personalized summaries with actionable career and life guidance. Be insightful and practical. Base recommendations on the user\'s actual interests and values, not generic assumptions. Focus on diverse career paths that match their unique profile.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 1500,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseFinalSummaryResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI final summary failed:', error);
      return this.generateFallbackSummary(request);
    }
  }

  async generateComprehensiveAnalysis(request: ComprehensiveAnalysisRequest): Promise<ComprehensiveAnalysisResponse> {
    const prompt = this.buildComprehensiveAnalysisPrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a purpose and career design coach trained in the Japanese framework of Ikigai, which helps people find their unique sweet spot where what they love, what they're good at, what the world needs, and what they can be paid for all intersect.

You have received 20 structured multiple-choice questions from a user. Each question had 4 possible answers, and the user chose one. Your task is to deeply analyze their choices vs. what they didn't choose, to build a rich, human-centered profile of the user and output their personalized Ikigai.

⸻

💡 CRITICAL: Write ALL descriptions and explanations in SECOND PERSON, speaking directly to the user. Use "You are...", "You prefer...", "You thrive when...", etc. NEVER use "The user is..." or "They prefer..." or any third person language.

Include the following instructions:
1. Analyze each question individually, comparing the user's chosen answer to the other three options. What does their choice suggest about their values, tendencies, interests, and avoidance patterns?
2. Based on their total set of 20 choices, construct a user profile across the following core Ikigai categories:
• Passion: What they love (interests, flow activities, intrinsic joy)
• Profession: What they are good at (skills, strengths, talents)
• Vocation: What they can be paid for (marketable traits, money mindset)
• Mission: What the world needs (social focus, purpose, contribution)
3. For each category, include:
• A 2–3 sentence summary description written in SECOND PERSON ("You are energized by...", "You excel at...")
• A confidence score from 1 to 100 based on how clearly their answers reflect that domain
4. Then, rate and summarize the following personality traits (with short explanations in SECOND PERSON and confidence scores):
• Risk Tolerance
• Time Horizon
• Lifestyle Desires
• Biggest Fears
• Ideal Work Environment
• Social Orientation
• Monetization Preference (e.g. employment, freelancing, passive income, etc.)
5. Finally, generate:
• A concise Ikigai statement in 1–2 sentences using SECOND PERSON
• A nickname or persona label (e.g. "The Soulful Builder" or "The Maverick Mentor")
• 2–3 career paths or life directions that align with this profile
• 2–3 hobby or lifestyle suggestions that would energize them`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseComprehensiveAnalysisResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI comprehensive analysis failed:', error);
      return this.generateFallbackComprehensiveAnalysis(request);
    }
  }

  private buildInitialProfilePrompt(request: AIProfileRequest): string {
    return `
Analyze these Ikigai quiz responses and create a comprehensive initial profile.

Quiz Style: ${request.quizStyle}

User's Answers:
${JSON.stringify(request.answers, null, 2)}

Create a detailed profile with:

1. **Ikigai Categories Analysis:**
   - Passion: What they love (creative expression, interests, energy sources)
   - Profession: What they're good at (skills, talents, abilities)
   - Mission: What the world needs (contribution, impact, helping others)
   - Vocation: What they can be paid for (market opportunities, business sense)

2. **Confidence Scores (1-100):** Based on how clearly each category emerges from their actual responses
3. **Personality Traits:** Risk tolerance, time horizon, lifestyle, fears, work environment

Analyze holistically - look for patterns and deeper meanings in their actual answers. Don't impose assumptions about what they should care about.

Format as JSON:
{
  "Passion": {
    "description": "Detailed analysis of your passions based on your responses",
    "confidence": 75
  },
  "Profession": {
    "description": "Analysis of your skills and capabilities from your answers",
    "confidence": 60
  },
  "Mission": {
    "description": "Your sense of purpose and contribution based on what you said",
    "confidence": 45
  },
  "Vocation": {
    "description": "Your relationship with money and opportunities from your responses",
    "confidence": 55
  },
  "Traits": {
    "Risk Tolerance": { "value": "Moderate risk-taker", "confidence": 70 },
    "Time Horizon": { "value": "Long-term thinker", "confidence": 65 },
    "Lifestyle Desires": { "value": "Work-life balance", "confidence": 80 },
    "Biggest Fears": { "value": "Lack of fulfillment", "confidence": 60 },
    "Ideal Work Environment": { "value": "Collaborative and creative", "confidence": 75 }
  },
  "insights": ["Key insight from their responses", "Another observation based on their answers"]
}
`;
  }

  private buildAdaptiveQuestionPrompt(request: AIQuestionRequest): string {
    const previousQuestionsText = request.previousQuestions && request.previousQuestions.length > 0 
      ? `\n\nPrevious Questions Asked:\n${request.previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';
    
    const usedAnswersText = request.usedAnswerOptions && request.usedAnswerOptions.length > 0
      ? `\n\nPreviously Used Answer Options:\n${request.usedAnswerOptions.join(', ')}`
      : '';

    return `
Generate a personalized question to explore "${request.targetCategory}" (lowest confidence area).

Current Profile:
- Passion: ${request.currentProfile.Passion?.description} (${request.currentProfile.Passion?.confidence}%)
- Profession: ${request.currentProfile.Profession?.description} (${request.currentProfile.Profession?.confidence}%)
- Mission: ${request.currentProfile.Mission?.description} (${request.currentProfile.Mission?.confidence}%)
- Vocation: ${request.currentProfile.Vocation?.description} (${request.currentProfile.Vocation?.confidence}%)

Quiz Style: ${request.quizStyle}
Question #: ${request.questionNumber}/20
Target: ${request.targetCategory}${previousQuestionsText}${usedAnswersText}

IMPORTANT REQUIREMENTS:
1. Create a question that is COMPLETELY DIFFERENT from any previous questions
2. Use answer options that are UNIQUE and haven't been used before
3. Avoid similar wording, concepts, or phrasing from previous questions
4. Generate fresh perspectives on ${request.targetCategory}
5. If previous questions exist, take a different angle or approach

Create a question that:
1. Matches "${request.quizStyle}" style
2. Explores "${request.targetCategory}" deeply
3. Has 4 distinct, unique options that cover different approaches/values
4. Will increase confidence in this area
5. Is responsive to their existing profile (build on what they've already shown interest in)
6. Covers diverse topics: personal growth, career preferences, relationships, creativity, values, lifestyle
7. Uses completely new wording and concepts not seen in previous questions

Generate varied questions. Don't default to global issues unless their profile shows environmental/social activism interests.

Format as JSON:
{
  "targetCategory": "${request.targetCategory}",
  "question": "Your completely unique personalized question based on their profile",
  "options": [
    "Unique Option A",
    "Unique Option B", 
    "Unique Option C",
    "Unique Option D"
  ],
  "reasoning": "Why this helps explore ${request.targetCategory} for this specific person"
}
`;
  }

  private buildUpdatePrompt(request: AIUpdateRequest): string {
    return `
Update profile based on latest answer.

Current Profile:
- Passion: ${request.currentProfile.Passion?.description} (${request.currentProfile.Passion?.confidence}%)
- Profession: ${request.currentProfile.Profession?.description} (${request.currentProfile.Profession?.confidence}%)
- Mission: ${request.currentProfile.Mission?.description} (${request.currentProfile.Mission?.confidence}%)
- Vocation: ${request.currentProfile.Vocation?.description} (${request.currentProfile.Vocation?.confidence}%)

Question: "${request.question}"
Answer: "${request.selectedAnswer}"
Target: ${request.targetCategory}

Update the profile by:
1. Increasing target category confidence (+10 to +20 points)
2. Updating description with new insights from your specific answer
3. Updating relevant traits based on what your answer reveals
4. Cross-category updates if your answer provides insights for other areas

Base updates on their actual answer, not assumptions. Be responsive to what they're telling you about themselves.

Return COMPLETE updated profile:

{
  "updatedProfile": {
    "Passion": { "description": "...", "confidence": 85 },
    "Profession": { "description": "...", "confidence": 75 },
    "Mission": { "description": "...", "confidence": 90 },
    "Vocation": { "description": "...", "confidence": 70 },
    "Traits": {
      "Risk Tolerance": { "value": "...", "confidence": 80 },
      "Time Horizon": { "value": "...", "confidence": 75 },
      "Lifestyle Desires": { "value": "...", "confidence": 85 },
      "Biggest Fears": { "value": "...", "confidence": 70 },
      "Ideal Work Environment": { "value": "...", "confidence": 80 }
    }
  },
  "insights": ["What this specific answer revealed", "How understanding changed based on their response"]
}
`;
  }

  private buildFinalSummaryPrompt(request: AIFinalSummaryRequest): string {
    return `
Create comprehensive Ikigai summary based on this person's actual responses and profile.

Final Profile:
- Passion: ${request.profile.Passion?.description} (${request.profile.Passion?.confidence}%)
- Profession: ${request.profile.Profession?.description} (${request.profile.Profession?.confidence}%)
- Mission: ${request.profile.Mission?.description} (${request.profile.Mission?.confidence}%)
- Vocation: ${request.profile.Vocation?.description} (${request.profile.Vocation?.confidence}%)

Quiz Style: ${request.quizStyle}

Generate personalized recommendations based on THEIR specific interests and values shown in their responses. Don't make generic assumptions.

Generate:
1. **Ikigai Summary:** 2-3 sentences describing your unique purpose based on your specific profile
2. **Persona:** Memorable title that reflects your specific combination of traits
3. **Career Suggestions:** 3-5 specific career paths that match your actual interests and strengths
4. **Hobby Suggestions:** 3-5 fulfilling activities that align with your demonstrated passions
5. **Insights:** Key observations based on your specific responses and recommendations

Be responsive to your actual interests. If you showed interest in environmental issues, include that. If you're more focused on personal creativity, focus there. Match your actual profile.

Format as JSON:
{
  "IkigaiSummary": "Compelling description of your purpose based on your specific profile",
  "Persona": "The [Adjective] [Noun] that reflects your unique combination",
  "CareerSuggestions": [
    "Specific career matching your interests with brief explanation",
    "Another career path aligned with your values",
    "Third career suggestion based on your strengths"
  ],
  "HobbySuggestions": [
    "Hobby aligning with your demonstrated passions",
    "Activity developing skills you showed interest in",
    "Pursuit serving your specific mission interests"
  ],
  "ConfidenceRadar": {
    "Passion": ${request.profile.Passion?.confidence || 50},
    "Profession": ${request.profile.Profession?.confidence || 50},
    "Mission": ${request.profile.Mission?.confidence || 50},
    "Vocation": ${request.profile.Vocation?.confidence || 50}
  },
  "DetailedInsights": [
    "Key strength to leverage based on your responses",
    "Area for growth specific to your profile",
    "Unique combination you possess",
    "Next steps tailored to your interests"
  ]
}
`;
  }

  private buildComprehensiveAnalysisPrompt(request: ComprehensiveAnalysisRequest): string {
    const questionsData = request.questionsAndAnswers.map(qa => `
Question ${qa.questionNumber}: ${qa.questionText}
Options:
A) ${qa.options[0]}
B) ${qa.options[1]}
C) ${qa.options[2]}
D) ${qa.options[3]}
User chose: ${String.fromCharCode(65 + qa.selectedIndex)}) ${qa.selectedAnswer}
`).join('\n');

    return `
Please analyze the following 20 questions and the user's choices to create a comprehensive Ikigai profile:

${questionsData}

IMPORTANT: Write ALL descriptions and explanations in SECOND PERSON, speaking directly to the user. Use "You are...", "You prefer...", "You thrive when...", etc. NEVER use "The user is..." or "They prefer..." or any third person language.

Provide your analysis in the following JSON format:
{
  "questionAnalysis": [
    {
      "questionNumber": 1,
      "choiceAnalysis": "What your specific choice reveals about your preferences and values",
      "valueInsights": "What this suggests about your core values and avoidance patterns"
    }
    // ... for all 20 questions
  ],
  "ikigaiProfile": {
    "Passion": {
      "description": "2-3 sentences about what you love based on your choices - use 'You are energized by...', 'You find joy in...'",
      "confidence": 85
    },
    "Profession": {
      "description": "2-3 sentences about what you're good at based on your choices - use 'You excel at...', 'You have a talent for...'", 
      "confidence": 78
    },
    "Vocation": {
      "description": "2-3 sentences about what you can be paid for based on your choices - use 'You can create value through...', 'You have the ability to...'",
      "confidence": 82
    },
    "Mission": {
      "description": "2-3 sentences about what the world needs from you based on your choices - use 'You are called to...', 'You feel drawn to...'",
      "confidence": 75
    }
  },
  "personalityTraits": {
    "Risk Tolerance": {
      "value": "Moderate risk-taker",
      "explanation": "Short explanation based on your choices - use 'You balance...' or 'You prefer...'",
      "confidence": 80
    },
    "Time Horizon": {
      "value": "Long-term focused",
      "explanation": "Short explanation based on your choices - use 'You think strategically...' or 'You focus on...'", 
      "confidence": 85
    },
    "Lifestyle Desires": {
      "value": "Work-life balance",
      "explanation": "Short explanation based on your choices - use 'You seek...' or 'You value...'",
      "confidence": 90
    },
    "Biggest Fears": {
      "value": "Lack of purpose",
      "explanation": "Short explanation based on your choices - use 'You worry about...' or 'You fear...'",
      "confidence": 75
    },
    "Ideal Work Environment": {
      "value": "Collaborative and creative",
      "explanation": "Short explanation based on your choices - use 'You thrive in...' or 'You prefer...'",
      "confidence": 88
    },
    "Social Orientation": {
      "value": "Team-oriented",
      "explanation": "Short explanation based on your choices - use 'You enjoy...' or 'You work best when...'",
      "confidence": 82
    },
    "Monetization Preference": {
      "value": "Traditional employment",
      "explanation": "Short explanation based on your choices - use 'You prefer...' or 'You value...'",
      "confidence": 78
    }
  },
  "ikigaiStatement": "1-2 sentence statement of your unique Ikigai based on all your choices - use 'Your Ikigai lies...' or 'You find your purpose...'",
  "personaLabel": "The [Adjective] [Noun] - a memorable nickname that captures your essence",
  "careerPaths": [
    "Specific career path 1 with brief explanation",
    "Specific career path 2 with brief explanation", 
    "Specific career path 3 with brief explanation"
  ],
  "lifestyleSuggestions": [
    "Hobby/lifestyle suggestion 1 with brief explanation",
    "Hobby/lifestyle suggestion 2 with brief explanation",
    "Hobby/lifestyle suggestion 3 with brief explanation"
  ]
}
`;
  }

  private parseProfileResponse(content: string): AIProfileResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        userProfile: {
          Passion: parsed.Passion,
          Profession: parsed.Profession,
          Mission: parsed.Mission,
          Vocation: parsed.Vocation,
          Traits: parsed.Traits
        },
        insights: parsed.insights || []
      };
    } catch {
      return this.generateFallbackProfile({ quizStyle: 'introspective', answers: [] });
    }
  }

  private parseQuestionResponse(content: string): AIQuestionResponse {
    try {
      return JSON.parse(content);
    } catch {
      return {
        targetCategory: 'Passion',
        question: "What activity makes you feel most alive and energized?",
        options: [
          "Creating something beautiful or meaningful",
          "Solving complex problems with skill",
          "Helping others overcome challenges",
          "Building something valuable and profitable"
        ],
        reasoning: "Exploring core motivations and energy sources"
      };
    }
  }

  private parseUpdateResponse(content: string): AIUpdateResponse {
    try {
      return JSON.parse(content);
    } catch {
      return {
        updatedProfile: {
          Passion: { description: "Exploring creative interests", confidence: 60 },
          Profession: { description: "Developing practical skills", confidence: 65 },
          Mission: { description: "Finding ways to contribute", confidence: 70 },
          Vocation: { description: "Building career opportunities", confidence: 55 },
          Traits: {
            'Risk Tolerance': { value: 'Moderate', confidence: 60 },
            'Time Horizon': { value: 'Medium-term', confidence: 65 },
            'Lifestyle Desires': { value: 'Balanced', confidence: 70 },
            'Biggest Fears': { value: 'Uncertainty', confidence: 60 },
            'Ideal Work Environment': { value: 'Collaborative', confidence: 65 }
          }
        },
        insights: ["Profile updated based on response"]
      };
    }
  }

  private parseFinalSummaryResponse(content: string): AIFinalSummaryResponse {
    try {
      return JSON.parse(content);
    } catch {
      return {
        IkigaiSummary: "You find purpose through meaningful work that combines your unique talents with opportunities to make a positive impact.",
        Persona: "The Balanced Seeker",
        CareerSuggestions: [
          "Project Manager in mission-driven organization",
          "Consultant helping businesses improve",
          "Educator sharing knowledge and skills"
        ],
        HobbySuggestions: [
          "Volunteer for causes you care about",
          "Learn new creative skills",
          "Mentor others in your areas of expertise"
        ],
        ConfidenceRadar: {
          Passion: 70,
          Profession: 75,
          Mission: 80,
          Vocation: 65
        },
        DetailedInsights: [
          "Key strength to leverage based on your responses",
          "Area for growth specific to your profile",
          "Unique combination you possess",
          "Next steps tailored to your interests"
        ]
      };
    }
  }

  private parseComprehensiveAnalysisResponse(content: string): ComprehensiveAnalysisResponse {
    try {
      return JSON.parse(content);
    } catch {
      return {
        questionAnalysis: [],
        ikigaiProfile: {
          Passion: { description: "You are driven by creative expression and meaningful pursuits that align with your values.", confidence: 70 },
          Profession: { description: "You excel at analytical thinking and problem-solving with attention to detail.", confidence: 75 },
          Vocation: { description: "You can create value through expertise-based services and collaborative work.", confidence: 65 },
          Mission: { description: "You feel called to contribute to positive change and help others grow.", confidence: 80 }
        },
        personalityTraits: {
          'Risk Tolerance': { value: "Moderate", explanation: "You balance calculated risks with stability", confidence: 70 },
          'Time Horizon': { value: "Long-term", explanation: "You think strategically about future outcomes", confidence: 75 },
          'Lifestyle Desires': { value: "Balanced", explanation: "You seek harmony between work and personal life", confidence: 80 },
          'Biggest Fears': { value: "Unfulfillment", explanation: "You worry about not living up to your potential", confidence: 65 },
          'Ideal Work Environment': { value: "Collaborative", explanation: "You thrive in team-oriented settings", confidence: 75 },
          'Social Orientation': { value: "Team-focused", explanation: "You prefer working with others toward shared goals", confidence: 70 },
          'Monetization Preference': { value: "Employment", explanation: "You value stability and structured career growth", confidence: 68 }
        },
        ikigaiStatement: "Your Ikigai lies at the intersection of creative problem-solving and meaningful contribution to others' growth and success.",
        personaLabel: "The Thoughtful Catalyst",
        careerPaths: [
          "Product Manager - combining your analytical skills with user-focused innovation",
          "Learning & Development Specialist - helping others grow while using your expertise",
          "Nonprofit Program Director - creating positive impact through strategic leadership"
        ],
        lifestyleSuggestions: [
          "Join a professional mentoring program to share your knowledge",
          "Take up creative hobbies that combine learning with self-expression",
          "Volunteer for causes that align with your values and skills"
        ]
      };
    }
  }

  private generateFallbackProfile(request: AIProfileRequest): AIProfileResponse {
    return {
      userProfile: {
        Passion: { description: "Exploring creative and meaningful pursuits", confidence: 60 },
        Profession: { description: "Developing technical and analytical skills", confidence: 65 },
        Mission: { description: "Contributing to positive change in the world", confidence: 70 },
        Vocation: { description: "Building sustainable career opportunities", confidence: 55 },
        Traits: {
          'Risk Tolerance': { value: 'Moderate', confidence: 60 },
          'Time Horizon': { value: 'Medium-term', confidence: 65 },
          'Lifestyle Desires': { value: 'Balanced', confidence: 70 },
          'Biggest Fears': { value: 'Unfulfillment', confidence: 60 },
          'Ideal Work Environment': { value: 'Collaborative', confidence: 65 }
        }
      },
      insights: ["Continue exploring your interests", "Focus on developing your strengths"]
    };
  }

  private generateFallbackQuestion(request: AIQuestionRequest): AIQuestionResponse {
    const questions = {
      Passion: [
        {
          question: "What type of work would you do even if you weren't paid for it?",
          options: [
            "Creative projects that express my unique vision",
            "Technical challenges that require deep expertise",
            "Community service that helps people directly",
            "Business ventures that create value for others"
          ]
        },
        {
          question: "When you lose track of time, what are you usually doing?",
          options: [
            "Creating art, music, or writing something meaningful",
            "Learning new skills or solving complex problems",
            "Having deep conversations or helping someone",
            "Planning projects or organizing something important"
          ]
        }
      ],
      Profession: [
        {
          question: "Which skill development excites you most?",
          options: [
            "Artistic and creative abilities",
            "Technical and analytical skills",
            "Interpersonal and communication skills",
            "Strategic and business skills"
          ]
        },
        {
          question: "What type of problem-solving energizes you most?",
          options: [
            "Creative challenges that require original thinking",
            "Technical puzzles with clear, logical solutions",
            "People problems that require empathy and understanding",
            "Strategic challenges that require planning and execution"
          ]
        }
      ],
      Mission: [
        {
          question: "What kind of positive impact do you most want to have on others?",
          options: [
            "Inspiring them to express themselves and pursue their dreams",
            "Teaching them valuable skills or helping them solve problems",
            "Supporting them through difficult times and helping them heal",
            "Creating opportunities that help them succeed and prosper"
          ]
        },
        {
          question: "When you see someone struggling, what's your first instinct?",
          options: [
            "Help them find creative ways to express their feelings",
            "Teach them skills or knowledge that could help",
            "Listen to them and provide emotional support",
            "Connect them with resources or opportunities"
          ]
        }
      ],
      Vocation: [
        {
          question: "What's your relationship with money and financial success?",
          options: [
            "Money should support my creative freedom and authentic expression",
            "Money should reflect the value of my expertise and skills",
            "Money should enable me to help more people and causes I care about",
            "Money is a tool for creating more opportunities and building wealth"
          ]
        },
        {
          question: "How do you prefer to create value for others?",
          options: [
            "Through beautiful, meaningful experiences or creative work",
            "Through expertise, knowledge, and high-quality solutions",
            "Through care, support, and helping people improve their lives",
            "Through efficient systems, opportunities, and profitable ventures"
          ]
        }
      ]
    };

    const categoryQuestions = questions[request.targetCategory as keyof typeof questions] || questions.Passion;
    const questionIndex = Math.floor(Math.random() * categoryQuestions.length);
    const selectedQuestion = categoryQuestions[questionIndex];
    
    return {
      targetCategory: request.targetCategory,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
      reasoning: `Exploring ${request.targetCategory} to increase confidence`
    };
  }

  private generateFallbackUpdate(request: AIUpdateRequest): AIUpdateResponse {
    const currentProfile = { ...request.currentProfile };
    
    // Increase confidence in target category
    if (currentProfile[request.targetCategory]) {
      currentProfile[request.targetCategory].confidence = Math.min(
        currentProfile[request.targetCategory].confidence + 15, 
        95
      );
    }

    return {
      updatedProfile: currentProfile,
      insights: [`Updated ${request.targetCategory} based on response`]
    };
  }

  private generateFallbackSummary(request: AIFinalSummaryRequest): AIFinalSummaryResponse {
    return {
      IkigaiSummary: "You find purpose through meaningful work that combines your unique talents with opportunities to make a positive impact.",
      Persona: "The Balanced Seeker",
      CareerSuggestions: [
        "Project Manager in mission-driven organization",
        "Consultant helping businesses improve",
        "Educator sharing knowledge and skills"
      ],
      HobbySuggestions: [
        "Volunteer for causes you care about",
        "Learn new creative skills",
        "Mentor others in your areas of expertise"
      ],
      ConfidenceRadar: {
        Passion: request.profile.Passion?.confidence || 70,
        Profession: request.profile.Profession?.confidence || 75,
        Mission: request.profile.Mission?.confidence || 80,
        Vocation: request.profile.Vocation?.confidence || 65
      },
      DetailedInsights: [
        "Key strength to leverage based on your responses",
        "Area for growth specific to your profile",
        "Unique combination you possess",
        "Next steps tailored to your interests"
      ]
    };
  }

  private generateFallbackComprehensiveAnalysis(request: ComprehensiveAnalysisRequest): ComprehensiveAnalysisResponse {
    return {
      questionAnalysis: [],
      ikigaiProfile: {
        Passion: { description: "You are driven by creative expression and meaningful pursuits that align with your values.", confidence: 70 },
        Profession: { description: "You excel at analytical thinking and problem-solving with attention to detail.", confidence: 75 },
        Vocation: { description: "You can create value through expertise-based services and collaborative work.", confidence: 65 },
        Mission: { description: "You feel called to contribute to positive change and help others grow.", confidence: 80 }
      },
      personalityTraits: {
        'Risk Tolerance': { value: "Moderate", explanation: "You balance calculated risks with stability", confidence: 70 },
        'Time Horizon': { value: "Long-term", explanation: "You think strategically about future outcomes", confidence: 75 },
        'Lifestyle Desires': { value: "Balanced", explanation: "You seek harmony between work and personal life", confidence: 80 },
        'Biggest Fears': { value: "Unfulfillment", explanation: "You worry about not living up to your potential", confidence: 65 },
        'Ideal Work Environment': { value: "Collaborative", explanation: "You thrive in team-oriented settings", confidence: 75 },
        'Social Orientation': { value: "Team-focused", explanation: "You prefer working with others toward shared goals", confidence: 70 },
        'Monetization Preference': { value: "Employment", explanation: "You value stability and structured career growth", confidence: 68 }
      },
      ikigaiStatement: "Your Ikigai lies at the intersection of creative problem-solving and meaningful contribution to others' growth and success.",
      personaLabel: "The Thoughtful Catalyst",
      careerPaths: [
        "Product Manager - combining your analytical skills with user-focused innovation",
        "Learning & Development Specialist - helping others grow while using your expertise",
        "Nonprofit Program Director - creating positive impact through strategic leadership"
      ],
      lifestyleSuggestions: [
        "Join a professional mentoring program to share your knowledge",
        "Take up creative hobbies that combine learning with self-expression",
        "Volunteer for causes that align with your values and skills"
      ]
    };
  }
}

// Singleton instance
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) {
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      console.warn('OpenAI API key not found. Using simulated AI responses.');
    }
    aiService = new AIService(apiKey);
  }
  return aiService;
}