import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Terms = () => {
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
                            <Scale size={14} /> Legal Agreement
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Effective Date: February 18, 2026</p>
                    </div>

                    <div className="space-y-12 text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <CheckCircle2 className="text-[#FF6B00]" /> 1. Acceptance of Terms
                            </h2>
                            <p>
                                By accessing or using InternMatch, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <FileText className="text-[#FF6B00]" /> 2. User Accounts
                            </h2>
                            <p className="mb-4">When creating an account, you agree to provide accurate and complete information. You are responsible for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintaining the security of your password</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any security breaches</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <AlertCircle className="text-[#FF6B00]" /> 3. Prohibited Conduct
                            </h2>
                            <p>
                                Users are strictly prohibited from posting fraudulent internship listings, harassing other users, or attempting to compromise the security of the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <Scale className="text-[#FF6B00]" /> 4. Limitation of Liability
                            </h2>
                            <p>
                                InternMatch is a matching platform. While we pre-vet users, we are not responsible for the direct actions of students or companies during internships.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-50 dark:bg-gray-900 py-12 px-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm font-bold text-gray-400">© 2026 INTERNMATCH INC. BUILD RESPONSIBLY.</p>
            </footer>
        </div>
    );
};

export default Terms;
