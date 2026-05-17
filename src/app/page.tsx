"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Box, Compass, PencilRuler } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] text-black font-sans relative overflow-hidden flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Premium Background Grid & Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-dot-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Overlay */}
      <header className="w-full px-8 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl">GraphicAI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <span className="hover:text-black cursor-pointer transition-colors">Projections</span>
          <span className="hover:text-black cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-black cursor-pointer transition-colors">Gallery</span>
        </div>
        <Link href="/generate" className="text-sm font-semibold bg-black text-white px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]">
          Open Workspace
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 max-w-6xl mx-auto w-full pt-10 pb-24">
        
        {/* Animated Hero Graphic: Pencil tracing of a 3D isometric projection */}
        <motion.div 
          style={{ y: y2 }}
          className="relative w-full max-w-[500px] aspect-square mb-6 pointer-events-none"
        >
          {/* Central Cube Wireframe */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z"
              fill="none"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth="0.5"
            />
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              d="M50 50 L50 80 M50 50 L20 35 M50 50 L80 35"
              fill="none"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth="0.5"
            />
            {/* Projection Lines */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "linear", delay: 1.5 }}
              d="M20 65 L20 90 M50 80 L50 90 M80 65 L80 90 M20 90 L80 90"
              fill="none"
              stroke="#3182ce"
              strokeWidth="0.3"
              strokeDasharray="2, 2"
            />
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} cx="20" cy="90" r="1" fill="#e53e3e" />
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.3 }} cx="50" cy="90" r="1" fill="#e53e3e" />
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }} cx="80" cy="90" r="1" fill="#e53e3e" />
          </svg>

          {/* Floating UI Elements */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }}
            className="absolute top-[30%] -left-[10%] bg-white border border-gray-200 shadow-xl rounded-lg p-3 text-xs font-mono font-medium flex items-center gap-2"
          >
            <Box className="w-4 h-4 text-blue-500" />
            HP Inclination: 45°
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="absolute bottom-[20%] -right-[5%] bg-white border border-gray-200 shadow-xl rounded-lg p-3 text-xs font-mono font-medium flex items-center gap-2"
          >
            <PencilRuler className="w-4 h-4 text-red-500" />
            True Length: 56.5mm
          </motion.div>
        </motion.div>

        {/* Hero Text */}
        <div className="text-center max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Engineering Graphics Engine v2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-gray-900 leading-[1.1]"
          >
            Draft pixel-perfect <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              projections instantly.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Describe your problem statement and let our AI calculate the complex trigonometry, rotation matrices, and draw the exact drafting standard blueprint in First Angle Projection.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/generate" className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              Start Drafting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-xl text-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
              View Examples
            </Link>
          </motion.div>
        </div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full border-t border-gray-200 bg-white py-8 px-6 mt-auto relative z-20"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold tracking-tight">
            <Compass className="w-5 h-5" />
            GraphicAI
          </div>
          <p className="text-sm font-medium text-gray-500">
            Created by <span className="font-bold text-gray-900">Arsh Pathan</span> <span className="mx-2 text-gray-300">|</span> <span className="italic">From student to students.</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
