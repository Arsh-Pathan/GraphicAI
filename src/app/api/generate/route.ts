import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { exampleHtml } from '@/lib/exampleHtml';

export const maxDuration = 60; // Set max duration for Vercel/Next.js

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemInstruction = `You are an expert Computational Geometry Engineer. 
Your task is to generate a complete, single-file HTML application that solves and draws an Engineering Graphics problem using First Angle Projection based on the user's prompt.
You MUST follow the precise layout, CSS, canvas scale handling, and mathematical logic demonstrated in the provided example. 

Requirements:
1. Mathematical Solver: Array of vertices. Compute exact trigonometry for rotations (HP and VP).
2. Output exact HTML matching the Google-like Light Theme.
3. Replace the Problem Statement and Steps in the UI precisely.
4. Output ONLY valid HTML, no markdown wrapping, no extra text. Start with <!DOCTYPE html> and end with </html>.`;

    const userMessage = `Here is an example of the expected HTML format, CSS, and mathematical complexity. Notice how it dynamically computes global offsets, bounding boxes, and projectors:
\n\n${exampleHtml}\n\n
Now, generate the complete HTML file strictly matching this structure, but specifically solving and rendering the following problem:
"${prompt}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: userMessage,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.1
        }
    });

    let generatedHtml = response.text || '';
    
    if (generatedHtml.startsWith('```html')) {
        generatedHtml = generatedHtml.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    } else if (generatedHtml.startsWith('```')) {
        generatedHtml = generatedHtml.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    return NextResponse.json({ html: generatedHtml });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate graphic. Please try again.' }, { status: 500 });
  }
}
