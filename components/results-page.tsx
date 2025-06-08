'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  DollarSign, 
  Globe, 
  Sparkles, 
  Download,
  Share2,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  Loader2,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Briefcase,
  BookOpen,
  Zap
} from 'lucide-react';
import { useQuiz } from '@/contexts/quiz-context';
import { getAIService } from '@/lib/ai-service';

interface FinalSummary {
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

export function ResultsPage() {
  const { userProfile, quizFramework, answers } = useQuiz();
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'insights'>('overview');
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(true);

  useEffect(() => {
    generateFinalSummary();
  }, []);

  const generateFinalSummary = async () => {
    setIsGeneratingSummary(true);
    
    try {
      const aiService = getAIService();
      const summaryResult = await aiService.generateFinalSummary({
        profile: userProfile,
        quizStyle: quizFramework,
        allAnswers: answers
      });
      
      setFinalSummary(summaryResult);
    } catch (error) {
      console.error('Failed to generate final summary:', error);
      // Fallback summary
      setFinalSummary({
        IkigaiSummary: "You find purpose through meaningful work that combines your unique talents with opportunities to make a positive impact on others and the world around you.",
        Persona: "The Balanced Seeker",
        CareerSuggestions: [
          "Product Manager at purpose-driven tech company",
          "UX Research Lead at healthcare startup",
          "Sustainability Consultant for Fortune 500",
          "Educational Technology Developer",
          "Social Impact Program Manager"
        ],
        HobbySuggestions: [
          "Volunteer for environmental causes",
          "Mentor aspiring professionals",
          "Lead community workshops",
          "Start a podcast on meaningful work",
          "Join professional development communities"
        ],
        ConfidenceRadar: {
          Passion: userProfile.Passion?.confidence || 85,
          Profession: userProfile.Profession?.confidence || 78,
          Mission: userProfile.Mission?.confidence || 92,
          Vocation: userProfile.Vocation?.confidence || 73
        },
        DetailedInsights: [
          "You have exceptional alignment between your values and desired impact",
          "Consider developing technical skills to increase your market value",
          "Your passion for helping others is a key strength to leverage",
          "Explore roles that combine strategy with hands-on implementation",
          "Build a portfolio showcasing your problem-solving abilities"
        ]
      });
    }
    
    setIsGeneratingSummary(false);
  };

  const categories = [
    { 
      name: 'Passion', 
      icon: Heart, 
      color: 'from-red-400 to-pink-500',
      data: userProfile.Passion,
      description: 'What energizes you'
    },
    { 
      name: 'Profession', 
      icon: Brain, 
      color: 'from-blue-400 to-indigo-500',
      data: userProfile.Profession,
      description: 'Your unique strengths' 
    },
    { 
      name: 'Mission', 
      icon: Globe, 
      color: 'from-orange-400 to-yellow-500',
      data: userProfile.Mission,
      description: 'Your impact on the world'
    },
    { 
      name: 'Vocation', 
      icon: DollarSign, 
      color: 'from-green-400 to-emerald-500',
      data: userProfile.Vocation,
      description: 'Your market value'
    }
  ];

  if (isGeneratingSummary || !finalSummary) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Analyzing Your Ikigai</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our AI is processing your responses to create a comprehensive, 
            personalized analysis of your unique purpose and career path...
          </p>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-lg">Generating your personalized insights</span>
          </div>
          <div className="mt-8 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Award className="w-5 h-5" />
              <span className="text-lg font-semibold">{finalSummary.Persona}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Your Ikigai 
              <span className="block text-4xl md:text-5xl opacity-90">Revealed</span>
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-12 opacity-95">
              {finalSummary.IkigaiSummary}
            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <Button 
                size="lg"
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Download className="mr-3 w-5 h-5" />
                Download Report
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <Share2 className="mr-3 w-5 h-5" />
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-lg z-40">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex justify-center py-6">
            <div className="inline-flex bg-gray-50 rounded-2xl p-2 shadow-sm">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'careers', label: 'Career Paths', icon: Briefcase },
                { id: 'insights', label: 'Action Plan', icon: Zap }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  variant="ghost"
                  className={`px-8 py-3 text-base rounded-xl transition-all duration-200 ${
                    activeTab === id 
                      ? 'bg-white text-gray-900 shadow-md font-semibold' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Ikigai Score Breakdown */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Ikigai Dimensions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-5`}></div>
                      <CardHeader className="text-center pb-4 relative">
                        <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <category.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl text-gray-900 mb-2">{category.name}</CardTitle>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {finalSummary.ConfidenceRadar[category.name as keyof typeof finalSummary.ConfidenceRadar]}%
                          </div>
                          <Progress 
                            value={finalSummary.ConfidenceRadar[category.name as keyof typeof finalSummary.ConfidenceRadar]} 
                            className="h-3 bg-gray-100"
                          />
                        </div>
                        {category.data && category.data.description && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{category.data.description}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Insights About You</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {finalSummary.DetailedInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-2xl p-6 shadow-sm">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Career Paths</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Based on your Ikigai profile, here are careers that align with your purpose, skills, and values.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {finalSummary.CareerSuggestions.map((career, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {career}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">High alignment match</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full rounded-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Development Opportunities</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {finalSummary.HobbySuggestions.map((hobby, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{hobby}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Action Plan</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Practical steps to align your career with your Ikigai and achieve greater fulfillment.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Nurture Your Passion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Dedicate 30 minutes daily to passion projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Join communities aligned with your interests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Document your passion journey</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Develop Your Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Identify top 3 skills to develop</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Take online courses or workshops</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Seek mentorship opportunities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Take Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Network with professionals in target fields</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Update your professional profiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Set monthly progress check-ins</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h3>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  Take the first step towards a more fulfilling career aligned with your true purpose.
                </p>
                <Button 
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Personal Coaching
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}