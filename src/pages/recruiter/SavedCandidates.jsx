import { useState, useEffect } from 'react';
import {
    Users,
    Loader2,
    X,
    FileText,
    Linkedin,
    Mail,
    ExternalLink,
    Trash2,
    GraduationCap,
    MapPin,
    Search
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const SavedCandidates = () => {
    const [savedCandidates, setSavedCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const fetchSavedCandidates = async () => {
        setLoading(true);
        try {
            const res = await api.get('/recruiter/saved-candidates');
            setSavedCandidates(res.data.saved_candidates || []);
        } catch (err) {
            console.error('Failed to fetch saved candidates', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedCandidates();
    }, []);

    const handleRemove = async (studentId, name) => {
        const result = await Swal.fire({
            title: 'Remove Candidate?',
            text: `Are you sure you want to remove ${name} from your saved list?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove',
            confirmButtonColor: '#e11d48',
            customClass: {
                popup: 'rounded-[2rem] border-none shadow-2xl',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/recruiter/saved-candidates/${studentId}`);
                setSavedCandidates(prev => prev.filter(item => item.student_id !== studentId));
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to remove',
                    customClass: { popup: 'rounded-[2rem]' }
                });
            }
        }
    };

    const filtered = savedCandidates.filter(item =>
        item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student?.profile?.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student?.profile?.skills?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                        Saved <span className="text-orange-600">Candidates</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <Users size={14} className="text-orange-600" /> Your talent shortlist for future reference
                    </p>
                </div>

                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search your shortlist..."
                        className="w-full pl-14 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:border-orange-600 outline-none transition-all shadow-sm focus:shadow-xl font-bold text-slate-900 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-orange-600" size={48} />
                    <p className="text-slate-400 font-bold animate-pulse">Loading your shortlist...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((item) => {
                        const student = item.student;
                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Remove Trigger (Floating) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemove(student.id, student.name); }}
                                    className="absolute top-6 right-6 p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div
                                    className="flex flex-col h-full cursor-pointer"
                                    onClick={() => setSelectedCandidate(student)}
                                >
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-2xl group-hover:bg-orange-600 transition-colors shadow-xl shadow-slate-900/10">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white truncate group-hover:text-orange-600 transition-colors uppercase tracking-tight">{student.name}</h3>
                                            <p className="text-slate-400 font-bold text-xs flex items-center gap-2 truncate">
                                                <GraduationCap size={14} className="text-orange-600" /> {student.profile?.university || 'Academic Institution'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            {student.profile?.skills?.split(',').slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                                            {student.profile?.bio || 'Professional roadmap in progress.'}
                                        </p>
                                    </div>

                                    {item.notes && (
                                        <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Recruiter Notes</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">"{item.notes}"</p>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Saved on <span className="text-slate-900 dark:text-white">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </span>
                                        <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase cursor-pointer hover:underline">
                                            Profile <ExternalLink size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-24 text-center max-w-2xl mx-auto shadow-sm">
                    <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-slate-200">
                        <Users size={64} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Shortlist is empty</h3>
                    <p className="text-slate-500 text-lg font-medium mb-12">Visit the student discovery portal to find and save the best talent for your company.</p>
                    <button
                        onClick={() => window.location.href = '/recruiter/discover'}
                        className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-500/30"
                    >
                        Explore Students
                    </button>
                </div>
            )}

            {/* Candidate Profile Backdrop (Modal) */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                        <button
                            onClick={() => setSelectedCandidate(null)}
                            className="absolute top-10 right-10 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 hover:text-white rounded-2xl transition-all z-20"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-16 md:p-20 space-y-16">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                                <div className="w-44 h-44 rounded-[3rem] bg-orange-600 text-white flex items-center justify-center text-7xl font-black shadow-2xl shadow-orange-500/40 transform -rotate-3 transition-transform hover:rotate-0">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div className="text-center md:text-left space-y-5">
                                    <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        {selectedCandidate.name}
                                    </h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                        <p className="text-xl text-slate-500 font-bold flex items-center gap-3">
                                            <GraduationCap size={24} className="text-orange-600" /> {selectedCandidate.profile?.university}
                                        </p>
                                        <p className="text-xl text-slate-500 font-bold flex items-center gap-3">
                                            <MapPin size={24} className="text-orange-600" /> {selectedCandidate.profile?.state}, {selectedCandidate.profile?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                <div className="lg:col-span-12 space-y-16">
                                    <div className="space-y-8">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                            <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                                            Professional Profile
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem]">
                                            {selectedCandidate.profile?.bio || 'No bio provided.'}
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                            <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                                            Expertise & Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            {selectedCandidate.profile?.skills?.split(',').map((skill, i) => (
                                                <span key={i} className="px-8 py-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-2xl font-black text-sm border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCandidate.documents?.length > 0 && (
                                        <div className="space-y-8">
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                                <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                                                Credentials
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {selectedCandidate.documents.map(doc => (
                                                    <a
                                                        key={doc.id}
                                                        href={`https://internmatch-backend-api.up.railway.app/storage/${doc.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] hover:bg-orange-600 hover:text-white transition-all group/doc border border-slate-100 dark:border-slate-700"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl group-hover/doc:bg-white/20">
                                                                <FileText size={28} className="text-orange-600 group-hover/doc:text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/doc:text-white/80">{doc.type}</p>
                                                                <p className="font-black text-lg truncate max-w-[200px]">{doc.original_name}</p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={20} className="opacity-30 group-hover/doc:opacity-100" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 items-center justify-between">
                                <div className="flex gap-8">
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-orange-600 font-black text-sm uppercase tracking-widest transition-colors">
                                        <Linkedin size={24} /> LinkedIn
                                    </button>
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-orange-600 font-black text-sm uppercase tracking-widest transition-colors">
                                        <Mail size={24} /> Email
                                    </button>
                                </div>

                                <div className="flex gap-6">
                                    <button
                                        onClick={() => setSelectedCandidate(null)}
                                        className="px-12 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black text-sm hover:bg-slate-200 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button className="px-12 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-slate-900/30 hover:bg-orange-600 transition-all">
                                        Initiate Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedCandidates;
