'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, DollarSign, Globe, ArrowRight, Share2, Target } from 'lucide-react';
import Link from 'next/link';

interface SharedData {
  personaLabel: string;
  ikigaiStatement: string;
  timestamp: string;
  summary: {
    passion: number;
    profession: number;
    vocation: number;
    mission: number;
  };
}

export default function SharePageClient({ params }: { params: { id: string } }) {
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this from a backend API using the ID
    // For now, we'll try to decode from the ID or use localStorage
    try {
      const decoded = atob(params.id);
      const data = JSON.parse(decoded);
      setSharedData(data);
    } catch {
      // Fallback to localStorage (for demo purposes)
      const stored = localStorage.getItem('ikigai-share-data');
      if (stored) {
        setSharedData(JSON.parse(stored));
      }
    }
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared Ikigai...</p>
        </div>
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="text-center py-16">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Shared Results Not Found</h1>
            <p className="text-gray-600 mb-8">The shared Ikigai results you're looking for could not be found or may have expired.</p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Discover Your Own Ikigai
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ikigaiElements = [
    { key: 'passion', label: 'Passion', description: 'What They Love', icon: Heart, color: 'from-red-400 to-pink-500' },
    { key: 'profession', label: 'Profession', description: 'What They Excel At', icon: Brain, color: 'from-blue-400 to-indigo-500' },
    { key: 'vocation', label: 'Vocation', description: 'What They Can Be Paid For', icon: DollarSign, color: 'from-green-400 to-emerald-500' },
    { key: 'mission', label: 'Mission', description: 'What The World Needs', icon: Globe, color: 'from-orange-400 to-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-6">
            <Share2 className="w-4 h-4 mr-2" />
            Shared Ikigai Profile
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {sharedData.personaLabel}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
            {sharedData.ikigaiStatement}
          </p>
          <p className="text-white/70">
            Shared on {new Date(sharedData.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Ikigai Elements Summary */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Their Ikigai Elements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ikigaiElements.map(({ key, label, description, icon: Icon, color }) => (
              <Card key={key} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{description}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Progress value={sharedData.summary[key as keyof typeof sharedData.summary]} className="h-2 flex-1" />
                    <span className="text-sm font-semibold text-gray-600">
                      {sharedData.summary[key as keyof typeof sharedData.summary]}%
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
            <CardContent className="py-16 px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Discover Your Own Ikigai</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Inspired by this profile? Take the same 20-question journey to uncover your unique purpose and 
                receive your own comprehensive Ikigai analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button 
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Start Your Discovery Journey
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <p className="text-white/70 mt-6 text-sm">
                Takes 10-15 minutes • AI-powered analysis • No signup required
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 