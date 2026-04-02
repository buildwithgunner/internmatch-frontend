import React, { useState, useEffect, useRef } from 'react';
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
    CheckCircle,
    ChevronRight,
    ArrowUpRight,
    Quote,
    Instagram,
    Twitter,
    Linkedin,
    GraduationCap,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

// Import local assets
import heroStudent from '../../assets/hero_student.png';
import heroRecruiter from '../../assets/hero_recruiter.png';
import heroCompany from '../../assets/hero_company.png';
import testimonialAvatar from '../../assets/testimonial_avatar.png';

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            // Add scroll logic if needed
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans text-gray-900 dark:text-gray-100 antialiased overflow-hidden selection:bg-[#FF6B00] selection:text-white transition-colors duration-300">
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
                        <Link to="/register?role=recruiter" className="hover:text-[#FF6B00] transition-colors duration-200">For Recruiters</Link>
                        <Link to="/register?role=company" className="hover:text-[#FF6B00] transition-colors duration-200">For Companies</Link>
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

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-full left-0 w-full bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-white/10 px-6 pb-8 lg:hidden flex flex-col gap-6 overflow-hidden"
                        >
                            <Link to="/register?role=student" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4 mt-8">For Students</Link>
                            <Link to="/register?role=recruiter" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">For Recruiters</Link>
                            <Link to="/register?role=company" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">For Companies</Link>
                            <Link to="/login" className="text-2xl font-black uppercase tracking-tight border-b border-gray-100 dark:border-white/10 pb-4">Log In</Link>
                            <Link to="/register" className="text-2xl font-black uppercase tracking-tight text-[#FF6B00]">Get Started Today</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

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
                                RECRUITERS
                            </Link>
                            <Link to="/register?role=company" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 dark:hover:border-white/30 transition-all">
                                COMPANIES
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-4">
                                <img
                                    src="https://images.unsplash.com/photo-1531123897727-8f129e1638ce?auto=format&fit=crop&w=100&h=100&q=80"
                                    alt="Student avatar 1"
                                    className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover bg-gray-200"
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=S1&background=FF6B00&color=fff"; }}
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&h=100&q=80"
                                    alt="Student avatar 2"
                                    className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover -mr-2 bg-gray-200"
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=S2&background=333&color=fff"; }}
                                />
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
                                <img src={heroStudent} alt="Nigerian students studying" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="absolute bottom-10 left-0 w-[55%] h-[45%] rounded-3xl overflow-hidden shadow-2xl z-20 border border-white/20">
                                <img src={heroRecruiter} alt="Young Black Professional" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="absolute bottom-0 right-[5%] w-[45%] h-[35%] rounded-3xl overflow-hidden shadow-2xl z-30 border border-white/20">
                                <img src={heroCompany} alt="African team meeting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                                <img src={heroStudent} alt="African students collaborating" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-[1000] tracking-tighter mb-6">BUILT FOR NIGERIAN <span className="text-[#FF6B00] italic">STUDENTS.</span></h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                Never blindly apply again. We use advanced algorithms to match your actual skills, projects, and ambitions directly to companies that value them. Stand out on merit, build your portfolio, and start your career before you even graduate.
                            </p>
                            <ul className="space-y-4 mb-8 text-left inline-block lg:block">
                                {['Skill-based matching system', '100% verified opportunities', 'Direct messaging with recruiters'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold text-gray-800 dark:text-gray-200">
                                        <div className="bg-[#FF6B00]/10 p-1 rounded-full"><CheckCircle size={16} className="text-[#FF6B00]" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <Link to="/register?role=student" className="inline-flex items-center gap-2 text-lg font-black text-[#FF6B00] hover:text-gray-900 dark:hover:text-white transition-colors group">
                                    EXPLORE OPPORTUNITIES <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Companies */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-[1000] tracking-tighter mb-6">MADE FOR <span className="text-[#FF6B00] italic">EMPLOYERS.</span></h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                                Access an exclusive, vetted pool of Nigeria's most driven young professionals. From summer interns to your future leadership pipeline, find candidates actively building the skills your company needs.
                            </p>
                            <ul className="space-y-4 mb-8 text-left inline-block lg:block">
                                {['Filter by verifiable skills', 'Post roles in seconds', 'Streamlined applicant tracking'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold text-gray-800 dark:text-gray-200">
                                        <div className="bg-[#FF6B00]/10 p-1 rounded-full"><CheckCircle size={16} className="text-[#FF6B00]" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <Link to="/register?role=recruiter" className="inline-flex items-center gap-2 text-lg font-black text-[#FF6B00] hover:text-gray-900 dark:hover:text-white transition-colors group">
                                    POST AN INTERNSHIP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                                <img src={heroRecruiter} alt="Black professional recruiter interviewing" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Section */}
                <section className="py-24 lg:py-64 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <PieChart size={40} className="mx-auto mb-8 md:mb-16 text-[#FF6B00] opacity-30" />
                        <h2 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight italic max-w-5xl mx-auto uppercase">
                            "InternMatch has completely changed our <span className="text-[#FF6B00]">talent pipeline</span>. We look for skills, not CVs."
                        </h2>
                        <div className="mt-12 md:mt-16 flex flex-col items-center">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-4 md:mb-6 overflow-hidden border-4 border-[#FF6B00]/20">
                                <img src={testimonialAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="font-black uppercase tracking-widest text-base md:text-lg">Alexander Vogt</div>
                            <div className="text-[#FF6B00] font-black text-xs md:text-sm uppercase tracking-widest mt-1 md:mt-2">Head of Engineering, Volaris</div>
                        </div>
                    </motion.div>
                </section>

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
                        <p className="max-w-sm font-bold text-gray-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                            Bridging the gap between ambitious global talent and high-performance organizations.
                        </p>
                        <div className="flex gap-4 md:gap-6">
                            {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                                <Link key={i} className="p-3 md:p-4 bg-zinc-100 dark:bg-white/5 rounded-xl md:rounded-2xl hover:bg-[#FF6B00] hover:text-white transition-all">
                                    <Icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm uppercase tracking-widest font-bold">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-gray-900 dark:text-white">Product</h4>
                            <Link to="/register?role=student" className="text-gray-500 hover:text-[#FF6B00] transition-colors">For Students</Link>
                            <Link to="/register?role=recruiter" className="text-gray-500 hover:text-[#FF6B00] transition-colors">For Recruiters</Link>
                            <Link to="/register?role=company" className="text-gray-500 hover:text-[#FF6B00] transition-colors">For Companies</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-gray-900 dark:text-white">Company</h4>
                            <Link to="/about" className="text-gray-500 hover:text-[#FF6B00] transition-colors">About Us</Link>
                            <Link to="/contact" className="text-gray-500 hover:text-[#FF6B00] transition-colors">Contact</Link>
                            <Link to="/careers" className="text-gray-500 hover:text-[#FF6B00] transition-colors">Careers</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-gray-900 dark:text-white">Legal</h4>
                            <Link to="/privacy" className="text-gray-500 hover:text-[#FF6B00] transition-colors">Privacy</Link>
                            <Link to="/terms" className="text-gray-500 hover:text-[#FF6B00] transition-colors">Terms</Link>
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