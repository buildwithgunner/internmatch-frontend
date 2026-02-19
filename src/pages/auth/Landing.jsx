import React, { useState } from 'react';
import {
    Briefcase,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Sun,
    Moon,
    Users,
    Menu,
    X,
    Grape,
    Rocket,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Landing = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/50">
                <div className="flex items-center justify-between px-6 sm:px-12 py-5 max-w-[1600px] mx-auto">
                    <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded-lg">IM</span>
                        <span className="dark:text-white">INTERNMATCH</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
                        <Link to="/register?role=student" className="hover:text-[#FF6B00] transition-colors">Students</Link>
                        <Link to="/register?role=company" className="hover:text-[#FF6B00] transition-colors">Companies</Link>
                        <a href="#features" className="hover:text-[#FF6B00] transition-colors">Features</a>
                        <Link to="/login" className="px-5 py-2.5 rounded-full border-2 border-gray-900 dark:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                            Login
                        </Link>
                        <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2">
                            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6 font-bold uppercase tracking-widest text-sm animate-in fade-in slide-in-from-top-4">
                        <Link to="/register?role=student" onClick={() => setIsMenuOpen(false)}>Students</Link>
                        <Link to="/register?role=company" onClick={() => setIsMenuOpen(false)}>Companies</Link>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </div>
                )}
            </nav>

            {/* Split Hero Section */}
            <main className="flex flex-col lg:flex-row min-h-screen pt-20 lg:pt-0">
                {/* Left Side: Students */}
                <section className="relative flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-white overflow-hidden group">
                    <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-110 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071"
                            alt="Students collaborating"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-orange-500/20">
                            <Sparkles size={14} /> Student Portal
                        </div>
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-[calc(-0.04em)] leading-[0.9] text-gray-900 mb-8">
                            Grab the <br />
                            <span className="text-[#FF6B00] italic">Future.</span>
                        </h1>
                        <p className="text-lg sm:text-xl font-bold text-gray-700 mb-10 max-w-md leading-tight">
                            Top-tier startups compete for <span className="text-white bg-[#FF6B00] px-2 py-0.5 rounded">your</span> talent.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Link to="/register?role=student" className="w-full sm:w-auto">
                                <button className="w-full bg-[#FF6B00] text-white px-10 py-5 rounded-2xl text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-4">
                                    Join as Student <ArrowRight size={24} />
                                </button>
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            <Link to="/login" className="hover:text-gray-900 transition-colors">Login</Link>
                            <span>#FUELYOURAMBITION</span>
                        </div>
                    </div>
                </section>

                {/* Right Side: Companies */}
                <section className="relative flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-[#0A0A0A] text-white overflow-hidden group">
                    <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-110 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
                            alt="Modern office meeting"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 max-w-xl ml-auto text-right">
                        <div className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-orange-500/20">
                            <Briefcase size={14} /> Hiring Partners
                        </div>
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-[calc(-0.04em)] leading-[0.9] text-white mb-8">
                            Build the <br />
                            <span className="text-[#FF6B00] italic">Squad.</span>
                        </h1>
                        <p className="text-lg sm:text-xl font-bold text-gray-400 mb-10 max-w-md ml-auto leading-tight">
                            Stop sorting through resumes. Meet <span className="text-white border-b-4 border-[#FF6B00]">vetted</span> campus leaders.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
                            <Link to="/register?role=company" className="w-full sm:w-auto">
                                <button className="w-full bg-white text-black px-10 py-5 rounded-2xl text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-4">
                                    Find Talent <ArrowRight size={24} />
                                </button>
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center justify-end gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                            <span>SCALE FASTER</span>
                            <Link to="/login" className="hover:text-white transition-colors">Portal Access</Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* "More Stuffs" - Features Section */}
            <section id="features" className="py-24 px-6 sm:px-12 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter dark:text-white">
                            Engineered for <span className="text-[#FF6B00]">Growth.</span>
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 font-bold max-w-2xl">
                            We've stripped away the noise of traditional job boards to build a direct pipeline between raw talent and high-growth opportunities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-10 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-[#FF6B00] rounded-2xl flex items-center justify-center">
                                <Rocket size={28} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white leading-none">Flash Matches</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-snug">Our AI learns your project vibes and company culture to deliver matches in under 48 hours.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-10 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-[#FF6B00] rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white leading-none">Vetted Talent</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-snug">Every student on InternMatch undergoes a skill audit. No more filtering through 1000 noisy resumes.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-10 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-[#FF6B00] rounded-2xl flex items-center justify-center">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white leading-none">ROI Focused</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-snug">Track performance and conversion from intern to full-time hire seamlessly with our analytics suite.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works - Step by Step */}
            <section className="py-24 px-6 sm:px-12 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter dark:text-white mb-4">
                            How it <span className="text-[#FF6B00]">Works.</span>
                        </h2>
                        <div className="w-24 h-2 bg-[#FF6B00] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white dark:bg-gray-950 rounded-full border-4 border-[#FF6B00] flex items-center justify-center text-3xl font-black text-[#FF6B00] mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                01
                            </div>
                            <h3 className="text-2xl font-black dark:text-white mb-3">Sync Profile</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-tight">Connect your GitHub, Portfolio, and LinkedIn. We'll build your unified skill profile.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white dark:bg-gray-950 rounded-full border-4 border-[#FF6B00] flex items-center justify-center text-3xl font-black text-[#FF6B00] mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                02
                            </div>
                            <h3 className="text-2xl font-black dark:text-white mb-3">Get Matched</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-tight">Our AI matches your specific project experience with company tech stacks.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white dark:bg-gray-950 rounded-full border-4 border-[#FF6B00] flex items-center justify-center text-3xl font-black text-[#FF6B00] mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                03
                            </div>
                            <h3 className="text-2xl font-black dark:text-white mb-3">Build Together</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-tight">Accept placements and start building real software with high-growth startups.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Strip */}
            <section className="bg-[#FF6B00] py-20 px-6 sm:px-12 text-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
                    <div className="text-[20rem] font-black text-white leading-none whitespace-nowrap animate-marquee">
                        JOIN INTERNMATCH JOIN INTERNMATCH JOIN INTERNMATCH
                    </div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none mb-10">
                        READY TO SCALE YOUR CAREER?
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link to="/register?role=student">
                            <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-black hover:text-white transition-all shadow-2xl">
                                GET STARTED
                            </button>
                        </Link>
                        <Link to="/register?role=company" className="text-white font-black uppercase tracking-widest border-b-4 border-white pb-1 hover:border-black transition-colors">
                            Partner With Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-950 py-12 px-6 sm:px-12 border-t border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-xl font-black tracking-tighter dark:text-white">
                        INTERNMATCH<span className="text-[#FF6B00]">.</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 dark:text-gray-600">
                        © 2026 INTERNMATCH INC. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}} />
        </div>
    );
};

export default Landing;