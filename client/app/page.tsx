'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, Heart, Shield, Zap, MessageSquare, ChevronDown, 
  Menu, X, BarChart3, User, ArrowRight, Database, Sparkles, 
  Send, Loader2, Calendar, Search, Moon, ChefHat, 
  Utensils, FileText, CloudRain, Brain, Phone, Mail, MapPin, Lock, Smartphone,
  Dumbbell, Timer, ScanLine, Fingerprint, Power, Hexagon, Link as LinkIcon, Share2,
  Sun, Leaf, Stethoscope, Dna, Watch, Cloud, Server, Bot, Cpu, Globe, Layers,
  Github, Linkedin, Twitter, Eye, Code, ShieldCheck, Newspaper, AlertTriangle, Droplets
} from 'lucide-react';
import Link from 'next/link';

/* --- ASSETS --- */
const PRANAYA_LOGO = "/pranaya-logo.jpg"; // Local file in public folder

/* --- UTILITY COMPONENTS --- */
const RevealOnScroll = ({ children, className = "", delay = 0 }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return <div ref={ref} className={`${className} transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

const CyberDeckReveal = ({ children, delay = 0 }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 });
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return <div ref={ref} className={`transform transition-all duration-1200 cubic-bezier(0.2, 0.8, 0.2, 1) ${isVisible ? 'opacity-100 rotate-x-0 translate-y-0 scale-100' : 'opacity-0 rotate-x-45 translate-y-24 scale-90'}`} style={{ transformStyle: 'preserve-3d', perspective: '1000px', transitionDelay: `${delay}ms` }}>{children}</div>;
};

/* --- EXPLODED PHONE VISUAL --- */
const ExplodedPhoneVisual = ({ scrollY }: { scrollY: number }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHello, setShowHello] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (scrollY < 50) {
       setShowHello(true);
       timer = setTimeout(() => setShowHello(false), 2500);
    } else {
       setShowHello(false);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [scrollY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 2 - 1;
    const y = ((e.clientY - top) / height) * 2 - 1;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });
  const explosionProgress = Math.min(Math.max(scrollY / 400, 0), 1);
  
  return (
    <div 
      className="relative w-[300px] h-[600px] perspective-1200 mx-auto hidden lg:block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className="relative w-full h-full transform-style-3d transition-transform duration-200 ease-out" 
           style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        
        {/* Phone Body */}
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 shadow-2xl z-20 overflow-hidden">
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className={`transition-all duration-700 ${showHello ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                 <Fingerprint className="text-blue-400 w-16 h-16 mb-4 mx-auto animate-pulse" />
                 <h3 className="text-white text-2xl font-bold">Authenticating...</h3>
              </div>
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 delay-300 ${!showHello ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30 mx-auto">
                      <AlertTriangle className="text-red-500 w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-white text-3xl font-bold">Emergency Alert</h3>
                  <p className="text-red-400 mt-2 font-mono">CRITICAL STATUS</p>
              </div>
           </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 -right-20 bg-white p-4 rounded-xl shadow-xl z-30 transition-all duration-500"
             style={{ transform: `translateZ(50px) translateX(${100 * explosionProgress}px)`, opacity: explosionProgress }}>
            <div className="flex items-center gap-3">
                <Droplets className="text-blue-500" />
                <div><p className="text-xs text-gray-500">Water Log</p><p className="font-bold">1250 ml</p></div>
            </div>
        </div>

        <div className="absolute bottom-20 -left-20 bg-white p-4 rounded-xl shadow-xl z-30 transition-all duration-500"
             style={{ transform: `translateZ(80px) translateX(${-100 * explosionProgress}px)`, opacity: explosionProgress }}>
            <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-500" />
                <div><p className="text-xs text-gray-500">Immunity</p><p className="font-bold">Optimal</p></div>
            </div>
        </div>

      </div>
    </div>
  );
};

/* --- MAIN PAGE --- */
export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden bg-white">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={PRANAYA_LOGO} alt="Logo" className="w-10 h-10 rounded-lg border border-slate-200" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">Pranaya</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-600">
            <Link href="/news" className="hover:text-blue-600 transition-colors">News</Link>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            
            {/* Single GET STARTED Button (Links to Login) */}
            <Link href="/login">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-lg">
                    Get Started
                </button>
            </Link>
          </div>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-60 p-8 animate-in slide-in-from-right">
           <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
           </div>
           <div className="flex flex-col gap-8 text-2xl font-medium">
              <Link href="/news" className="text-left" onClick={() => setIsMenuOpen(false)}>News</Link>
              <a href="#features" className="text-left" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#about" className="text-left" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <Link href="/login" className="text-left text-blue-600" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 lg:pt-52 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 -z-20 overflow-hidden bg-linear-to-b from-blue-50/80 via-white/50 to-slate-50"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            
            {/* Left Text */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <RevealOnScroll>
                
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
                  Your Health, <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Agentically</span> Managed.
                </h1>
                <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Pranaya is a federated multi-agent system. From real-time emergency detection to autonomous health tracking, your personal Health Guardian is here.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                  {/* Single GET STARTED Button in Hero (Links to Login) */}
                  <Link href="/login">
                    <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 text-lg">
                        Get Started <ArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right Visual */}
            <div className="lg:w-1/2 relative z-0 mt-16 lg:mt-0 flex flex-col items-center">
               <ExplodedPhoneVisual scrollY={scrollY} />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">Core Capabilities</p>
            <CyberDeckReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 
                 <div className="bg-slate-50 p-8 rounded-3xl hover:bg-blue-50 transition cursor-pointer group border border-slate-100 hover:border-blue-100">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Brain size={28}/></div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Agentic Brain</h3>
                    <p className="text-slate-500 leading-relaxed">Orchestrates multiple specialized agents for precise diagnosis.</p>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-3xl hover:bg-red-50 transition cursor-pointer group border border-slate-100 hover:border-red-100">
                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Heart size={28}/></div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Emergency Sentinel</h3>
                    <p className="text-slate-500 leading-relaxed">Real-time crisis detection that overrides the UI to trigger emergency protocols.</p>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-3xl hover:bg-green-50 transition cursor-pointer group border border-slate-100 hover:border-green-100">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition"><Eye size={28}/></div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Vision Lab Tech</h3>
                    <p className="text-slate-500 leading-relaxed">Upload blood reports or food photos. Our Vision Agent extracts values and risks instantly.</p>
                 </div>

              </div>
            </CyberDeckReveal>
         </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                  <h2 className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Our Mission</h2>
                  <h3 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Democratizing <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Precision Health</span> for Everyone.</h3>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                     We believe healthcare should be proactive, personalized, and accessible. Pranaya combines medical-grade accuracy with consumer-friendly design to bridge the gap between daily wellness and clinical care.
                  </p>
               </div>
               <div className="lg:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-3xl font-bold text-blue-400 mb-1">90%+</h4>
                        <p className="text-sm text-slate-400">Uptime Reliability</p>
                     </div>
                     <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-3xl font-bold text-purple-400 mb-1">24/7</h4>
                        <p className="text-sm text-slate-400">AI Monitoring</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}