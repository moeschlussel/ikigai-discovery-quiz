'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, DollarSign, Globe, ArrowRight, Sparkles, Target, Users, TrendingUp, Star, CheckCircle, PlayCircle } from 'lucide-react';
import { QuizFlow } from '@/components/quiz-flow';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <QuizFlow />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100/60 via-orange-100/40 to-pink-100/40">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Ikigai</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-800 transition-colors">How it Works</a>
              <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
              <Button 
                onClick={() => setShowQuiz(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
              >
                Start Discovery
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 mb-8 border border-orange-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700">Discover your purpose</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent py-2">
                  Ikigai
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Unlock your True Purpose - the perfect intersection of passion, skill, purpose, and profit. 
                Start your journey to meaningful work today.
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-12">
                <Button 
                  onClick={() => setShowQuiz(true)}
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <PlayCircle className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right Column - Ikigai Diagram */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/ikigai-diagram.png" 
                alt="Ikigai Diagram - The intersection of what you love, what you're good at, what the world needs, and what you can be paid for"
                className="w-[500px] h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">FEATURES</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Designed to Unlock Your Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines ancient wisdom with modern psychology 
              to deliver personalized insights that transform careers and lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-900">What You Love</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">Discover your true passions and what brings you genuine fulfillment</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-900">What You Excel At</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">Identify your unique strengths and natural talents</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-900">Market Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">Understand how to monetize your skills in today's economy</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-900">World Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">Find meaningful ways to contribute to society</p>
              </CardContent>
            </Card>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-4">AI-POWERED INSIGHTS</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Personalized Career Intelligence
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced AI analyzes your responses to provide tailored career recommendations, 
                skill development paths, and actionable insights based on your unique profile.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">Personalized career suggestions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">Skill gap analysis and recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">Confidence tracking across all dimensions</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-3xl p-8 border border-orange-100">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">AI Analysis Complete</div>
                    <div className="text-sm text-gray-500">Your personalized report is ready</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passion Alignment</span>
                    <span className="text-sm font-semibold text-yellow-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Skill Match</span>
                    <span className="text-sm font-semibold text-orange-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Opportunity</span>
                    <span className="text-sm font-semibold text-pink-600">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50/50 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 mb-4">HOW IT WORKS</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Journey to Purpose in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our scientifically-backed process guides you through a personalized discovery journey 
              that adapts to your unique perspective and goals.
            </p>
          </div>

          {/* Ikigai Diagram Section */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Understanding Your Ikigai
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Ikigai is the Japanese concept of finding your life's purpose through the intersection of four key elements. 
                  Our assessment maps your responses to these four dimensions.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/images/ikigai-diagram.png" 
                  alt="Ikigai Diagram - The intersection of what you love, what you're good at, what the world needs, and what you can be paid for"
                  className="w-[500px] h-[500px] object-contain mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 max-w-lg mx-auto">
                  Your personalized report will show your strengths and confidence levels across each of these four areas, 
                  along with specific recommendations for your unique profile.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description: "Select from four distinct journey styles - playful, introspective, narrative, or rapid-fire - each designed for different personality types and time preferences.",
                icon: Target,
                color: "from-yellow-400 to-orange-400"
              },
              {
                step: "02", 
                title: "AI-Guided Discovery",
                description: "Answer 20 thoughtfully crafted questions that adapt based on your responses. Our AI ensures each question is relevant and insightful for your unique journey.",
                icon: Brain,
                color: "from-orange-400 to-pink-400"
              },
              {
                step: "03",
                title: "Unlock Your Ikigai",
                description: "Receive a comprehensive report with personalized career suggestions, skill recommendations, and actionable insights to align your life with your true purpose.",
                icon: Sparkles,
                color: "from-pink-400 to-yellow-400"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-gray-400 mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Discover Your Purpose?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Take the first step towards finding meaningful work that aligns with your true purpose and potential.
          </p>
          <Button 
            onClick={() => setShowQuiz(true)}
            size="lg"
            className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Start Your Discovery Journey
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm opacity-75 mt-4">Takes 10-15 minutes • No signup required</p>
        </div>
      </section>
    </div>
  );
}