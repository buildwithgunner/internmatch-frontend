import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    GraduationCap,
    BookOpen,
    Zap,
    MapPin,
    User,
    Users,
    ChevronRight,
    Loader2,
    X,
    FileText,
    Linkedin,
    Mail,
    ExternalLink
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const DiscoverStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        university: '',
        skills: '',
        graduation_year: ''
    });
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (filters.university) params.append('university', filters.university);
            if (filters.skills) params.append('skills', filters.skills);
            if (filters.graduation_year) params.append('graduation_year', filters.graduation_year);

            const res = await api.get(`/recruiter/discover/students?${params.toString()}`);
            setStudents(res.data.data || []);
        } catch (err) {
            console.error('Failed to discover students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStudents();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const toggleSave = async (student) => {
        try {
            if (student.is_saved) {
                await api.delete(`/recruiter/saved-candidates/${student.id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    text: 'Candidate removed from shortlist',
                    timer: 1500,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true,
                    customClass: { popup: 'rounded-2xl' }
                });
            } else {
                await api.post('/recruiter/saved-candidates', { student_id: student.id });
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Candidate added to shortlist',
                    timer: 1500,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true,
                    customClass: { popup: 'rounded-2xl' }
                });
            }

            // Update local state
            setStudents(prev => prev.map(s =>
                s.id === student.id ? { ...s, is_saved: !s.is_saved } : s
            ));
            if (selectedStudent?.id === student.id) {
                setSelectedStudent(prev => ({ ...prev, is_saved: !prev.is_saved }));
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Action Failed',
                text: err.response?.data?.message || 'Something went wrong',
                customClass: { popup: 'rounded-2xl' }
            });
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                        Discover <span className="text-orange-600">Talent</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <Users size={14} className="text-orange-600" /> Find your next star intern
                    </p>
                </div>

                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, bio, or skill..."
                        className="w-full pl-14 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:border-orange-600 outline-none transition-all shadow-sm focus:shadow-xl font-bold text-slate-900 dark:text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Advanced Filters Sidebar */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-orange-600 rounded-xl text-white">
                                <Filter size={18} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Filters</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">University</label>
                                <input
                                    name="university"
                                    type="text"
                                    placeholder="e.g. University of Lagos"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-600 outline-none transition-all font-bold text-sm"
                                    value={filters.university}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Specialized Skills</label>
                                <input
                                    name="skills"
                                    type="text"
                                    placeholder="e.g. React, Python"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-600 outline-none transition-all font-bold text-sm"
                                    value={filters.skills}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Graduation Year</label>
                                <select
                                    name="graduation_year"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-600 outline-none transition-all font-bold text-sm appearance-none"
                                    value={filters.graduation_year}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Year</option>
                                    {[2024, 2025, 2026, 2027, 2028].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            {(filters.university || filters.skills || filters.graduation_year) && (
                                <button
                                    onClick={() => setFilters({ university: '', skills: '', graduation_year: '' })}
                                    className="w-full py-4 text-orange-600 font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-2xl transition-all"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Results Area */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-orange-600" size={48} />
                            <p className="text-slate-400 font-bold animate-pulse">Scanning the ecosystem...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-orange-600/30 transition-all group flex flex-col h-full cursor-pointer"
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-2xl group-hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/10 group-hover:shadow-orange-500/20">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate transition-colors group-hover:text-orange-600">{student.name}</h3>
                                                {student.is_saved && (
                                                    <Zap size={14} className="text-orange-600 fill-orange-600" />
                                                )}
                                            </div>
                                            <p className="text-slate-400 font-bold text-sm flex items-center gap-2 truncate">
                                                <GraduationCap size={14} className="text-orange-600" /> {student.profile?.university || 'Academic Institution'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            {student.profile?.skills?.split(',').slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {(student.profile?.skills?.split(',').length > 3) && (
                                                <span className="px-3 py-1 bg-orange-600/10 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    +{student.profile.skills.split(',').length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                                            {student.profile?.bio || 'No bio provided.'}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Graduating <span className="text-slate-900 dark:text-white">{student.profile?.graduation_year || 'N/A'}</span>
                                        </div>
                                        <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-20 text-center">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
                                <User size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No students found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">Try broadening your search or adjusting the filters to discover more talent.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setFilters({ university: '', skills: '', graduation_year: '' }) }}
                                className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-orange-500/20"
                            >
                                Reset Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Details Backdrop/Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-8 right-8 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 hover:text-white rounded-2xl transition-all z-20"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-12 md:p-16 space-y-12">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-orange-600 text-white flex items-center justify-center text-6xl font-black shadow-2xl shadow-orange-500/40 transform -rotate-3 hover:rotate-0 transition-transform">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div className="text-center md:text-left space-y-4">
                                    <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {selectedStudent.name}
                                    </h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <p className="text-lg text-slate-500 font-bold flex items-center gap-3">
                                            <GraduationCap size={20} className="text-orange-600" /> {selectedStudent.profile?.university}
                                        </p>
                                        <p className="text-lg text-slate-500 font-bold flex items-center gap-3">
                                            <MapPin size={20} className="text-orange-600" /> {selectedStudent.profile?.state}, {selectedStudent.profile?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                            <BookOpen size={24} className="text-orange-600" /> About
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                            {selectedStudent.profile?.bio || 'Candidate has not provided a bio yet.'}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                            <Zap size={24} className="text-orange-600" /> Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedStudent.profile?.skills?.split(',').map((skill, i) => (
                                                <span key={i} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-sm border border-slate-100 dark:border-slate-700">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                            <FileText size={24} className="text-orange-600" /> Academic & Docs
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
                                                        <GraduationCap size={20} className="text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</p>
                                                        <p className="font-bold text-slate-900 dark:text-white">{selectedStudent.profile?.department || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedStudent.documents?.map(doc => (
                                                <a
                                                    key={doc.id}
                                                    href={`http://localhost:8000/storage/${doc.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-orange-600 hover:text-white transition-all group/doc"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl group-hover/doc:bg-white/20">
                                                            <FileText size={20} className="text-orange-600 group-hover/doc:text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover/doc:text-white/80">{doc.type}</p>
                                                            <p className="font-bold truncate max-w-[150px]">{doc.original_name}</p>
                                                        </div>
                                                    </div>
                                                    <ExternalLink size={18} className="opacity-40 group-hover/doc:opacity-100" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex gap-6">
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-bold transition-colors">
                                        <Linkedin size={20} /> LinkedIn
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-bold transition-colors">
                                        <Mail size={20} /> Email
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSave(selectedStudent);
                                        }}
                                        className={`px-10 py-5 rounded-2xl font-black text-sm transition-all ${selectedStudent.is_saved
                                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                            }`}
                                    >
                                        {selectedStudent.is_saved ? 'Shortlisted' : 'Save for later'}
                                    </button>
                                    <button className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-orange-600 transition-all">
                                        Invite to apply
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

export default DiscoverStudents;
