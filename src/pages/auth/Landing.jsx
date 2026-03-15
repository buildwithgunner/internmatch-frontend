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
    PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Landing = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] font-sans text-gray-900 dark:text-white antialiased overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 z-[100] w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b-2 border-black dark:border-white/10">
                <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-[1800px] mx-auto">
                    <Link to="/" className="text-2xl font-[1000] tracking-tighter flex items-center gap-2">
                        <div className="bg-[#FF6B00] text-white p-1 rounded-md rotate-3">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <span className="tracking-tight italic uppercase">InternMatch</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em]">
                        <Link to="/register?role=student" className="hover:text-[#FF6B00] transition-all">Students</Link>
                        <Link to="/register?role=recruiter" className="hover:text-[#FF6B00] transition-all">Recruiters</Link>
                        <Link to="/register?role=company" className="hover:text-[#FF6B00] transition-all">Companies</Link>
                        <Link to="/login" className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full hover:bg-[#FF6B00] transition-all">
                            Login
                        </Link>
                        <button onClick={toggleTheme}>
                            {isDark ? <Sun size={20} className="text-[#FF6B00]" /> : <Moon size={20} />}
                        </button>
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 border-2 border-black dark:border-white rounded-lg">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Split Hero Section */}
            <main className="flex flex-col lg:flex-row h-screen pt-[72px]">
                {/* Panel 1: Students */}
                <section className="relative flex-[1] hover:flex-[1.2] transition-all duration-700 ease-in-out group overflow-hidden border-r-2 border-black dark:border-white/10">
                    <div className="absolute inset-0 bg-black">
                        <img 
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000" 
                            alt="Student group collaborating" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700" 
                        />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-10 z-10 text-white">
                        <h2 className="text-6xl font-[1000] leading-[0.85] tracking-tighter mb-4">STUDENTS</h2>
                        <p className="font-bold max-w-xs mb-8 text-white/90">Find internships that fit your skills, not just your major. Get noticed by top brands.</p>
                        <Link to="/register?role=student" className="flex items-center justify-between bg-white text-black p-5 rounded-xl font-black hover:bg-[#FF6B00] hover:text-white transition-all">
                            GET STARTED <ArrowRight />
                        </Link>
                    </div>
                </section>

                {/* Panel 2: Recruiters */}
                <section className="relative flex-[1] hover:flex-[1.2] transition-all duration-700 ease-in-out group overflow-hidden border-r-2 border-black dark:border-white/10">
                    <div className="absolute inset-0 bg-zinc-900">
                        <img 
                            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000" 
                            alt="Recruiter interviewing candidate" 
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700" 
                        />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-10 z-10 text-white">
                        <h2 className="text-6xl font-[1000] leading-[0.85] tracking-tighter mb-4">RECRUITERS</h2>
                        <p className="font-bold max-w-xs mb-8 text-gray-300">Stop digging through resumes. Access a curated pool of vetted, high-potential students.</p>
                        <Link to="/register?role=recruiter" className="flex items-center justify-between bg-[#FF6B00] text-white p-5 rounded-xl font-black hover:bg-white hover:text-black transition-all">
                            FIND TALENT <ArrowRight />
                        </Link>
                    </div>
                </section>

                {/* Panel 3: Companies */}
                <section className="relative flex-[1] hover:flex-[1.2] transition-all duration-700 ease-in-out group overflow-hidden">
                    <div className="absolute inset-0 bg-white">
                        <img 
                            src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=2000" 
                            alt="Modern office architecture" 
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700" 
                        />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-10 z-10">
                        <h2 className="text-6xl font-[1000] leading-[0.85] tracking-tighter mb-4 text-black">COMPANIES</h2>
                        <p className="font-bold max-w-xs mb-8 text-gray-600">Scale your campus presence. Build your future leadership pipeline today.</p>
                        <Link to="/register?role=company" className="flex items-center justify-between bg-black text-white p-5 rounded-xl font-black hover:bg-[#FF6B00] transition-all">
                            PARTNER WITH US <ArrowRight />
                        </Link>
                    </div>
                </section>
            </main>

            {/* Why InternMatch Section */}
            <section className="py-32 px-6 bg-white dark:bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <p className="text-[#FF6B00] font-black uppercase tracking-widest mb-4">The Advantage</p>
                            <h2 className="text-6xl font-[1000] tracking-tighter leading-none">THE NEW STANDARD FOR <span className="italic">CAREER GROWTH.</span></h2>
                        </div>
                        <p className="text-xl font-bold text-gray-500 max-w-sm">We've built the world's most intuitive platform for early-career professional development.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Search />, title: "Smart Matching", desc: "Our AI matches your specific interests with roles that actually fit." },
                            { icon: <ShieldCheck />, title: "Vetted Only", desc: "Every company and student profile is verified for quality and trust." },
                            { icon: <PieChart />, title: "Skill Analytics", desc: "Track your growth and see how you stack up against the market." },
                            { icon: <Globe />, title: "Global Reach", desc: "Remote or on-site, find opportunities in every corner of the world." }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 border-2 border-black dark:border-white/10 rounded-2xl hover:bg-[#FF6B00] hover:text-white transition-all group">
                                <div className="mb-6 p-3 bg-gray-100 dark:bg-white/5 inline-block rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h4 className="text-2xl font-black mb-2">{item.title}</h4>
                                <p className="font-bold opacity-60">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industry Categories */}
            <section className="py-24 bg-black text-white overflow-hidden">
                <div className="px-6 max-w-7xl mx-auto mb-16">
                    <h3 className="text-4xl font-[1000] tracking-tighter">OPPORTUNITIES IN EVERY FIELD.</h3>
                </div>
                <div className="flex animate-marquee gap-6 whitespace-nowrap">
                    {["Marketing", "Engineering", "Digital Design", "Finance", "Healthcare", "Legal", "Public Relations", "Data Science", "Human Resources", "Education"].map((cat, i) => (
                        <div key={i} className="px-10 py-6 border-2 border-white/20 rounded-full text-2xl font-black italic hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all cursor-default">
                            {cat}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-40 px-6 relative bg-zinc-50 dark:bg-zinc-900/30">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-[#FF6B00] text-white px-4 py-1 rounded-md font-black uppercase text-xs mb-8 tracking-widest">Limited Access</div>
                    <h2 className="text-7xl lg:text-9xl font-[1000] tracking-tighter leading-[0.85] mb-12">DON'T MISS YOUR <span className="text-[#FF6B00]">SHOT.</span></h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/register?role=student" className="bg-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all">
                            JOIN NOW
                        </Link>
                        <Link to="/contact" className="border-2 border-black dark:border-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white transition-all">
                            CONTACT US
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-20 px-6 border-t-2 border-black dark:border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="text-4xl font-[1000] tracking-tighter italic mb-6">INTERNMATCH<span className="text-[#FF6B00]">.</span></div>
                        <p className="max-w-xs font-bold text-gray-500">Transforming the bridge between education and professional impact.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-20">
                        <div className="flex flex-col gap-4">
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#FF6B00]">Navigate</p>
                            <Link to="/about" className="font-bold">About</Link>
                            <Link to="/blog" className="font-bold">Journal</Link>
                            <Link to="/careers" className="font-bold">Careers</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#FF6B00]">Legal</p>
                            <Link to="/privacy" className="font-bold">Privacy</Link>
                            <Link to="/terms" className="font-bold">Terms</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 text-[10px] font-black text-gray-400">© 2026 INTERNMATCH INC. GLOBAL.</div>
            </footer>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    display: flex;
                    width: max-content;
                }
            `}</style>
        </div>
    );
};

export default Landing;