import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 antialiased transition-colors">
            {/* Simple Header */}
            <nav className="fixed top-0 z-50 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
                    <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded-lg">IM</span>
                        <span className="dark:text-white">INTERNMATCH</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/" className="text-sm font-bold flex items-center gap-2 hover:text-[#FF6B00] transition-colors">
                            <ArrowLeft size={16} /> Back
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-[#FF6B00] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <ShieldCheck size={14} /> Trust & Safety
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Last Updated: February 18, 2026</p>
                    </div>

                    <div className="space-y-12 text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <Eye className="text-[#FF6B00]" /> 1. Overview
                            </h2>
                            <p>
                                At InternMatch, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our platform to find internships or hire talent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <FileText className="text-[#FF6B00]" /> 2. Information We Collect
                            </h2>
                            <p className="mb-4">We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Account information (Name, Email, Password)</li>
                                <li>Profile details (University, Major, Skills, GitHub/Portfolio links)</li>
                                <li>Hiring information (Company details, Internship descriptions)</li>
                                <li>Communication data when you contact our support</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <Lock className="text-[#FF6B00]" /> 3. Data Protection
                            </h2>
                            <p>
                                We implement industry-standard security measures to protect your data. This includes encryption of sensitive information, regular security audits, and strict access controls for our internal systems.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <ShieldCheck className="text-[#FF6B00]" /> 4. Your Rights
                            </h2>
                            <p>
                                You have the right to access, update, or delete your personal information at any time. You can manage most of these settings directly through your dashboard or by contacting our privacy team.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-50 dark:bg-gray-900 py-12 px-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm font-bold text-gray-400">© 2026 INTERNMATCH INC. YOUR PRIVACY IS OUR PRIORITY.</p>
            </footer>
        </div>
    );
};

export default Privacy;
