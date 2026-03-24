import { useState, useEffect } from 'react';
import {
    Users, Trophy, Share2, CheckCircle, Clock, ArrowRight,
    Sparkles, ShieldCheck, Zap, GraduationCap, Loader2, Copy, Award
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const CampusAmbassador = () => {
    const [ambassador, setAmbassador] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [universityLeaderboard, setUniversityLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pioneers');
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

    useEffect(() => { fetchData(); }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            const res = await api.post('/ambassadors/apply', { university });
            setAmbassador(res.data.ambassador);
            Swal.fire({
                icon: 'success',
                title: 'Application Received',
                text: 'Reviewing your profile now!',
                customClass: { popup: 'rounded-3xl' }
            });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Oops', text: err.response?.data?.message || 'Try again' });
        } finally { setApplying(false); }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        Swal.fire({ icon: 'success', title: 'Copied!', timer: 800, showConfirmButton: false, toast: true, position: 'top-end' });
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-orange-600" size={40} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading ecosystem...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 md:space-y-20">
            
            {/* Hero Section - Fixed Overflow & Mobile Squashing */}
            <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white shadow-2xl transition-all ${
                ambassador?.status === 'active' ? 'bg-slate-950' : 'bg-orange-600'
            }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <Sparkles size={12} /> Growth Ecosystem
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
                        Become a <span className="text-orange-400">Campus</span> Pioneer.
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-bold mb-10 leading-snug">
                        Lead SkillMatch at your university. Empower peers and earn exclusive rewards.
                    </p>

                    {!ambassador ? (
                        <button
                            onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-white text-orange-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Apply Now
                        </button>
                    ) : ambassador.status === 'pending' ? (
                        <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/10">
                            <Clock className="text-orange-400 flex-shrink-0" />
                            <p className="text-sm font-bold uppercase tracking-wide">Reviewing: {ambassador.university}</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-8 items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Referral Code</span>
                                <div className="flex items-center gap-3">
                                    <code className="text-3xl md:text-5xl font-black text-orange-500">{ambassador.referral_code}</code>
                                    <button onClick={() => copyToClipboard(ambassador.referral_code)} className="p-2 bg-white/10 rounded-lg hover:bg-orange-500 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="pb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Points</span>
                                <p className="text-3xl font-black">{ambassador.points} XP</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Benefits - Flex/Grid Hybrid for responsiveness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { icon: <Award className="text-blue-500"/>, title: "Certification", desc: "Leadership certificate and LinkedIn endorsement." },
                    { icon: <Zap className="text-purple-500"/>, title: "Priority Access", desc: "Early access to premium internships and partners." },
                    { icon: <Share2 className="text-orange-500"/>, title: "Rewards", desc: "Redeem XP for exclusive professional perks." }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 mb-6 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h3>
                        <p className="text-slate-500 text-sm font-bold leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Rankings - Added max-height for overflow control */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                        <h3 className="text-2xl font-black flex items-center gap-3 uppercase italic tracking-tighter">
                            <Trophy className="text-orange-600" size={24} /> Rankings
                        </h3>
                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full sm:w-auto">
                            {['pioneers', 'universities'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-500'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {(activeTab === 'pioneers' ? leaderboard : universityLeaderboard).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-orange-600/10">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 font-black text-slate-300">#{idx + 1}</span>
                                    <div>
                                        <p className="font-black text-sm uppercase leading-tight truncate max-w-[150px] sm:max-w-xs">
                                            {activeTab === 'pioneers' ? item.user?.name : item.university}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{activeTab === 'pioneers' ? item.university : 'Top Institution'}</p>
                                    </div>
                                </div>
                                <p className="font-black text-orange-600">{item.points || item.total_points} XP</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Forms Area */}
                <div id="application-form">
                    {!ambassador ? (
                        <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 md:p-12 space-y-8 h-full flex flex-col justify-center">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Apply Now</h3>
                                <p className="text-white/50 text-sm font-bold">Represent your institution in the global network.</p>
                            </div>
                            <form onSubmit={handleApply} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">University Name</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold placeholder:text-white/10"
                                            placeholder="e.g. University of Lagos"
                                            value={university}
                                            onChange={(e) => setUniversity(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button disabled={applying} className="w-full py-5 bg-orange-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                                    {applying ? <Loader2 className="animate-spin mx-auto" /> : "Submit Application"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 space-y-8">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Your Roadmap</h3>
                            <div className="space-y-6">
                                {[
                                    { step: "01", t: "Share Code", d: `Invite peers using ${ambassador.referral_code}` },
                                    { step: "02", t: "Verify Profiles", d: "Earn 50 XP per verified signup." },
                                    { step: "03", t: "Claim Badges", d: "Hit 500 XP for CEO recommendation." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="w-10 h-10 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center font-black flex-shrink-0">{step.step}</span>
                                        <div>
                                            <p className="font-black text-sm uppercase">{step.t}</p>
                                            <p className="text-xs text-slate-500 font-bold">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampusAmbassador;