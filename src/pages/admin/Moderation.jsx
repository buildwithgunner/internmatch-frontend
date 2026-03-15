import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
    ShieldAlert,
    UserCheck,
    UserX,
    CheckCircle,
    Loader2,
    ExternalLink,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';

function Moderation() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const res = await api.get('/admin/moderation/reports');
            setReports(res.data.reports);
        } catch (err) {
            console.error('Failed to fetch moderation reports', err);
            Swal.fire('Error', 'Could not load reports', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleVerify = async (recruiterId) => {
        const result = await Swal.fire({
            title: 'Verify Recruiter?',
            text: "This will increase their trust score and mark them as verified.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Verify',
            confirmButtonColor: '#10b981'
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/admin/recruiters/${recruiterId}/verify`);
                Swal.fire('Verified!', 'Recruiter has been verified.', 'success');
                fetchReports();
            } catch (err) {
                Swal.fire('Error', 'Verification failed', 'error');
            }
        }
    };

    const handleBan = async (recruiterId) => {
        const result = await Swal.fire({
            title: 'Ban Recruiter?',
            text: "This will deactivate their internships and ban their account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Ban Them',
            confirmButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/admin/recruiters/${recruiterId}/ban`);
                Swal.fire('Banned!', 'Recruiter has been banned.', 'success');
                fetchReports();
            } catch (err) {
                Swal.fire('Error', 'Ban operation failed', 'error');
            }
        }
    };

    const handleResolve = async (reportId) => {
        try {
            await api.patch(`/admin/reports/${reportId}/resolve`);
            setReports(reports.filter(r => r.id !== reportId));
            Swal.fire('Resolved', 'Report marked as resolved', 'success');
        } catch (err) {
            Swal.fire('Error', 'Failed to resolve report', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <header className="relative bg-slate-900/50 p-6 sm:p-10 rounded-[2.5rem] border border-slate-800 overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                            Platform <span className="text-red-500">Moderation.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Manage Trust & Safety</p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
                </header>

                <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-red-500" size={24} />
                            <h2 className="text-xl font-bold">Pending Student Reports</h2>
                        </div>
                        <span className="bg-red-500/10 text-red-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {reports.length} Reports
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
                                    <th className="px-8 py-6">Student</th>
                                    <th className="px-8 py-6">Internship / Recruiter</th>
                                    <th className="px-8 py-6">Reason</th>
                                    <th className="px-8 py-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {reports.length > 0 ? reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-200">{report.student?.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">ID: #{report.student?.id}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-indigo-400">{report.internship?.title}</span>
                                                    <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>By: {report.internship?.recruiter?.name}</span>
                                                    {report.internship?.recruiter?.is_verified ? (
                                                        <ShieldCheck size={14} className="text-emerald-500" />
                                                    ) : (
                                                        <AlertTriangle size={14} className="text-amber-500" />
                                                    )}
                                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-black">
                                                        Score: {report.internship?.recruiter?.trust_score}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-slate-400 max-w-xs italic line-clamp-2">"{report.reason}"</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                {!report.internship?.recruiter?.is_verified && (
                                                    <button
                                                        onClick={() => handleVerify(report.internship?.recruiter_id)}
                                                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                                                        title="Verify Recruiter"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                )}
                                                {!report.internship?.recruiter?.is_banned && (
                                                    <button
                                                        onClick={() => handleBan(report.internship?.recruiter_id)}
                                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        title="Ban Recruiter"
                                                    >
                                                        <UserX size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleResolve(report.id)}
                                                    className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <ShieldCheck size={48} className="text-slate-700" />
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No pending reports found. The platform is clean!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Moderation;
