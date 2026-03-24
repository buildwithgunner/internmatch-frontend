import React, { useState } from 'react';
import {
    Briefcase,
    ArrowRight,
    Sparkles,
    Users,
    Menu,
    X,
    Rocket,
    Globe,
    TrendingUp,
    Zap,
    Sun,
    Moon,
    Award,
    ShieldCheck,
    Search,
    PieChart,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Landing = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans text-gray-900 dark:text-gray-100 antialiased overflow-hidden selection:bg-[#FF6B00] selection:text-white">
            {/* Background Accents */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FF6B00]/10 to-transparent pointer-events-none -z-10" />
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B00]/5 blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B00]/5 blur-[120px] pointer-events-none -z-10" />

            {/* Navigation */}
            <nav className="fixed top-0 z-[100] w-full bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-[1400px] mx-auto">
                    <Link to="/" className="text-2xl font-[1000] tracking-tighter flex items-center gap-2 group">
                        <div className="bg-[#FF6B00] text-white p-1.5 rounded-lg rotate-3 group-hover:-rotate-3 transition-transform duration-300 shadow-lg shadow-[#FF6B00]/20">
                            <Zap size={22} fill="currentColor" />
                        </div>
                        <span className="tracking-tight italic uppercase text-gray-900 dark:text-white">InternMatch</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">
                        <Link to="/register?role=student" className="hover:text-[#FF6B00] transition-colors duration-200">For Students</Link>
                        <Link to="/register?role=recruiter" className="hover:text-[#FF6B00] transition-colors duration-200">For Employers</Link>
                        <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/20" />
                        <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                            Log In
                        </Link>
                        <Link to="/register?role=student" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full hover:bg-[#FF6B00] dark:hover:bg-[#FF6B00] dark:hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/30 hover:-translate-y-0.5">
                            Get Started
                        </Link>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            {isDark ? <Sun size={18} className="text-[#FF6B00]" /> : <Moon size={18} />}
                        </button>
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-3xl pt-24 px-6 flex flex-col gap-6 lg:hidden">
                    <Link to="/register?role=student" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">For Students</Link>
                    <Link to="/register?role=recruiter" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">For Employers</Link>
                    <Link to="/login" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">Log In</Link>
                    <Link to="/register" className="text-2xl font-black uppercase tracking-tight text-[#FF6B00]">Get Started Today</Link>
                </div>
            )}

            <main className="pt-[140px] lg:pt-[200px] pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00] font-bold text-xs uppercase tracking-widest mb-8">
                            <ShieldCheck size={16} /> Verified Opportunities Only
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-[1000] tracking-tighter leading-[0.9] text-gray-900 dark:text-white mb-8">
                            LAUNCH YOUR <br className="hidden lg:block" />
                            CAREER IN <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-yellow-500 italic">NIGERIA.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                            Stop sending resumes into the void. Connect directly with vetted, fast-growing companies seeking top-tier Nigerian talent. Your skills matter more than your major.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/register?role=student" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-opacity-90 transition-all hover:shadow-xl hover:shadow-[#FF6B00]/30 group">
                                JOIN AS A STUDENT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/register?role=recruiter" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 dark:hover:border-white/30 transition-all">
                                HIRE TALENT
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-4">
                                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1638ce?auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover" />
                                <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover -mr-2" />
                                <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-600 dark:text-gray-300 z-10">
                                    +5k
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                <strong className="text-gray-900 dark:text-white font-black">5,000+</strong> students already hired.
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto hidden md:block">
                        {/* High-end Bento/Masonry Image Grid */}
                        <div className="relative h-[600px] w-full">
                            <div className="absolute top-0 right-0 w-[65%] h-[55%] rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/20">
                                <img src="https://images.unsplash.com/photo-1571260899304-425dea57a274?auto=format&fit=crop&q=80&w=1000" alt="Nigerian students studying" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="absolute bottom-10 left-0 w-[55%] h-[45%] rounded-3xl overflow-hidden shadow-2xl z-20 border border-white/20">
                                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" alt="Young Black Professional" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="absolute bottom-0 right-[5%] w-[45%] h-[35%] rounded-3xl overflow-hidden shadow-2xl z-30 border border-white/20">
                                <img src="https://images.unsplash.com/photo-1551836022-b06985bceb24?auto=format&fit=crop&q=80&w=1000" alt="African team meeting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            {/* Floating UI Elements */}
                            <div className="absolute top-1/2 left-[-10%] z-40 bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 dark:border-white/10 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-full">
                                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">Profile Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alternating Row Features */}
                <div className="mt-32 lg:mt-48 space-y-32">
                    {/* Feature 1: Students */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                                <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=1600" alt="African students collaborating" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                        <div className="flex-1 order-1 lg:order-2">
                            <h2 className="text-4xl lg:text-5xl font-[1000] tracking-tighter mb-6">BUILT FOR NIGERIAN <span className="text-[#FF6B00] italic">STUDENTS.</span></h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                Never blindly apply again. We use advanced algorithms to match your actual skills, projects, and ambitions directly to companies that value them. Stand out on merit, build your portfolio, and start your career before you even graduate.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Skill-based matching system', '100% verified opportunities', 'Direct messaging with recruiters'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold text-gray-800 dark:text-gray-200">
                                        <div className="bg-[#FF6B00]/10 p-1 rounded-full"><CheckCircle size={16} className="text-[#FF6B00]" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register?role=student" className="inline-flex items-center gap-2 text-lg font-black text-[#FF6B00] hover:text-gray-900 dark:hover:text-white transition-colors group">
                                EXPLORE OPPORTUNITIES <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Feature 2: Companies */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl lg:text-5xl font-[1000] tracking-tighter mb-6">MADE FOR <span className="text-[#FF6B00] italic">EMPLOYERS.</span></h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                Access an exclusive, vetted pool of Nigeria's most driven young professionals. From summer interns to your future leadership pipeline, find candidates actively building the skills your company needs.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Filter by verifiable skills', 'Post roles in seconds', 'Streamlined applicant tracking'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold text-gray-800 dark:text-gray-200">
                                        <div className="bg-[#FF6B00]/10 p-1 rounded-full"><CheckCircle size={16} className="text-[#FF6B00]" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register?role=recruiter" className="inline-flex items-center gap-2 text-lg font-black text-[#FF6B00] hover:text-gray-900 dark:hover:text-white transition-colors group">
                                POST AN INTERNSHIP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1600" alt="Black professional recruiter interviewing" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="mt-32 lg:mt-40">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-[1000] tracking-tighter mb-4">NOT JUST ANOTHER JOB BOARD.</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">A complete ecosystem for career acceleration.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm md:col-span-2 hover:border-[#FF6B00]/50 transition-colors">
                            <div className="bg-[#FF6B00]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <Search size={28} className="text-[#FF6B00]" />
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Precision Matching</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Our system doesn't just look at what you studied. We analyze your tech stack, soft skills, and career goals to surface only the most relevant opportunities.</p>
                        </div>
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:border-[#FF6B00]/50 transition-colors">
                            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <Globe size={28} className="text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Nationwide Reach</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Whether you're in Lagos, Abuja, or Port Harcourt, find remote and on-site roles easily across Nigeria.</p>
                        </div>
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:border-[#FF6B00]/50 transition-colors">
                            <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <PieChart size={28} className="text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Growth Analytics</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Track your profile views, application progress, and discover which skills are currently in highest demand.</p>
                        </div>
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm md:col-span-2 hover:border-[#FF6B00]/50 transition-colors">
                            <div className="bg-green-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={28} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Scam-Free Zone</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Every corporate account undergoes systematic verification before they can post roles or contact students. Your safety and time are paramount.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Huge CTA */}
            <div className="bg-[#FF6B00] w-full py-24 lg:py-32 px-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-5xl lg:text-7xl font-[1000] tracking-tighter text-white mb-8">
                    READY TO START?
                </h2>
                <p className="text-xl font-medium text-white/90 mb-10 max-w-xl">
                    Join thousands of Nigerian students who have kickstarted their careers through InternMatch.
                </p>
                <Link to="/register?role=student" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                    CREATE FREE ACCOUNT
                </Link>
            </div>

            {/* Footer */}
            <footer className="py-16 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/10 px-6">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="text-3xl font-[1000] tracking-tighter italic uppercase text-gray-900 dark:text-white mb-4">INTERNMATCH<span className="text-[#FF6B00]">.</span></div>
                        <p className="text-gray-500 font-medium max-w-sm">The exclusive bridge between verified Nigerian talent and forward-thinking organizations.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white">Product</h4>
                            <Link to="/register?role=student" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">For Students</Link>
                            <Link to="/register?role=recruiter" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">For Employers</Link>
                            <Link to="/pricing" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">Pricing</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white">Company</h4>
                            <Link to="/about" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">About Us</Link>
                            <Link to="/contact" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">Contact</Link>
                            <Link to="/careers" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">Careers</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white">Legal</h4>
                            <Link to="/privacy" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-500 hover:text-[#FF6B00] font-medium transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-100 dark:border-white/10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 font-medium text-sm">© {new Date().getFullYear()} InternMatch Inc. All rights reserved.</p>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Built in Nigeria</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;