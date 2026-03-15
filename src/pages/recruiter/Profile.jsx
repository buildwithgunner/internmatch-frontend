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
    Loader2
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const RecruiterProfile = () => {
    const [recruiter, setRecruiter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        position: '',
        bio: '',
        linkedin: '',
        website: ''
    });

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/recruiter/profile');
            const data = res.data.recruiter;
            setRecruiter(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                position: data.position || '',
                bio: data.bio || '',
                linkedin: data.linkedin || '',
                website: data.website || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch('/recruiter/profile', formData);
            setRecruiter(res.data.recruiter);
            setEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2rem]' }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: err.response?.data?.message || 'Something went wrong',
                customClass: { popup: 'rounded-[2rem]' }
            });
        }
    };

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
                                <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">{recruiter.name}</h1>
                                {recruiter.is_verified && (
                                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                                        Verified Partner
                                    </span>
                                )}
                            </div>
                            <p className="text-xl text-slate-500 font-bold flex items-center justify-center md:justify-start gap-3">
                                <Briefcase size={20} className="text-orange-600" /> {recruiter.position || 'Professional Recruiter'} @ <span className="text-slate-900 dark:text-white font-black">{recruiter.company_name}</span>
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

                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto md:mx-0"
                            >
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {editing ? (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 md:p-16 border border-orange-600/20 shadow-2xl shadow-orange-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit <span className="text-orange-600">Profile</span></h2>
                        <button type="button" onClick={() => setEditing(false)} className="text-slate-400 hover:text-orange-600 font-bold uppercase tracking-widest text-xs">Cancel Changes</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Job Position</label>
                                <input name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Talent Acquisition Manager" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">LinkedIn Profile URL</label>
                                <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Professional Website</label>
                                <input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Professional Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell students about yourself and what you look for in candidates..." className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <button type="submit" className="px-16 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-10">
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                                Professional Summary
                            </h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
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
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{recruiter.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-orange-600/10 transition-colors">
                                        <Phone size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{recruiter.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                {recruiter.linkedin && (
                                    <a href={recruiter.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Linkedin size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn</p>
                                            <p className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors">Professional Profile</p>
                                        </div>
                                    </a>
                                )}
                                {recruiter.website && (
                                    <a href={recruiter.website} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                                            <Globe size={20} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                                            <p className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors">Personal Portfolio</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterProfile;
