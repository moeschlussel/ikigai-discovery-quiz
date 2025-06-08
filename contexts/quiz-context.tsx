'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
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
  Traits: {
    'Risk Tolerance': { value: string; confidence: number };
    'Time Horizon': { value: string; confidence: number };
    'Lifestyle Desires': { value: string; confidence: number };
    'Biggest Fears': { value: string; confidence: number };
    'Ideal Work Environment': { value: string; confidence: number };
  };
}

export interface QuizAnswer {
  questionText: string;
  selectedAnswer: string;
  mappedCategories: string[];
  questionNumber: number;
}

interface QuizContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  answers: QuizAnswer[];
  addAnswer: (answer: QuizAnswer) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  quizFramework: string;
  setQuizFramework: (framework: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    Passion: { description: '', confidence: 0 },
    Profession: { description: '', confidence: 0 },
    Vocation: { description: '', confidence: 0 },
    Mission: { description: '', confidence: 0 },
    Traits: {
      'Risk Tolerance': { value: '', confidence: 0 },
      'Time Horizon': { value: '', confidence: 0 },
      'Lifestyle Desires': { value: '', confidence: 0 },
      'Biggest Fears': { value: '', confidence: 0 },
      'Ideal Work Environment': { value: '', confidence: 0 },
    },
  });

  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [quizFramework, setQuizFramework] = useState<string>('');

  const addAnswer = (answer: QuizAnswer) => {
    setAnswers(prev => [...prev, answer]);
  };

  return (
    <QuizContext.Provider value={{
      userProfile,
      setUserProfile,
      answers,
      addAnswer,
      selectedPath,
      setSelectedPath,
      quizFramework,
      setQuizFramework,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}