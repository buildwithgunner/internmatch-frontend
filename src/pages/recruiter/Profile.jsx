import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Linkedin,
    Globe,
    ShieldCheck,
    Award,
    Edit3,
    CheckCircle,
    Loader2,
    AlertTriangle,
    UploadCloud,
    FileText,
    ChevronDown,
    Settings as SettingsIcon
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const RecruiterProfile = () => {
    const [recruiter, setRecruiter] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/recruiter/profile');
            setRecruiter(res.data.recruiter);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-600" size={48} />
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-12">
            {/* Profile Overview Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 md:p-16 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                    <div className="relative group">
                        <div className="w-48 h-48 rounded-[3rem] bg-slate-950 text-white flex items-center justify-center text-7xl font-black shadow-2xl shadow-slate-950/20 transform -rotate-3 hover:rotate-0 transition-all duration-500">
                            {recruiter.name.charAt(0)}
                        </div>
                        {recruiter.is_verified && (
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/40 border-4 border-white dark:border-slate-900">
                                <CheckCircle size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white break-words leading-none">{recruiter.name}</h1>
                                {recruiter.is_verified && (
                                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                                        Verified Partner
                                    </span>
                                )}
                            </div>
                            <p className="text-xl text-slate-500 font-bold flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <Briefcase size={20} className="text-orange-600" /> {recruiter.position || 'Professional Recruiter'} <span className="text-slate-300">•</span> <span className="text-slate-900 dark:text-white font-black">{recruiter.company_name}</span> <span className="text-slate-300">•</span> <span>{recruiter.sector || 'Industry Unspecified'}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Score</p>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-orange-600" />
                                    <span className="font-black text-xl text-slate-900 dark:text-white">{recruiter.trust_score}%</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vibe Check</p>
                                <div className="flex items-center gap-2">
                                    <Award size={16} className="text-orange-600" />
                                    <span className="font-black text-xs text-slate-900 dark:text-white uppercase truncate">{recruiter.trust_level}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <Link
                                to="/recruiter/settings?tab=profile"
                                className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Edit3 size={18} /> Manage Profile
                            </Link>
                            <Link
                                to="/recruiter/settings?tab=security"
                                className="px-10 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm border border-slate-100 dark:border-slate-700 shadow-sm hover:border-orange-600/30 transition-all flex items-center justify-center gap-3"
                            >
                                <Lock size={18} /> Security
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* missing tangible document/website warning */}
            {(!recruiter.tangible_document || !recruiter.website) && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm">
                    <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-600">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xl font-black text-amber-600 dark:text-amber-500 mb-1">Verification Action Required</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                                To become a <span className="font-bold text-slate-900 dark:text-white">Verified Partner</span> and boost your credibility, please provide your professional website and verify your identity in the Trust center.
                            </p>
                        </div>
                        <Link
                            to="/recruiter/settings?tab=verification"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors border-b-2 border-orange-600/20 pb-1"
                        >
                            Go to Verification <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-10">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                            Professional Summary
                        </h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium break-words">
                            {recruiter.bio || 'This recruiter has not added a bio yet. A complete bio helps build trust with potential candidates.'}
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Contact Info</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-orange-600/10 transition-colors">
                                    <Mail size={20} className="text-orange-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</p>
                                    <p className="font-bold text-slate-900 dark:text-white break-all">{recruiter.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-orange-600/10 transition-colors">
                                    <Phone size={20} className="text-orange-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                    <p className="font-bold text-slate-900 dark:text-white break-all">{recruiter.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            {recruiter.linkedin && (
                                <a href={recruiter.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Linkedin size={20} className="text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn</p>
                                        <p className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors truncate">Professional Profile</p>
                                    </div>
                                </a>
                            )}
                            {recruiter.website && (
                                <a href={recruiter.website} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                                        <Globe size={20} className="text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                                        <p className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors truncate">Personal Portfolio</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterProfile;
