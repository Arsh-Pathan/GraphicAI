"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans relative overflow-hidden flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Background Grid Pattern to look like drafting paper */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Subtle Blueprint Measurements */}
      <div className="absolute top-10 left-10 text-xs font-mono tracking-widest text-gray-400 hidden md:block">
        X-AXIS // 1:100 SCALE // PROJECTION_SOLVER_V1
      </div>
      <div className="absolute bottom-10 right-10 text-xs font-mono tracking-widest text-gray-400 hidden md:block" style={{ writingMode: 'vertical-rl' }}>
        Y-AXIS // 1:100 SCALE
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 mt-16 md:mt-0">
        
        {/* Animated Pencil sketch / Wireframe graphic */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8 group" style={{ perspective: '1000px' }}>
           <motion.div 
             initial={{ rotateX: 60, rotateZ: 45 }}
             animate={{ rotateX: 0, rotateZ: 0 }}
             transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
             className="absolute inset-0 border-2 border-black/80"
           />
           <motion.div 
             initial={{ rotateX: 60, rotateZ: 45, opacity: 0 }}
             animate={{ rotateX: 0, rotateZ: 0, opacity: 1 }}
             transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
             className="absolute inset-8 border-2 border-dashed border-gray-400"
           />
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1, delay: 1 }}
             className="absolute top-1/2 left-0 w-full border-t border-black/30 origin-left" 
           />
           <motion.div 
             initial={{ scaleY: 0 }}
             animate={{ scaleY: 1 }}
             transition={{ duration: 1, delay: 1.2 }}
             className="absolute left-1/2 top-0 h-full border-l border-black/30 origin-top" 
           />
           
           {/* Geometric dots */}
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute top-1/2 left-1/2 w-2 h-2 bg-black rounded-full -translate-x-1/2 -translate-y-1/2" />
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute top-8 left-8 w-1.5 h-1.5 bg-gray-500 rounded-full" />
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-gray-500 rounded-full" />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-center"
        >
          GraphicAI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl text-center mb-10 leading-relaxed font-light"
        >
          Generate pixel-perfect Engineering Graphics and projections instantly. Just describe your problem statement, and let AI draw the blueprint.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/generate" className="group relative px-8 py-4 bg-black text-white font-medium text-lg overflow-hidden flex items-center gap-2 transition-all hover:pr-6 hover:pl-10">
            <span className="relative z-10">Start Drawing</span>
            <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            <div className="absolute inset-0 h-full w-0 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full z-0" />
          </Link>
        </motion.div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full py-6 flex justify-center items-center relative z-10 bg-white"
      >
        <p className="text-sm font-medium text-gray-800 tracking-wide border-t border-black/10 pt-6 px-10">
          Created by <span className="font-bold">Arsh Pathan</span> — <span className="italic text-gray-500">From student to students.</span>
        </p>
      </motion.footer>
    </div>
  );
}
