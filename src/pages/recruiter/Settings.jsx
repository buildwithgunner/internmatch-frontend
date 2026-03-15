import { useState } from 'react';
import {
    Lock,
    ShieldCheck,
    Bell,
    LogOut,
    ChevronRight,
    Trash2,
    Save
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const RecruiterSettings = () => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                text: err.response?.data?.message || 'Check your credentials and try again.',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
        } finally {
            setLoading(false);
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
                navigate('/login');
            } catch (err) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-12">
            <header className="mb-12">
                <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                    Account <span className="text-orange-600">Settings</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <ShieldCheck size={14} className="text-orange-600" /> Secure your recruiter ecosystem
                </p>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {/* Security Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-sm space-y-10 group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-600 rounded-[1.5rem] text-white shadow-xl shadow-orange-500/20">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Security & Password</h2>
                            <p className="text-sm font-bold text-slate-400">Manage your login credentials</p>
                        </div>
                    </div>

                    <form onSubmit={updatePassword} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Current Password</label>
                                <input
                                    name="current_password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="hidden md:block"></div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">New Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={passwordData.password}
                                    onChange={handlePasswordChange}
                                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirm New Password</label>
                                <input
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={passwordData.password_confirmation}
                                    onChange={handlePasswordChange}
                                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-950 text-white dark:bg-orange-600 px-12 py-5 rounded-[2rem] font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Update Credentials
                        </button>
                    </form>
                </section>

                {/* Preferences Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-orange-600/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white">Email alerts</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" size={24} />
                    </div>

                    <div className="bg-rose-50/30 dark:bg-rose-950/20 p-10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-rose-600 hover:text-white transition-all" onClick={handleLogout}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-600 rounded-2xl text-white">
                                <LogOut size={24} />
                            </div>
                            <div>
                                <h3 className="font-black group-hover:text-white text-slate-900 dark:text-white">Sign Out</h3>
                                <p className="text-[10px] font-bold text-rose-400 group-hover:text-rose-100 uppercase tracking-widest">End Session</p>
                            </div>
                        </div>
                        <ChevronRight className="group-hover:translate-x-1 transition-all" size={24} />
                    </div>
                </div>

                {/* Danger Zone */}
                <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 space-y-6 opacity-60">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Trash2 size={24} />
                        <h2 className="text-xl font-black uppercase tracking-widest">Danger Zone</h2>
                    </div>
                    <p className="text-slate-400 font-medium max-w-lg">Permanently delete your recruiter account and all associated internship data. This action cannot be undone.</p>
                    <button disabled className="text-slate-300 font-black text-xs uppercase cursor-not-allowed border-b border-transparent">Delete Account (Disabled)</button>
                </section>
            </div>
        </div>
    );
};

export default RecruiterSettings;
