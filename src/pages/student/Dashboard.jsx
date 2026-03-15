import { useState, useEffect } from 'react';
import { 
  Sparkles, Briefcase, Globe, Wallet, Filter, Search, ChevronDown, ChevronUp, Sun, Moon 
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import InternshipCard from "../../components/cards/InternshipsCard.jsx"; 
import StudentInterviewList from '../../components/student/StudentInterviewList.jsx';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'relevant'
  const [locationType, setLocationType] = useState('All');
  const [paidOnly, setPaidOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInterviewsOpen, setIsInterviewsOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    api.get('/student/recommendations')
      .then(res => {
        const data = res.data.internships || [];
        setInternships(data);
        setFilteredInternships(data);
      })
      .catch(err => {
        console.error('Failed to load recommended internships, falling back to all:', err);
        api.get('/internships')
          .then(res => {
            const data = res.data.internships || [];
            setInternships(data);
            setFilteredInternships(data);
          })
          .catch(e => console.error('Final fallback failed:', e));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = internships;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.title?.toLowerCase().includes(q) ||
        i.company?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      );
    }

    // Location & paid filters
    if (locationType !== 'All') {
      result = result.filter(i => i.type?.toLowerCase() === locationType.toLowerCase());
    }
    if (paidOnly) {
      result = result.filter(i => i.paid === true || i.paid === 1);
    }

    // Sort
    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'relevant') {
      // Placeholder: could use match score if you have it in data
      result = [...result]; // keep current order or implement relevance
    }

    setFilteredInternships(result);
  }, [searchQuery, sortBy, locationType, paidOnly, internships]);

  const stats = {
    total: internships.length,
    remote: internships.filter(i => i.type?.toLowerCase() === 'remote').length,
    paid: internships.filter(i => i.paid === true || i.paid === 1).length
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50/70 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10 md:space-y-14">

        {/* Theme Toggle + Header */}
        <div className="flex justify-end pt-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Hero Section – Heavier glass + modern orange */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-orange-900/10 border border-white/10 dark:border-slate-700/30">
          <div className={`absolute inset-0 backdrop-blur-2xl ${
            theme === 'dark' ? 'bg-slate-900/40' : 'bg-white/20'
          }`} />
          <div className="relative px-6 py-14 md:p-16 lg:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 dark:bg-slate-800/30 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 dark:border-slate-600/40 mb-6">
                <Sparkles size={16} className="text-orange-300 dark:text-orange-400" fill="currentColor" /> Live Opportunities
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                Hey, {user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="mt-4 text-xl font-medium opacity-90">
                {stats.total} roles match your profile right now.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-5 min-w-[320px]">
              <StatCard label="Total" value={stats.total} icon={<Briefcase size={24} />} theme={theme} />
              <StatCard label="Remote" value={stats.remote} icon={<Globe size={24} />} theme={theme} />
              <StatCard label="Paid" value={stats.paid} icon={<Wallet size={24} />} isPrimary theme={theme} />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Collapsible Interviews */}
          <section className="lg:col-span-4 space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wide opacity-70">Upcoming Interviews</h2>
              <button
                onClick={() => setIsInterviewsOpen(!isInterviewsOpen)}
                className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:opacity-80 font-medium"
              >
                {isInterviewsOpen ? 'Collapse' : 'Expand'}
                {isInterviewsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${
              isInterviewsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className={`rounded-3xl border shadow-xl overflow-hidden min-h-[300px] backdrop-blur-2xl ${
                theme === 'dark' 
                  ? 'bg-slate-900/30 border-slate-700/40' 
                  : 'bg-white/30 border-slate-200/50'
              }`}>
                <StudentInterviewList />
              </div>
            </div>
          </section>

          {/* Recommended Matches */}
          <section className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Recommended <span className="text-orange-600 dark:text-orange-500">Matches</span>
              </h2>

              {/* Filters + Search + Sort */}
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl border shadow-md min-w-[220px] ${
                  theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50' 
                    : 'bg-white/40 border-slate-200/60'
                }`}>
                  <Search size={18} className="text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl backdrop-blur-xl border shadow-md ${
                  theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50' 
                    : 'bg-white/40 border-slate-200/60'
                }`}>
                  <Filter size={18} className="text-slate-400 dark:text-slate-500" />
                  <select
                    className="bg-transparent text-sm font-semibold outline-none cursor-pointer"
                    value={locationType}
                    onChange={e => setLocationType(e.target.value)}
                  >
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>Onsite</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <select
                  className={`px-4 py-2.5 rounded-2xl backdrop-blur-xl border shadow-md text-sm font-semibold cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-800/30 border-slate-700/50 text-slate-200' 
                      : 'bg-white/40 border-slate-200/60 text-slate-700'
                  }`}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="relevant">Most Relevant</option>
                </select>

                <button
                  onClick={() => setPaidOnly(!paidOnly)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all backdrop-blur-xl shadow-md ${
                    paidOnly 
                      ? 'bg-orange-600 text-white shadow-orange-600/30 dark:bg-orange-700 dark:shadow-orange-700/20' 
                      : theme === 'dark'
                        ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'
                        : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
                  }`}
                >
                  {paidOnly ? 'Paid Only' : 'All Roles'}
                </button>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl animate-pulse bg-slate-200/50 dark:bg-slate-800/40 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/40" />
                ))}
              </div>
            ) : filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInternships.slice(0, 4).map(intern => (
                  <div key={intern.id} className={`rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl border transition-all hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'bg-slate-900/30 border-slate-700/40' 
                      : 'bg-white/40 border-slate-200/50'
                  }`}>
                    <InternshipCard internship={intern} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`py-16 text-center rounded-3xl backdrop-blur-xl border border-dashed shadow-inner ${
                theme === 'dark' 
                  ? 'bg-slate-900/20 border-slate-700/50 text-slate-400' 
                  : 'bg-white/30 border-slate-300/50 text-slate-500'
              }`}>
                <p className="font-medium">No matching internships found. Try adjusting your search or filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, isPrimary = false, theme }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-2xl duration-300 backdrop-blur-xl ${
      isPrimary 
        ? 'bg-orange-800/70 dark:bg-orange-900/60 border-orange-700/50 text-white shadow-orange-900/20' 
        : theme === 'dark'
          ? 'bg-slate-800/40 border-slate-700/50 text-slate-100'
          : 'bg-white/50 border-slate-200/60 text-slate-900'
    }`}>
      <div className={`mb-3 ${isPrimary ? 'text-orange-200' : 'text-orange-500 dark:text-orange-400'}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">{label}</p>
      <p className="text-3xl md:text-4xl font-extrabold">{value}</p>
    </div>
  );
}

export default Dashboard;