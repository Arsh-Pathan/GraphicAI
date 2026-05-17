"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Download, PenTool, LayoutDashboard, Settings2, Compass } from 'lucide-react';

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
    a.download = 'projection-blueprint.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-black transition-colors flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">Workspace</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            <Settings2 className="w-4 h-4" /> Config
          </button>
          {html && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDownload} 
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" /> Export HTML
            </motion.button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Input Panel */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-white border-r border-gray-200 flex flex-col z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" /> Draft New Graphic
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Describe the shape, dimensions, resting condition, and plane inclinations (HP/VP). Our AI will build the solver.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A hexagonal lamina of sides 25 mm rests on one of its corners on HP. The lamina makes 45 deg to HP and the diagonal passing through the corner on which it rests is inclined at 30 deg to VP..."
                className="relative w-full h-[320px] p-5 bg-white border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-[15px] text-gray-800 leading-relaxed shadow-sm placeholder:text-gray-400"
              />
            </div>

            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Blueprint'}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-start gap-3 shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
             <p className="text-xs font-medium text-gray-400">Powered by Gemini 2.5 Pro</p>
          </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="w-full lg:flex-1 bg-dot-black [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)] relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-[#fafafa]">
          
          {!html && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-gray-200/50 shadow-xl"
            >
              <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl mb-6 flex items-center justify-center shadow-inner relative overflow-hidden group">
                 <LayoutDashboard className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors relative z-10" />
                 <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Canvas is empty</h3>
              <p className="text-gray-500 max-w-sm leading-relaxed">Enter your engineering graphics problem on the left to render the interactive blueprint.</p>
            </motion.div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center w-full max-w-3xl">
               <div className="w-full h-[500px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden relative">
                 {/* Blueprint Scanning Animation */}
                 <motion.div 
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent border-b-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10"
                 />
                 
                 {/* Skeleton Grid */}
                 <div className="absolute inset-0 bg-dot-black opacity-10" />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-600 z-20">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-semibold animate-pulse tracking-wide">Drafting computational matrices...</p>
                 </div>
               </div>
            </div>
          )}

          {html && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full max-w-[1200px] mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ring-1 ring-black/5"
            >
              <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500 truncate flex-1">
                   preview.html
                </div>
              </div>
              <iframe
                srcDoc={html}
                className="w-full h-[calc(100%-40px)] bg-white"
                title="Generated Graphic"
                sandbox="allow-scripts"
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
