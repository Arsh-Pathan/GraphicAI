"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Download } from 'lucide-react';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      
      setHtml(data.html);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projection.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">GraphicAI Workspace</h1>
        </div>
        {html && (
          <button onClick={handleDownload} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition shadow-sm">
            <Download className="w-4 h-4" /> Download HTML
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Input Panel */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 overflow-y-auto">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Problem Statement</label>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Describe the engineering graphics projection problem. Include the shape, dimensions, resting condition, and inclinations (HP/VP).
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A hexagonal lamina of sides 25 mm rests on one of its corners on HP. The lamina makes 45 deg to HP..."
            className="w-full h-48 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-sm text-gray-800 mb-6"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Blueprint'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Output Preview */}
        <div className="w-full lg:w-2/3 bg-[#f1f3f5] flex-1 relative flex items-center justify-center p-4 overflow-hidden">
          {!html && !loading && (
            <div className="text-center text-gray-400 flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 mb-4 flex items-center justify-center rotate-45">
                 <div className="w-8 h-8 border border-gray-300" />
              </div>
              <p className="font-medium">Preview will appear here</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center text-blue-600">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full mb-4"
               />
               <p className="font-medium animate-pulse text-sm tracking-wide">AI is drafting your projection...</p>
            </div>
          )}

          {html && !loading && (
            <iframe
              srcDoc={html}
              className="w-full h-full bg-white shadow-md rounded-lg border border-gray-200"
              title="Generated Graphic"
              sandbox="allow-scripts"
            />
          )}
        </div>
      </main>
    </div>
  );
}
