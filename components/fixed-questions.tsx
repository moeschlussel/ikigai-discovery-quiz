'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { useQuiz } from '@/contexts/quiz-context';
import questionData from '@/lib/data/ikigai_fixed_question_sets_with_choices.json';

interface FixedQuestionsProps {
  selectedPath: string;
  onComplete: () => void;
}

export function FixedQuestions({ selectedPath, onComplete }: FixedQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addAnswer } = useQuiz();

  const questions = questionData.versions[selectedPath as keyof typeof questionData.versions]?.questions_detailed || [];
  const totalQuestions = questions.length; // 9 questions (2-10)

  const handleAnswerSelect = async (answer: string) => {
    if (isProcessing) return;
    
    setSelectedAnswer(answer);
    setIsProcessing(true);

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 400));

    // Map answer to categories based on option selected
    const mappedCategories = [];
    switch (answer) {
      case 'A': mappedCategories.push('Passion'); break;
      case 'B': mappedCategories.push('Profession'); break;
      case 'C': mappedCategories.push('Mission'); break;
      case 'D': mappedCategories.push('Vocation'); break;
    }

    addAnswer({
      questionText: questions[currentQuestion].question,
      selectedAnswer: questions[currentQuestion].options[answer.charCodeAt(0) - 65],
      mappedCategories,
      questionNumber: currentQuestion + 2, // Questions 2-10
      options: questions[currentQuestion].options, // Add options for comprehensive analysis
      selectedIndex: answer.charCodeAt(0) - 65, // Add selected index for comprehensive analysis
    });

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setIsProcessing(false);
    } else {
      // Small delay before transitioning to adaptive questions
      await new Promise(resolve => setTimeout(resolve, 200));
      onComplete();
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQuestionNumber = currentQuestion + 2; // Questions 2-10

  if (!currentQuestionData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Question {currentQuestionNumber} of 20
          </div>
          <div className="text-sm font-medium text-orange-600">
            {questionData.versions[selectedPath as keyof typeof questionData.versions]?.style}
          </div>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
          {currentQuestionData.question}
        </CardTitle>
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
                  htmlFor={`fixed-${optionKey}`}
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-sm scale-[1.01]'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <RadioGroupItem value={optionKey} id={`fixed-${optionKey}`} className="sr-only" />
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500 scale-110'
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
              {currentQuestion === totalQuestions - 1 
                ? 'Preparing your AI-powered questions...' 
                : 'Moving to next question...'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}