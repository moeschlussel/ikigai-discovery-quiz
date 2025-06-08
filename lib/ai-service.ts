interface AIQuestionRequest {
  currentProfile: any;
  targetCategory: string;
  quizStyle: string;
  questionNumber: number;
  previousQuestions?: string[]; // Add this to avoid repetition
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
    // Use curated questions for better diversity and balance
    const curatedQuestion = this.getCuratedQuestion(request);
    if (curatedQuestion) {
      return curatedQuestion;
    }

    const prompt = this.buildAdaptiveQuestionPrompt(request);
    
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
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseQuestionResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI question generation failed:', error);
      return this.generateFallbackQuestion(request);
    }
  }

  private getCuratedQuestion(request: AIQuestionRequest): AIQuestionResponse | null {
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

    // Use question number to cycle through different questions
    const questionIndex = (request.questionNumber - 10) % categoryQuestions.length;
    const selectedQuestion = categoryQuestions[questionIndex];

    return {
      targetCategory: request.targetCategory,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
      reasoning: selectedQuestion.reasoning
    };
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
    "description": "Detailed analysis of their passions based on their responses",
    "confidence": 75
  },
  "Profession": {
    "description": "Analysis of their skills and capabilities from their answers",
    "confidence": 60
  },
  "Mission": {
    "description": "Their sense of purpose and contribution based on what they said",
    "confidence": 45
  },
  "Vocation": {
    "description": "Their relationship with money and opportunities from their responses",
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
    return `
Generate a personalized question to explore "${request.targetCategory}" (lowest confidence area).

Current Profile:
- Passion: ${request.currentProfile.Passion?.description} (${request.currentProfile.Passion?.confidence}%)
- Profession: ${request.currentProfile.Profession?.description} (${request.currentProfile.Profession?.confidence}%)
- Mission: ${request.currentProfile.Mission?.description} (${request.currentProfile.Mission?.confidence}%)
- Vocation: ${request.currentProfile.Vocation?.description} (${request.currentProfile.Vocation?.confidence}%)

Quiz Style: ${request.quizStyle}
Question #: ${request.questionNumber}/20
Target: ${request.targetCategory}

Create a question that:
1. Matches "${request.quizStyle}" style
2. Explores "${request.targetCategory}" deeply
3. Has 4 distinct options that cover different approaches/values
4. Will increase confidence in this area
5. Is responsive to their existing profile (build on what they've already shown interest in)
6. Covers diverse topics: personal growth, career preferences, relationships, creativity, values, lifestyle

Generate varied questions. Don't default to global issues unless their profile shows environmental/social activism interests.

Format as JSON:
{
  "targetCategory": "${request.targetCategory}",
  "question": "Your personalized question based on their profile",
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
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
2. Updating description with new insights from their specific answer
3. Updating relevant traits based on what their answer reveals
4. Cross-category updates if their answer provides insights for other areas

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
1. **Ikigai Summary:** 2-3 sentences describing their unique purpose based on their actual profile
2. **Persona:** Memorable title that reflects their specific combination of traits
3. **Career Suggestions:** 3-5 specific career paths that match their actual interests and strengths
4. **Hobby Suggestions:** 3-5 fulfilling activities that align with their demonstrated passions
5. **Insights:** Key observations based on their specific responses and recommendations

Be responsive to their actual interests. If they showed interest in environmental issues, include that. If they're more focused on personal creativity, focus there. Match their actual profile.

Format as JSON:
{
  "IkigaiSummary": "Compelling description of their purpose based on their specific profile",
  "Persona": "The [Adjective] [Noun] that reflects their unique combination",
  "CareerSuggestions": [
    "Specific career matching their interests with brief explanation",
    "Another career path aligned with their values",
    "Third career suggestion based on their strengths"
  ],
  "HobbySuggestions": [
    "Hobby aligning with their demonstrated passions",
    "Activity developing skills they showed interest in",
    "Pursuit serving their specific mission interests"
  ],
  "ConfidenceRadar": {
    "Passion": ${request.profile.Passion?.confidence || 50},
    "Profession": ${request.profile.Profession?.confidence || 50},
    "Mission": ${request.profile.Mission?.confidence || 50},
    "Vocation": ${request.profile.Vocation?.confidence || 50}
  },
  "DetailedInsights": [
    "Key strength to leverage based on their responses",
    "Area for growth specific to their profile",
    "Unique combination they possess",
    "Next steps tailored to their interests"
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
          "You have a strong sense of purpose and desire to help others",
          "Continue developing your professional skills",
          "Explore ways to monetize your passions",
          "Seek opportunities that align all four elements"
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
        "You have a strong sense of purpose",
        "Continue developing your professional skills",
        "Explore ways to monetize your passions",
        "Seek opportunities that align all four elements"
      ]
    };
  }
}

// Singleton instance
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    if (!apiKey) {
      console.warn('OpenAI API key not found. Using simulated AI responses.');
    }
    aiService = new AIService(apiKey);
  }
  return aiService;
}