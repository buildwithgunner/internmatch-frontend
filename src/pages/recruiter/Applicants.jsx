import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Mail, CheckCircle, XCircle, Clock, UserCheck, User,
    Briefcase, Calendar, Users, Hourglass, CheckSquare, Sparkles, ExternalLink,
    Linkedin, FileText, Zap, MoreVertical
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

function Applicants() {
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const internshipsRes = await api.get('/recruiter/my-internships');
                const myInternships = internshipsRes.data.postings || [];
                if (myInternships.length === 0) {
                    setLoading(false);
                    return;
                }

                const appsPromises = myInternships.map(intern =>
                    api.get(`/internships/${intern.id}/applications`)
                        .catch(() => ({ data: { applications: [] } }))
                );

                const results = await Promise.all(appsPromises);
                const allApps = results.flatMap((res, index) => {
                    const applications = res.data.applications || [];
                    return applications.map(app => ({
                        ...app,
                        internshipTitle: myInternships[index].title,
                        internshipId: myInternships[index].id,
                    }));
                });

                setApplicants(allApps);
                setFilteredApplicants(allApps);
            } catch (err) {
                console.error('Failed to load applicants', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    useEffect(() => {
        let result = applicants;
        if (statusFilter !== 'All') {
            result = result.filter(app => app.status?.toLowerCase() === statusFilter.toLowerCase());
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(app =>
                app.student?.name?.toLowerCase().includes(q) ||
                app.internshipTitle?.toLowerCase().includes(q)
            );
        }
        setFilteredApplicants(result);
    }, [searchTerm, statusFilter, applicants]);

    const handleStatusUpdate = async (applicationId, newStatus) => {
        const result = await Swal.fire({
            title: `Move to ${newStatus}?`,
            text: "This will notify the student of their progress.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#ea580c',
            customClass: { popup: 'rounded-3xl dark:bg-slate-900 dark:text-white' }
        });

        if (!result.isConfirmed) return;

        try {
            await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
            setApplicants(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
            Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed' });
        }
    };

    const handleViewProfile = async (studentId) => {
        setProfileLoading(true);
        setSelectedApplicant(null);
        try {
            const res = await api.get(`/student/profile/${studentId}`);
            setSelectedApplicant(res.data.student);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to Load Profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const stats = [
        { label: 'Total', value: applicants.length, icon: <Users size={20} />, color: 'orange' },
        { label: 'Pending', value: applicants.filter(a => a.status === 'pending').length, icon: <Hourglass size={20} />, color: 'amber' },
        { label: 'Interviews', value: applicants.filter(a => a.status === 'interview').length, icon: <UserCheck size={20} />, color: 'purple' },
        { label: 'Hired', value: applicants.filter(a => a.status === 'accepted').length, icon: <CheckSquare size={20} />, color: 'emerald' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
            {/* Header & Search Area */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold">
                        <Sparkles size={14} /> Talent Pipeline
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Applicant <span className="text-orange-600">Pipeline</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
                        Review and manage candidates through your hiring stages.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search name or role..."
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 ring-orange-500/20 outline-none transition-all font-bold"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                        <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="py-20 text-center animate-pulse font-bold text-slate-400">Loading pipeline...</div>
            ) : filteredApplicants.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] py-16 px-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Users size={48} className="mx-auto mb-4 text-slate-300" />
                    <h2 className="text-xl font-bold dark:text-white">No applicants match your criteria</h2>
                    <button onClick={() => {setSearchTerm(''); setStatusFilter('All');}} className="mt-4 text-orange-600 font-bold">Clear filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredApplicants.map(app => (
                        <div key={app.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
                                    {app.student?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{app.student?.name}</h3>
                                    <p className="text-xs text-slate-500 truncate">{app.student?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-2 text-sm font-medium dark:text-slate-300">
                                    <Briefcase size={16} className="text-orange-600" />
                                    <span className="truncate">{app.internshipTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={16} />
                                    {new Date(app.created_at).toLocaleDateString()}
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter 
                                    ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {app.status || 'pending'}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <button 
                                    onClick={() => handleViewProfile(app.student_id)}
                                    className="flex-1 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                                >
                                    View Profile
                                </button>
                                
                                <div className="dropdown dropdown-top dropdown-end">
                                    <label tabIndex={0} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer block">
                                        <MoreVertical size={18} />
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white dark:bg-slate-800 rounded-xl w-48 border border-slate-100 dark:border-slate-700 mb-2">
                                        <li><button onClick={() => handleStatusUpdate(app.id, 'interview')}>Interview</button></li>
                                        <li><button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="text-emerald-600">Accept</button></li>
                                        <li><button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="text-rose-600">Reject</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Responsive Profile Modal */}
            {selectedApplicant && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button 
                            onClick={() => setSelectedApplicant(null)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                        >
                            <XCircle size={20} />
                        </button>

                        <div className="p-6 md:p-10 space-y-8">
                            <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-4xl font-black shadow-xl">
                                    {selectedApplicant.name?.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black dark:text-white">{selectedApplicant.name}</h3>
                                    <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
                                        <Mail size={16} /> {selectedApplicant.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-8">
                                {selectedApplicant.bio && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-black uppercase text-orange-600 tracking-widest">About</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedApplicant.bio}</p>
                                    </div>
                                )}

                                {selectedApplicant.skills && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-black uppercase text-orange-600 tracking-widest">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApplicant.skills.split(',').map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                                <a href={`mailto:${selectedApplicant.email}`} className="flex-1 py-4 bg-orange-600 text-white rounded-xl text-center font-black shadow-lg shadow-orange-600/20">
                                    Contact Candidate
                                </a>
                                <button onClick={() => setSelectedApplicant(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Applicants;