import { useState, useEffect } from 'react';
import {
    Users,
    Trophy,
    Share2,
    CheckCircle,
    Clock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    GraduationCap,
    Loader2,
    Copy,
    Award
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const CampusAmbassador = () => {
    const [ambassador, setAmbassador] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [universityLeaderboard, setUniversityLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pioneers'); // 'pioneers' or 'universities'
    const [university, setUniversity] = useState('');
    const [applying, setApplying] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statusRes, leaderboardRes, univLeaderboardRes] = await Promise.all([
                api.get('/ambassadors/status'),
                api.get('/ambassadors/leaderboard'),
                api.get('/ambassadors/university-leaderboard')
            ]);
            setAmbassador(statusRes.data.ambassador);
            setLeaderboard(leaderboardRes.data.leaderboard || []);
            setUniversityLeaderboard(univLeaderboardRes.data.university_leaderboard || []);
        } catch (err) {
            console.error('Failed to fetch ambassador data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            const res = await api.post('/ambassadors/apply', { university });
            setAmbassador(res.data.ambassador);
            Swal.fire({
                icon: 'success',
                title: 'Application Received',
                text: 'Your application is being reviewed. We will notify you soon!',
                customClass: { popup: 'rounded-[2rem]' }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Application Failed',
                text: err.response?.data?.message || 'Something went wrong',
                customClass: { popup: 'rounded-[2rem]' }
            });
        } finally {
            setApplying(false);
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Referral code copied to clipboard',
            timer: 1000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-600" size={48} />
                <p className="text-slate-400 font-black animate-pulse">Accessing program data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto p-8 space-y-16">
            {/* Hero Section */}
            <div className={`relative overflow-hidden rounded-[4rem] p-12 md:p-20 text-white shadow-2xl transition-all duration-700 ${ambassador?.status === 'active' ? 'bg-slate-950' : 'bg-orange-600'
                }`}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8">
                        <Sparkles size={14} /> Growth Ecosystem
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                        Become a <span className="text-orange-500">Campus</span> Pioneer.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-bold mb-12 leading-relaxed">
                        Lead the InternMatch revolution at your university. Empower your peers, build your network, and earn exclusive rewards.
                    </p>

                    {/* Status Based Actions */}
                    {!ambassador ? (
                        <div className="flex flex-wrap gap-6 items-center">
                            <button
                                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white text-orange-600 px-12 py-5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                            >
                                Apply Now
                            </button>
                            <div className="flex items-center gap-4 text-white/60 font-black text-xs uppercase tracking-widest">
                                <Users size={20} /> Join 500+ Ambassadors
                            </div>
                        </div>
                    ) : ambassador.status === 'pending' ? (
                        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-center gap-6">
                            <div className="p-4 bg-amber-500 rounded-2xl">
                                <Clock size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Application Under Review</h3>
                                <p className="text-white/60 font-bold">Our team is manually vetting your profile for {ambassador.university}.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-12">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Referral Code</p>
                                    <div className="flex items-center gap-4">
                                        <code className="text-4xl font-black text-orange-500">{ambassador.referral_code}</code>
                                        <button
                                            onClick={() => copyToClipboard(ambassador.referral_code)}
                                            className="p-3 bg-white/10 hover:bg-orange-600 rounded-xl transition-all"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Your Points</p>
                                    <p className="text-4xl font-black">{ambassador.points} <span className="text-sm font-bold text-white/40 uppercase">XP</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 w-fit">
                                <ShieldCheck size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">Active Pioneer Status</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Program Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-orange-600/30 transition-all">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Award size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Expert Certification</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Receive a verified Certificate of Leadership and a LinkedIn recommendation from our CEO.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-orange-600/30 transition-all">
                    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Priority Access</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Early access to premium internships and direct referrals to our top recruitment partners.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-orange-600/30 transition-all">
                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <Share2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Per-Lead Rewards</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Earn points for every student who signs up using your code. Redeem for perks & prizes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Leaderboard */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-fit">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                            <Trophy className="text-orange-600" size={32} /> Rankings
                        </h3>
                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveTab('pioneers')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pioneers' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Pioneers
                            </button>
                            <button
                                onClick={() => setActiveTab('universities')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'universities' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Universities
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'pioneers' ? (
                            leaderboard.length > 0 ? (
                                leaderboard.map((leader, index) => (
                                    <div key={leader.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-orange-600/20 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${index === 0 ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/30' :
                                                index === 1 ? 'bg-slate-300 text-slate-700' :
                                                    index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{leader.user?.name}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{leader.university}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-xl text-slate-900 dark:text-white">{leader.points}</p>
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">XP</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-40">
                                    <Users size={48} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">Waiting for pioneers to rise</p>
                                </div>
                            )
                        ) : (
                            universityLeaderboard.length > 0 ? (
                                universityLeaderboard.map((univ, index) => (
                                    <div key={univ.university} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-orange-600/20 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${index === 0 ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/30' :
                                                index === 1 ? 'bg-slate-300 text-slate-700' :
                                                    index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{univ.university}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Top Institution</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-xl text-slate-900 dark:text-white">{univ.total_points}</p>
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">Total XP</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-40">
                                    <GraduationCap size={48} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">Waiting for university data</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Application Form or Success State */}
                <div id="application-form" className="flex flex-col gap-8">
                    {!ambassador ? (
                        <div className="bg-slate-950 text-white rounded-[3.5rem] p-12 md:p-16 space-y-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-600/30 transition-all duration-700"></div>

                            <div>
                                <h3 className="text-4xl font-black tracking-tight mb-4 uppercase">Apply to Represent</h3>
                                <p className="text-white/60 font-medium">Join the elite rank of student leaders. Please tell us your institution to start.</p>
                            </div>

                            <form onSubmit={handleApply} className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Institutional Name</label>
                                    <div className="relative group">
                                        <GraduationCap size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. University of Manchester"
                                            className="w-full pl-16 pr-8 py-6 bg-white/5 border-none rounded-[2rem] focus:ring-4 focus:ring-orange-600/20 outline-none transition-all font-bold text-white placeholder:text-white/20"
                                            value={university}
                                            onChange={(e) => setUniversity(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={applying}
                                    className="w-full py-6 bg-orange-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                >
                                    {applying ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>Submit Application <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>

                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-4 text-white/40">
                                    <CheckCircle size={18} className="text-orange-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest leading-none">Manual Vetting Process</p>
                                </div>
                                <div className="flex items-center gap-4 text-white/40">
                                    <CheckCircle size={18} className="text-orange-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest leading-none">24-48h Response Time</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 md:p-16 border border-slate-100 dark:border-slate-800 space-y-10 group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Your Impact Path</h3>
                                <p className="text-slate-500 font-medium">How to climb the leaderboard and unlock exclusive perks.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center font-black text-orange-600 shadow-sm border border-slate-100 dark:border-slate-800">
                                        01
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Share your code</h4>
                                        <p className="text-slate-500 text-sm font-medium">Send <code className="text-orange-600 font-black">{ambassador.referral_code}</code> to your peers and student groups.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center font-black text-orange-600 shadow-sm border border-slate-100 dark:border-slate-800">
                                        02
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Verify Signups</h4>
                                        <p className="text-slate-500 text-sm font-medium">Earn <span className="text-orange-600 font-black">50 XP</span> for every verified student profile you bring.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center font-black text-orange-600 shadow-sm border border-slate-100 dark:border-slate-800">
                                        03
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Unlocking Rewards</h4>
                                        <p className="text-slate-500 text-sm font-medium">Hit 500 XP to unlock the "Expert Pioneer" badge and CEO recommendation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampusAmbassador;
