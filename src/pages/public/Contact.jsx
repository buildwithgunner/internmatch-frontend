import React from 'react';
import { Mail, MessageSquare, MapPin, Send, ArrowLeft, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 antialiased transition-colors">
            {/* Simple Header */}
            <nav className="fixed top-0 z-50 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
                    <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded-lg">IM</span>
                        <span className="dark:text-white">InternMatch</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/" className="text-sm font-bold flex items-center gap-2 hover:text-[#FF6B00] transition-colors">
                            <ArrowLeft size={16} /> Back
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-[#FF6B00] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <MessageSquare size={14} /> Get In Touch
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
                            Let's talk <br />
                            about <span className="text-[#FF6B00]">growth.</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-bold mb-12 max-w-md">
                            Have questions about hiring or finding your next role? Our team is here to help you scale.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-[#FF6B00] border border-gray-100 dark:border-gray-800">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-1">Email us</h3>
                                    <p className="text-lg font-bold">hello@internmatch.io</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-[#FF6B00] border border-gray-100 dark:border-gray-800">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-1">Our Base</h3>
                                    <p className="text-lg font-bold">123 Innovation Way, Tech City, 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex gap-6">
                            <a href="#" className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:text-[#FF6B00] transition-colors border border-gray-100 dark:border-gray-800"><Twitter size={20} /></a>
                            <a href="#" className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:text-[#FF6B00] transition-colors border border-gray-100 dark:border-gray-800"><Linkedin size={20} /></a>
                            <a href="#" className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:text-[#FF6B00] transition-colors border border-gray-100 dark:border-gray-800"><Github size={20} /></a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-8 sm:p-12 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help?"
                                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-bold transition-all resize-none"
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[#FF6B00] text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
                            >
                                Send Message <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="mt-12 py-12 px-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">© 2026 InternMatch — RESPONSE WITHIN 24 HOURS.</p>
            </footer>
        </div>
    );
};

export default Contact;
