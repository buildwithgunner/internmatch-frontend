import { useState, useEffect } from 'react';
import { Bookmark, LayoutGrid, SearchCode, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import InternshipCard from "../../components/cards/InternshipsCard.jsx";

function SavedInternships() {
    const [savedInternships, setSavedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await api.get('/student/saved-internships');
                setSavedInternships(res.data.saved_internships || []);
            } catch (err) {
                setError('Failed to load saved internships');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm font-medium text-slate-500 italic">Retrieving your bookmarks...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-600/20">
                            <Bookmark size={12} fill="currentColor" /> Personal Collection
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                            Saved <span className="text-orange-600">Internships</span>.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Opportunities you've bookmarked for later consideration.
                        </p>
                    </div>

                    <Link
                        to="/student/browse"
                        className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-orange-500 dark:hover:border-orange-500 transition-all active:scale-[0.98]"
                    >
                        <ArrowLeft size={14} /> Browse More
                    </Link>
                </div>

                {/* Stats & Divider */}
                <div className="flex items-center gap-4">
                    <LayoutGrid size={18} className="text-orange-600" />
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {savedInternships.length} Saved Opportunities
                    </p>
                </div>

                {/* Content */}
                {savedInternships.length === 0 ? (
                    <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-xl space-y-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600">
                            <SearchCode size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your collection is empty.</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                                Browse internships and tap the bookmark icon to save the roles that interest you.
                            </p>
                        </div>
                        <Link
                            to="/student/browse"
                            className="inline-block bg-orange-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                        >
                            Start Discovering
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedInternships.map((intern) => (
                            <InternshipCard
                                key={intern.id}
                                internship={{ ...intern, is_saved: true }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default SavedInternships;
