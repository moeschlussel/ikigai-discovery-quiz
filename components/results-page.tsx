'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  DollarSign, 
  Globe, 
  Download, 
  Sparkles,
  Target,
  Users,
  Clock,
  Shield,
  Briefcase,
  Home,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useQuiz } from '@/contexts/quiz-context';

export function ResultsPage() {
  const { answers, comprehensiveAnalysis, setComprehensiveAnalysis } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Looking back over your answers...");

  useEffect(() => {
    if (!comprehensiveAnalysis && answers.length >= 20) {
      generateComprehensiveAnalysis();
    } else if (comprehensiveAnalysis) {
      setIsLoading(false);
    }
  }, [answers, comprehensiveAnalysis]);

  // Progressive loading messages
  useEffect(() => {
    if (!isLoading) return;

    const messages = [
      "Looking back over your answers...",
      "Identifying patterns in your choices...",
      "Figuring out your ikigai...",
      "Crafting your personalized profile...",
      "Almost ready..."
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const generateComprehensiveAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage("Looking back over your answers...");

    try {
      // Prepare data for comprehensive analysis
      const questionsAndAnswers = answers.map((answer, index) => ({
        questionNumber: answer.questionNumber || index + 1,
        questionText: answer.questionText,
        options: answer.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        selectedAnswer: answer.selectedAnswer,
        selectedIndex: answer.selectedIndex || 0
      }));

      const response = await fetch('/api/ai/comprehensive-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionsAndAnswers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Failed to generate analysis: ${response.statusText}`);
      }

      const analysis = await response.json();

      if (setComprehensiveAnalysis) {
        setComprehensiveAnalysis(analysis);
      }
    } catch (error) {
      console.error('Failed to generate comprehensive analysis:', error);
      setError('Failed to generate your comprehensive analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    // Create a simple PDF with the user's profile data
    const doc = document.createElement('div');
    doc.innerHTML = `
      <h1>${personaLabel}</h1>
      <h2>Your Ikigai Statement</h2>
      <p>${ikigaiStatement}</p>
      
      <h2>Your Core Elements</h2>
      <h3>Passion (${ikigaiProfile.Passion?.confidence}%)</h3>
      <p>${ikigaiProfile.Passion?.description}</p>
      
      <h3>Profession (${ikigaiProfile.Profession?.confidence}%)</h3>
      <p>${ikigaiProfile.Profession?.description}</p>
      
      <h3>Vocation (${ikigaiProfile.Vocation?.confidence}%)</h3>
      <p>${ikigaiProfile.Vocation?.description}</p>
      
      <h3>Mission (${ikigaiProfile.Mission?.confidence}%)</h3>
      <p>${ikigaiProfile.Mission?.description}</p>
      
      <h2>Recommended Career Paths</h2>
      ${safeCareerPaths.map((pathItem: any, i: number) => {
        const pathText = typeof pathItem === 'string' ? pathItem : (pathItem?.path || pathItem?.description || 'Career path not available');
        return `<p>${i + 1}. ${pathText}</p>`;
      }).join('')}
      
      <h2>Lifestyle Suggestions</h2>
      ${safeLifestyleSuggestions.map((suggestionItem: any, i: number) => {
        const suggestionText = typeof suggestionItem === 'string' ? suggestionItem : (suggestionItem?.suggestion || suggestionItem?.description || 'Suggestion not available');
        return `<p>${i + 1}. ${suggestionText}</p>`;
      }).join('')}
    `;
    
    // For now, we'll create a downloadable HTML file
    // In a real implementation, you'd use a PDF library like jsPDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Your Ikigai Profile - ${personaLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #7c3aed; text-align: center; }
          h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          h3 { color: #4b5563; }
          p { line-height: 1.6; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        ${doc.innerHTML}
        <footer style="margin-top: 40px; text-align: center; color: #6b7280;">
          <p>Generated from your Ikigai Discovery Journey</p>
        </footer>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikigai-profile-${personaLabel.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-8 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Analyzing Your Ikigai</h3>
            <p className="text-lg text-gray-600 text-center max-w-md mb-8">
              Our advanced AI is performing deep analysis on your 20 responses to create your comprehensive Ikigai profile...
            </p>
            <div className="flex items-center gap-3 text-orange-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium transition-all duration-500">{loadingMessage}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8">
              <Target className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Analysis Error</h3>
            <p className="text-gray-600 text-center mb-8">{error}</p>
            <Button onClick={generateComprehensiveAnalysis} className="bg-orange-500 hover:bg-orange-600">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!comprehensiveAnalysis) {
    return null;
  }

  const { ikigaiProfile, personalityTraits, ikigaiStatement, personaLabel, careerPaths, lifestyleSuggestions } = comprehensiveAnalysis;

  // Ensure arrays are properly formatted
  const safeCareerPaths = Array.isArray(careerPaths) ? careerPaths : [];
  const safeLifestyleSuggestions = Array.isArray(lifestyleSuggestions) ? lifestyleSuggestions : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Your Complete Ikigai Profile
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {personaLabel}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {ikigaiStatement}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={generatePDF}
                size="lg"
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Download className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Personalized Ikigai Diagram */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personal Ikigai Map</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here's your personalized ikigai profile based on your assessment responses. The diagram below 
              shows how your unique strengths, passions, and opportunities align.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
            <div className="flex justify-center">
              <img 
                src="/images/ikigai-diagram.png" 
                alt="Ikigai Diagram - The intersection of what you love, what you're good at, what the world needs, and what you can be paid for"
                className="w-[600px] h-[600px] object-contain mx-auto"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[
                { key: 'Passion', color: 'bg-yellow-100 border-yellow-200 text-yellow-800', label: 'Passion Strength' },
                { key: 'Profession', color: 'bg-green-100 border-green-200 text-green-800', label: 'Professional Clarity' },
                { key: 'Mission', color: 'bg-pink-100 border-pink-200 text-pink-800', label: 'Mission Alignment' },
                { key: 'Vocation', color: 'bg-cyan-100 border-cyan-200 text-cyan-800', label: 'Market Understanding' }
              ].map(({ key, color, label }) => (
                <div key={key} className={`${color} rounded-lg p-4 text-center border`}>
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-lg font-bold mt-1">Strong</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ikigai Core Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Ikigai Elements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { key: 'Passion', icon: Heart, color: 'from-yellow-400 to-orange-400', title: 'What You Love' },
              { key: 'Profession', icon: Brain, color: 'from-green-400 to-emerald-400', title: 'What You Excel At' },
              { key: 'Vocation', icon: DollarSign, color: 'from-cyan-400 to-teal-400', title: 'What You Can Be Paid For' },
              { key: 'Mission', icon: Globe, color: 'from-pink-400 to-rose-400', title: 'What The World Needs' }
            ].map(({ key, icon: Icon, color, title }) => (
              <Card key={key} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ikigaiProfile[key as keyof typeof ikigaiProfile]?.description || 'No description available'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Personality Traits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Personality Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(personalityTraits).map(([trait, data]: [string, any]) => {
              const getTraitIcon = (traitName: string) => {
                switch (traitName) {
                  case 'Risk Tolerance': return Shield;
                  case 'Time Horizon': return Clock;
                  case 'Lifestyle Desires': return Home;
                  case 'Biggest Fears': return Target;
                  case 'Ideal Work Environment': return Briefcase;
                  case 'Social Orientation': return Users;
                  case 'Monetization Preference': return TrendingUp;
                  default: return CheckCircle;
                }
              };
              
              const Icon = getTraitIcon(trait);
              
              return (
                <Card key={trait} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{trait}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">{data?.value || 'No value available'}</p>
                    <p className="text-sm text-gray-600">{data?.explanation || 'No explanation available'}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Career Paths */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recommended Career Paths</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safeCareerPaths.map((pathItem: any, index: number) => {
              // Handle both string and object formats
              const pathText = typeof pathItem === 'string' ? pathItem : (pathItem?.path || pathItem?.description || 'Career path not available');
              
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{pathText}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Lifestyle Suggestions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lifestyle & Growth Suggestions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safeLifestyleSuggestions.map((suggestionItem: any, index: number) => {
              // Handle both string and object formats
              const suggestionText = typeof suggestionItem === 'string' ? suggestionItem : (suggestionItem?.suggestion || suggestionItem?.description || 'Suggestion not available');
              
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{suggestionText}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white border-0 shadow-2xl">
            <CardContent className="py-12 px-8">
              <h2 className="text-3xl font-bold mb-6">Ready to Live Your Ikigai?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Your journey of purpose and fulfillment starts now. Take action on these insights and create the meaningful life you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={generatePDF}
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Download className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Save Your Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}