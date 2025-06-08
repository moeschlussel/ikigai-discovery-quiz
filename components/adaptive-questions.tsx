'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import { useQuiz } from '@/contexts/quiz-context';
import { getAIService } from '@/lib/ai-service';

interface AdaptiveQuestionsProps {
  onComplete: () => void;
}

interface AdaptiveQuestion {
  targetCategory: string;
  question: string;
  options: string[];
  reasoning?: string;
}

export function AdaptiveQuestions({ onComplete }: AdaptiveQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [currentQuestionData, setCurrentQuestionData] = useState<AdaptiveQuestion | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addAnswer, answers, userProfile, setUserProfile, quizFramework } = useQuiz();

  const totalAdaptiveQuestions = 11; // Questions 10-20
  const currentQuestionNumber = 10 + currentQuestion;

  useEffect(() => {
    initializeProfileFromFixedQuestions();
  }, []);

  useEffect(() => {
    if (userProfile.Passion.confidence > 0 && currentQuestion < totalAdaptiveQuestions) {
      generateNextAdaptiveQuestion();
    }
  }, [currentQuestion, userProfile]);

  const initializeProfileFromFixedQuestions = async () => {
    setIsInitializing(true);
    
    try {
      const aiService = getAIService();
      
      // Format fixed questions for AI analysis
      const formattedAnswers = answers.slice(1).map(answer => ({
        question: answer.questionText,
        options: [], // We don't have the original options, but AI can work with just the question and selected answer
        selected: answer.selectedAnswer
      }));

      const profileResult = await aiService.initializeProfile({
        quizStyle: quizFramework,
        answers: formattedAnswers
      });
      
      setUserProfile(profileResult.userProfile);
    } catch (error) {
      console.error('Failed to initialize profile with AI:', error);
      // Fallback to basic initialization
      initializeFallbackProfile();
    }
    
    setIsInitializing(false);
  };

  const initializeFallbackProfile = () => {
    // Basic fallback profile initialization
    setUserProfile({
      Passion: { description: 'Exploring creative and meaningful pursuits', confidence: 60 },
      Profession: { description: 'Developing technical and analytical skills', confidence: 65 },
      Mission: { description: 'Contributing to positive change in the world', confidence: 45 },
      Vocation: { description: 'Building sustainable career opportunities', confidence: 55 },
      Traits: {
        'Risk Tolerance': { value: 'Moderate', confidence: 60 },
        'Time Horizon': { value: 'Medium-term', confidence: 65 },
        'Lifestyle Desires': { value: 'Balanced', confidence: 70 },
        'Biggest Fears': { value: 'Uncertainty', confidence: 60 },
        'Ideal Work Environment': { value: 'Collaborative', confidence: 65 }
      }
    });
  };

  const generateNextAdaptiveQuestion = async () => {
    if (currentQuestion >= totalAdaptiveQuestions) {
      onComplete();
      return;
    }

    setIsGeneratingQuestion(true);
    
    try {
      // Find category with lowest confidence
      const categories = ['Passion', 'Profession', 'Mission', 'Vocation'] as const;
      const targetCategory = categories.reduce((lowest, current) => 
        userProfile[current].confidence < userProfile[lowest].confidence ? current : lowest
      );

      const aiService = getAIService();
      const questionResult = await aiService.generateAdaptiveQuestion({
        currentProfile: userProfile,
        targetCategory,
        quizStyle: quizFramework,
        questionNumber: currentQuestionNumber
      });

      setCurrentQuestionData(questionResult);
    } catch (error) {
      console.error('Failed to generate adaptive question:', error);
      // Fallback question
      setCurrentQuestionData({
        targetCategory: 'Passion',
        question: "What type of work would you do even if you weren't paid for it?",
        options: [
          "Creative projects that express my unique vision",
          "Technical challenges that require deep expertise", 
          "Community service that helps people directly",
          "Business ventures that create value for others"
        ],
        reasoning: "Exploring your core motivations and passions"
      });
    }
    
    setIsGeneratingQuestion(false);
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isProcessing || !currentQuestionData) return;

    setSelectedAnswer(answer);
    setIsProcessing(true);

    // Visual feedback delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const selectedOption = currentQuestionData.options[answer.charCodeAt(0) - 65];

    // Record the answer
    addAnswer({
      questionText: currentQuestionData.question,
      selectedAnswer: selectedOption,
      mappedCategories: [currentQuestionData.targetCategory],
      questionNumber: currentQuestionNumber,
    });

    // Update profile with AI
    try {
      const aiService = getAIService();
      const updateResult = await aiService.updateProfile({
        currentProfile: userProfile,
        targetCategory: currentQuestionData.targetCategory,
        question: currentQuestionData.question,
        selectedAnswer: selectedOption,
        quizStyle: quizFramework
      });

      setUserProfile(updateResult.updatedProfile);
    } catch (error) {
      console.error('Failed to update profile with AI:', error);
      // Fallback update
      updateProfileFallback(currentQuestionData.targetCategory, selectedOption);
    }

    if (currentQuestion < totalAdaptiveQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setIsProcessing(false);
    } else {
      // Small delay before completing
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete();
    }
  };

  const updateProfileFallback = (category: string, answer: string) => {
    setUserProfile(prev => {
      const updated = { ...prev };
      
      // Simple confidence boost
      if (category in updated) {
        updated[category as keyof typeof updated].confidence = Math.min(
          updated[category as keyof typeof updated].confidence + 15, 
          95
        );
      }
      
      return updated;
    });
  };

  const progress = ((currentQuestion + 1) / totalAdaptiveQuestions) * 100;

  if (isInitializing) {
    return (
      <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Brain className="w-16 h-16 text-purple-600 animate-pulse mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Your Responses</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Our AI is analyzing your answers holistically to build your personalized Ikigai profile...
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating your unique profile
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGeneratingQuestion || !currentQuestionData) {
    return (
      <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Sparkles className="w-12 h-12 text-purple-600 animate-pulse mb-6" />
          <h3 className="text-xl font-bold text-gray-800 mb-4">Crafting Your Next Question</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            AI is analyzing your profile to create a personalized question that explores your areas of growth...
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Targeting: {Object.entries(userProfile).reduce((lowest, [key, value]) => 
              key !== 'Traits' && value.confidence < userProfile[lowest]?.confidence ? key : lowest, 'Passion'
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Question {currentQuestionNumber} of 20
          </div>
          <div className="text-sm font-medium text-purple-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered Questions
          </div>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
          {currentQuestionData.question}
        </CardTitle>
        {currentQuestionData.reasoning && (
          <p className="text-sm text-gray-600 italic mt-2">
            🎯 {currentQuestionData.reasoning}
          </p>
        )}
        <div className="text-xs text-purple-600 mt-2">
          Exploring: {currentQuestionData.targetCategory}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
          {currentQuestionData.options.map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === optionKey;
            const isDisabled = isProcessing && !isSelected;
            
            return (
              <div key={optionKey} className="relative">
                <Label
                  htmlFor={`adaptive-${optionKey}`}
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-sm scale-[1.01]'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <RadioGroupItem value={optionKey} id={`adaptive-${optionKey}`} className="sr-only" />
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500 scale-110'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && isProcessing ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : isSelected ? (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-800">{option}</p>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {isProcessing && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">
              {currentQuestion === totalAdaptiveQuestions - 1 
                ? 'Generating your final Ikigai profile...' 
                : 'Updating your profile and preparing next question...'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}