'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Gamepad2, Brain, BookOpen, Zap, Loader2 } from 'lucide-react';
import { useQuiz } from '@/contexts/quiz-context';
import questionData from '@/lib/data/ikigai_fixed_question_sets_with_choices.json';

interface RoutingQuestionProps {
  onComplete: (path: string) => void;
}

export function RoutingQuestion({ onComplete }: RoutingQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setQuizFramework, addAnswer } = useQuiz();

  const handleOptionSelect = async (option: string) => {
    if (isProcessing) return;
    
    setSelectedOption(option);
    setIsProcessing(true);

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    const routeMap: Record<string, string> = {
      'A': 'playful',
      'B': 'introspective', 
      'C': 'narrative',
      'D': 'rapid_fire'
    };

    const framework = routeMap[option];
    setQuizFramework(framework);

    // Record this as Question 1 of 20
    addAnswer({
      questionText: questionData.routing_question.question,
      selectedAnswer: questionData.routing_question.options[option.charCodeAt(0) - 65],
      mappedCategories: ['quiz_style'], // This helps inform their personality
      questionNumber: 1,
    });

    onComplete(framework);
  };

  const getIcon = (option: string) => {
    switch (option) {
      case 'A': return <Gamepad2 className="w-6 h-6" />;
      case 'B': return <Brain className="w-6 h-6" />;
      case 'C': return <BookOpen className="w-6 h-6" />;
      case 'D': return <Zap className="w-6 h-6" />;
      default: return null;
    }
  };

  const getColor = (option: string) => {
    switch (option) {
      case 'A': return 'from-pink-400 to-rose-500';
      case 'B': return 'from-blue-400 to-indigo-500';
      case 'C': return 'from-purple-400 to-violet-500';
      case 'D': return 'from-orange-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="text-sm text-gray-500 mb-2">Question 1 of 20</div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Choose Your Journey Style
        </CardTitle>
        <p className="text-lg text-gray-600 leading-relaxed">
          {questionData.routing_question.question}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This choice will also help us understand your personality and preferences.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RadioGroup value={selectedOption} onValueChange={handleOptionSelect}>
          {questionData.routing_question.options.map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const isSelected = selectedOption === optionKey;
            const isDisabled = isProcessing && !isSelected;
            
            return (
              <div key={optionKey} className="relative">
                <Label
                  htmlFor={optionKey}
                  className={`flex items-center space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-md scale-[1.02]'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <RadioGroupItem value={optionKey} id={optionKey} className="sr-only" />
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getColor(optionKey)} flex items-center justify-center text-white flex-shrink-0 ${
                    isSelected ? 'scale-110' : ''
                  } transition-transform duration-300`}>
                    {isSelected && isProcessing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      getIcon(optionKey)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-800">{option}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {questionData.routing_question.routes[optionKey as keyof typeof questionData.routing_question.routes]}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {isProcessing && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Starting your personalized journey...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}