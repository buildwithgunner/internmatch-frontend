import React, { useState, useEffect } from 'react';
import { Users, Search, Briefcase, Calendar, Bell } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const RecruiterDashboard = () => {
    const [stats, setStats] = useState({
        total_talent: 0,
        active_searches: 0,
        interviews: 0,
    });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/recruiter/dashboard-stats');
                setStats(response.data.stats);
                setRecommendations(response.data.recommendations || []);
            } catch (error) {
                console.error("Error fetching recruiter dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-orange-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                            Recruiter <span className="text-orange-600">Dashboard</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                            Find your next star talent
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Notifications',
                                    text: 'You have no new notifications right now.',
                                    confirmButtonColor: '#ea580c',
                                });
                            }}
                            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Bell size={20} />
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black">
                            RD
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Stats */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_talent}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Talent</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                            <Briefcase size={28} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.active_searches}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Searches</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.interviews}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Interviews</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Top Recommendations</h2>
                        <button className="text-orange-600 font-bold uppercase tracking-widest text-xs border-b-2 border-orange-600">View All</button>
                    </div>

                    <div className="space-y-6">
                        {recommendations.length > 0 ? (
                            recommendations.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-orange-200 dark:hover:border-orange-900 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                                            {student.avatar ? (
                                                <img src={`http://localhost:8000/storage/${student.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white">{student.name}</p>
                                            <p className="text-sm font-bold text-slate-500">{student.role_title} • {student.location}</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white dark:bg-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all border border-slate-200 dark:border-slate-800">
                                        View Profile
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No recommendations found yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
