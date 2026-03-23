import { useState, useEffect } from 'react';
import {
    Lock,
    ShieldCheck,
    Bell,
    LogOut,
    ChevronRight,
    Trash2,
    Save,
    User,
    FileText,
    UploadCloud,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Briefcase,
    Linkedin,
    Globe,
    ChevronDown
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RecruiterSettings = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    // Profile State
    const [recruiter, setRecruiter] = useState(null);
    const [profileFormData, setProfileFormData] = useState({
        name: '',
        phone: '',
        position: '',
        sector: '',
        bio: '',
        linkedin: '',
        website: ''
    });

    // Security State
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/recruiter/profile');
            const data = res.data.recruiter;
            setRecruiter(data);
            setProfileFormData({
                name: data.name || '',
                phone: data.phone || '',
                position: data.position || '',
                sector: data.sector || '',
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

    const handleProfileChange = (e) => {
        setProfileFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.patch('/recruiter/profile', profileFormData);
            setRecruiter(res.data.recruiter);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your professional details have been saved.',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err.response?.data?.message || 'Something went wrong.',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } finally {
            setSaving(false);
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/recruiter/settings', passwordData);
            Swal.fire({
                icon: 'success',
                title: 'Password Updated',
                text: 'Your security credentials have been successfully updated.',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2.5rem]' }
            });
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err.response?.data?.message || 'Check your credentials.',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDocumentUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingDoc(true);
        const fb = new FormData();
        fb.append('document', file);
        try {
            const res = await api.post('/recruiter/document', fb, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRecruiter(res.data.recruiter);
            Swal.fire({
                icon: 'success',
                title: 'Document Uploaded',
                text: 'Admins will review your document shortly.',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Upload failed',
                text: err.response?.data?.message || 'Something went wrong',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } finally {
            setUploadingDoc(false);
            e.target.value = '';
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Sign out?',
            text: 'Are you sure you want to end your session?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Sign Out',
            confirmButtonColor: '#0f172a',
            customClass: { popup: 'rounded-[2.5rem]' }
        });

        if (result.isConfirmed) {
            try {
                await api.post('/logout');
                localStorage.clear();
                window.location.href = '/login';
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    };

    const setTab = (tab) => {
        setSearchParams({ tab });
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Deactivate Account?',
            text: 'Your profile and internships will be hidden. You can contact an admin to restore your account later.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, Deactivate',
            background: '#0f172a',
            color: '#fff',
            customClass: { popup: 'rounded-[2.5rem]' }
        });

        if (result.isConfirmed) {
            try {
                await api.delete('/recruiter/account');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                Swal.fire({
                    title: 'Deactivated',
                    text: 'Your account has been deactivated. Redirecting...',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#0f172a',
                    color: '#fff'
                });
                setTimeout(() => navigate('/login'), 2000);
            } catch (err) {
                Swal.fire('Error', 'Failed to deactivate account. Please try again.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-600" size={48} />
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">
            <header className="mb-8 sm:mb-12 flex flex-col items-center text-center md:text-left md:items-end md:flex-row justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-tight">
                        Account <span className="text-orange-600">Settings</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs flex items-center justify-center md:justify-start gap-2">
                        <ShieldCheck size={14} className="text-orange-600" /> Manage your recruiter presence
                    </p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setTab('profile')}
                        className={`flex-1 md:flex-none px-4 sm:px-8 py-3 rounded-[1.5rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-orange-600'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setTab('security')}
                        className={`flex-1 md:flex-none px-4 sm:px-8 py-3 rounded-[1.5rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-orange-600'}`}
                    >
                        Security
                    </button>
                    <button
                        onClick={() => setTab('verification')}
                        className={`flex-1 md:flex-none px-4 sm:px-8 py-3 rounded-[1.5rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-orange-600'}`}
                    >
                        Trust
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 sm:gap-12">
                {activeTab === 'profile' && (
                    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-4 sm:mb-8">
                            <div className="p-4 bg-orange-600 rounded-[1.2rem] sm:rounded-[1.5rem] text-white shadow-xl shadow-orange-500/20">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Professional Identity</h2>
                                <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Update your recruiter details</p>
                            </div>
                        </div>

                        <form onSubmit={updateProfile} className="space-y-8 sm:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-2 sm:space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                                    <input name="name" value={profileFormData.name} onChange={handleProfileChange} className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" required />
                                </div>
                                <div className="space-y-2 sm:space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Job Position</label>
                                    <input name="position" value={profileFormData.position} onChange={handleProfileChange} placeholder="e.g. Talent Acquisition Manager" className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                                </div>
                                <div className="space-y-2 sm:space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
                                    <input name="phone" value={profileFormData.phone} onChange={handleProfileChange} className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                                </div>
                                <div className="space-y-2 sm:space-y-3 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Industry / Sector</label>
                                    <div className="relative">
                                        <select name="sector" value={profileFormData.sector} onChange={handleProfileChange} className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white appearance-none pr-12">
                                            <option value="" disabled>Select industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Real Estate">Real Estate</option>
                                            <option value="Marketing & Advertising">Marketing & Advertising</option>
                                            <option value="Consulting">Consulting</option>
                                            <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                                            <option value="Media & Entertainment">Media & Entertainment</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input name="linkedin" value={profileFormData.linkedin} onChange={handleProfileChange} className="w-full p-4 sm:p-5 pl-14 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" placeholder="https://linkedin.com/in/..." />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Professional Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input name="website" value={profileFormData.website} onChange={handleProfileChange} className="w-full p-4 sm:p-5 pl-14 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Professional Bio</label>
                                <textarea name="bio" value={profileFormData.bio} onChange={handleProfileChange} rows="4" placeholder="Tell students about yourself..." className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white resize-none"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto bg-orange-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ml-auto"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Profile Changes
                            </button>
                        </form>
                    </section>
                )}

                {activeTab === 'security' && (
                    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-8">
                            <div className="p-4 bg-slate-950 dark:bg-orange-600 rounded-[1.2rem] sm:rounded-[1.5rem] text-white shadow-xl shadow-slate-950/20">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Security Controls</h2>
                                <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Keep your login secure</p>
                            </div>
                        </div>

                        <form onSubmit={updatePassword} className="space-y-8 sm:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Current Password</label>
                                    <input
                                        name="current_password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={passwordData.current_password}
                                        onChange={handlePasswordChange}
                                        className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="hidden md:block"></div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">New Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passwordData.password}
                                        onChange={handlePasswordChange}
                                        className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirm New Password</label>
                                    <input
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passwordData.password_confirmation}
                                        onChange={handlePasswordChange}
                                        className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-6">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full sm:w-auto text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-6 py-3 rounded-2xl transition-all"
                                >
                                    <LogOut size={16} /> Sign out instead
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto bg-slate-900 dark:bg-orange-600 text-white px-12 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                                    Update Security Access
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {activeTab === 'verification' && (
                    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                                <div className="p-4 bg-emerald-500 rounded-[1.2rem] sm:rounded-[1.5rem] text-white shadow-xl shadow-emerald-500/20">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Trust & Verification</h2>
                                    <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Verify your recruiter account</p>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center sm:justify-start gap-6 min-w-[200px]">
                                <div className="text-center">
                                    <p className="text-[10px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Score</p>
                                    <p className="text-2xl sm:text-3xl font-black text-orange-600 tracking-tighter">{recruiter?.trust_score || 0}%</p>
                                </div>
                                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-center sm:text-left text-xs sm:text-[10px]">
                                    <p className="font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Status</p>
                                    <p className={`font-black uppercase tracking-widest ${recruiter?.is_verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {recruiter?.is_verified ? 'Verified' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                            <div className="space-y-6">
                                <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-orange-600" size={24} />
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Verification Document</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed text-left">
                                        Upload an official company ID or letter to verify your recruiter identity. This is required for the "Verified" badge.
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-2">
                                            {recruiter?.tangible_document ? (
                                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle size={14} /> Document on file
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                                                    <AlertTriangle size={14} /> No document
                                                </div>
                                            )}
                                        </div>

                                        <input type="file" id="docUpload" className="hidden" accept=".pdf,.jpeg,.jpg,.png" onChange={handleDocumentUpload} disabled={uploadingDoc} />
                                        <label htmlFor="docUpload" className={`w-full sm:w-auto text-center cursor-pointer px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${uploadingDoc ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-orange-600'}`}>
                                            {uploadingDoc ? <Loader2 size={14} className="animate-spin inline mr-2" /> : 'Update Document'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Globe className="text-orange-600" size={24} />
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Profile Strength</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed text-left">
                                        Recruiters with websites and full bios see 70% higher engagement from top talent.
                                    </p>
                                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">Website URL</span>
                                            {recruiter?.website ? <span className="text-emerald-500">Linked</span> : <span className="text-rose-500">Missing</span>}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">Professional Bio</span>
                                            {recruiter?.bio ? <span className="text-emerald-500">Complete</span> : <span className="text-rose-500">Missing</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Account Actions / Danger Zone (only on Security tab) */}
                {activeTab === 'security' && (
                    <section className="bg-rose-500/5 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 border-2 border-dashed border-rose-500/10 space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-rose-500 text-center sm:text-left">
                            <Trash2 size={24} />
                            <h2 className="text-lg sm:text-xl font-black uppercase tracking-widest leading-none">Danger Zone</h2>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center lg:text-left">
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                                Deleting your recruiter account will deactivate your data and active internships. You can contact an admin if you wish to restore it.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full lg:w-auto px-8 py-3 bg-white dark:bg-slate-900 text-rose-500 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                            >
                                Deactivate Account
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default RecruiterSettings;
