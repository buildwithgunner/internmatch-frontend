import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import {
    PlusCircle,
    Briefcase,
    Users,
    Calendar,
    MapPin,
    MoreVertical,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

const MyInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchInternships = async () => {
        try {
            const res = await api.get('/recruiter/my-internships');
            setInternships(res.data.postings || []);
        } catch (err) {
            console.error('Failed to fetch internships', err);
            // Don't show error if it's a 401/403 which might be handled by interceptors
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/recruiter/internships/${id}`);
                setInternships(internships.filter(i => i.id !== id));
                Swal.fire('Deleted!', 'Internship has been deleted.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Failed to delete internship', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                        My <span className="text-orange-600">Internships</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your active postings</p>
                </div>
                <button
                    onClick={() => navigate('/recruiter/post')}
                    className="flex items-center gap-2 bg-orange-600 text-white px-6 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20 w-full md:w-auto justify-center"
                >
                    <PlusCircle size={20} />
                    Post New Internship
                </button>
            </div>

            {internships.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {internships.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 hover:border-orange-600/30 transition-all shadow-sm hover:shadow-xl group">
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-orange-600" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-orange-600" />
                                            Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-orange-600" />
                                            {job.applications_count || 0} Applicants
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end lg:self-center">
                                    <button
                                        onClick={() => navigate(`/company/edit/${job.id}`)} // Need to ensure the route handles recruiter mode too if using App.tsx edit
                                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                        title="Edit Listing"
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Delete Listing"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all">
                                        View Applicants
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-20 text-center">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
                        <Briefcase size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No internships yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">Ready to find some talent? Post your first internship opportunity now and start receiving applications.</p>
                    <button
                        onClick={() => navigate('/recruiter/post')}
                        className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-orange-500/20"
                    >
                        Publish Your First Job
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyInternships;
