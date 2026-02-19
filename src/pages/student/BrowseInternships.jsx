import { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, Globe, 
  DollarSign, Zap, LayoutGrid, 
  ArrowRight, SearchCode, X 
} from 'lucide-react';
import api from '../../services/api.js';
import InternshipCard from "../../components/cards/InternshipsCard.jsx";

function BrowseInternships() {
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    paid: false,
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data.internships || []);
      } catch (err) {
        setError('Failed to load internships');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const filteredInternships = useMemo(() => {
    return internships.filter(intern => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        intern.title?.toLowerCase().includes(q) ||
        intern.company?.company_name?.toLowerCase().includes(q);
      const matchesType = filters.type === 'All' || intern.type?.toLowerCase() === filters.type.toLowerCase();
      const matchesPaid = !filters.paid || intern.paid;
      const matchesLocation = !filters.location || 
        intern.location?.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesType && matchesPaid && matchesLocation;
    });
  }, [searchQuery, filters, internships]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Discovering opportunities...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300">
      {/* Hero Section – Glass overlay + modern orange */}
      <div className="relative bg-gradient-to-br from-orange-700 to-orange-600 pt-20 pb-40 px-6 overflow-hidden shadow-2xl shadow-orange-600/20">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/5 dark:bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-xl rounded-full text-white text-xs font-semibold uppercase tracking-wide border border-white/20">
                <Zap size={14} fill="currentColor" /> Opportunity Hub
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Discover <span className="text-orange-200">Your Next</span> Step
              </h1>
              <p className="text-lg text-orange-100/90 font-medium">
                Explore the latest internships tailored to your profile.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 min-w-[300px]">
              <div className="p-6 bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl text-white text-center shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">Live Roles</p>
                <p className="text-4xl font-extrabold">{internships.length}</p>
              </div>
              <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl text-orange-700 dark:text-orange-300 text-center shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">Status</p>
                <p className="text-4xl font-extrabold italic">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20 space-y-12">
        {/* Filters Bar – Glassmorphic */}
        <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              placeholder="Search roles, skills, companies..."
              className="w-full pl-14 pr-12 py-4 bg-transparent rounded-2xl border border-slate-300/50 dark:border-slate-600/50 focus:border-orange-500 dark:focus:border-orange-400 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full">
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              placeholder="Location or Remote..."
              className="w-full pl-14 py-4 bg-transparent rounded-2xl border border-slate-300/50 dark:border-slate-600/50 focus:border-orange-500 dark:focus:border-orange-400 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className={`px-6 py-3 rounded-2xl backdrop-blur-xl border text-sm font-semibold cursor-pointer transition-all ${
              filters.type === 'All' 
                ? 'bg-orange-600 text-white border-orange-600 dark:bg-orange-700 dark:border-orange-700' 
                : 'bg-white/40 dark:bg-slate-800/40 border-slate-300/50 dark:border-slate-600/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 text-slate-700 dark:text-slate-300'
            }`} onClick={() => setFilters({ ...filters, type: 'All' })}>
              All Types
            </div>

            {['Remote', 'Onsite', 'Hybrid'].map(t => (
              <div 
                key={t}
                className={`px-6 py-3 rounded-2xl backdrop-blur-xl border text-sm font-semibold cursor-pointer transition-all ${
                  filters.type === t 
                    ? 'bg-orange-600 text-white border-orange-600 dark:bg-orange-700 dark:border-orange-700' 
                    : 'bg-white/40 dark:bg-slate-800/40 border-slate-300/50 dark:border-slate-600/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 text-slate-700 dark:text-slate-300'
                }`} onClick={() => setFilters({ ...filters, type: t })}
              >
                {t}
              </div>
            ))}

            <button
              onClick={() => setFilters({ ...filters, paid: !filters.paid })}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all backdrop-blur-xl border ${
                filters.paid 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 dark:bg-emerald-700 dark:border-emerald-700' 
                  : 'bg-white/40 dark:bg-slate-800/40 border-slate-300/50 dark:border-slate-600/50 hover:border-emerald-400/50 dark:hover:border-emerald-500/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <DollarSign size={16} className="inline mr-1" />
              {filters.paid ? 'Paid Only' : 'All Roles'}
            </button>
          </div>
        </div>

        {/* Grid Header */}
        <div className="flex items-center gap-4 px-2">
          <LayoutGrid size={18} className="text-orange-600 dark:text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommended <span className="text-orange-600 dark:text-orange-500">Picks</span>
          </h3>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <p className="text-sm text-slate-500 dark:text-slate-400">({filteredInternships.length} roles)</p>
        </div>

        {/* Cards */}
        {filteredInternships.length === 0 ? (
          <div className="py-24 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl">
            <SearchCode size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-600" />
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3">No opportunities found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map((intern) => (
              <div 
                key={intern.id} 
                className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {intern.paid && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white text-xs font-bold uppercase px-5 py-1.5 rounded-full shadow-lg border-4 border-white dark:border-slate-900">
                    Paid Opportunity
                  </div>
                )}
                <InternshipCard internship={intern} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseInternships;