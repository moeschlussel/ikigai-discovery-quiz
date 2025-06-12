'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RoutingQuestion } from '@/components/routing-question';
import { FixedQuestions } from '@/components/fixed-questions';
import { AdaptiveQuestions } from '@/components/adaptive-questions';
import { ResultsPage } from '@/components/results-page';
import { QuizProvider } from '@/contexts/quiz-context';

export function QuizFlow() {
  return (
    <QuizProvider>
      <QuizFlowContent />
    </QuizProvider>
  );
}

function QuizFlowContent() {
  const [currentStep, setCurrentStep] = useState<'routing' | 'fixed' | 'adaptive' | 'results'>('routing');
  const [selectedPath, setSelectedPath] = useState<string>('');

  const handleRoutingComplete = (path: string) => {
    setSelectedPath(path);
    setCurrentStep('fixed');
  };

  const handleFixedComplete = () => {
    setCurrentStep('adaptive');
  };

  const handleAdaptiveComplete = () => {
    setCurrentStep('results');
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'routing': return 1;
      case 'fixed': return 2;
      case 'adaptive': return 3;
      case 'results': return 4;
      default: return 1;
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'routing': return 'Question 1: Choose Your Journey Style';
      case 'fixed': return 'Questions 2-10: Core Discovery';
      case 'adaptive': return 'Questions 11-20: AI-Powered Deep Dive';
      case 'results': return 'Your Personalized Ikigai Profile';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Ikigai Discovery Journey</h1>
            <Badge variant="outline" className="bg-white/80">
              Step {getStepNumber()} of 4
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{getStepDescription()}</p>
          <Progress value={(getStepNumber() / 4) * 100} className="h-2" />
        </div>

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'routing' && (
            <RoutingQuestion onComplete={handleRoutingComplete} />
          )}
          
          {currentStep === 'fixed' && (
            <FixedQuestions 
              selectedPath={selectedPath} 
              onComplete={handleFixedComplete} 
            />
          )}
          
          {currentStep === 'adaptive' && (
            <AdaptiveQuestions onComplete={handleAdaptiveComplete} />
          )}
          
          {currentStep === 'results' && (
            <ResultsPage />
          )}
        </div>
      </div>
    </div>
  );
}