import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const aiService = getAIService();
    
    const result = await aiService.generateComprehensiveAnalysis(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI comprehensive analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 