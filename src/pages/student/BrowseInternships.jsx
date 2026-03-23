import { useState, useEffect, useMemo } from 'react';
import {
  Search, MapPin, Globe, DollarSign, Zap, LayoutGrid,
  ArrowRight, SearchCode, X, Filter, Sparkles, Briefcase
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
    category: 'All',
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

  const resetFilters = () => {
    setFilters({ type: 'All', paid: false, location: '', category: 'All' });
    setSearchQuery('');
  };

  const filteredInternships = useMemo(() => {
    return internships.filter(intern => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        intern.title?.toLowerCase().includes(q) ||
        intern.company?.company_name?.toLowerCase().includes(q);
      const matchesType = filters.type === 'All' || intern.type?.toLowerCase() === filters.type.toLowerCase();
      const matchesCategory = filters.category === 'All' || intern.category === filters.category;
      const matchesPaid = !filters.paid || intern.paid;
      const matchesLocation = !filters.location ||
        intern.location?.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesType && matchesCategory && matchesPaid && matchesLocation;
    });
  }, [searchQuery, filters, internships]);

  if (loading) return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-pulse mt-20">
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[3rem]" />
      <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#080808] transition-colors duration-300">
      {/* Modern Hero Section */}
      <div className="relative bg-[#FF6B00] pt-24 pb-44 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                <Sparkles size={12} /> Live Opportunities
              </div>
              <h1 className="text-5xl md:text-8xl font-[1000] tracking-tighter text-white leading-[0.85] uppercase italic">
                YOUR FUTURE <br /> <span className="text-black/30">STARTS HERE.</span>
              </h1>
            </div>

            <div className="flex gap-4">
              <div className="px-8 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Available Roles</p>
                <p className="text-4xl font-black leading-none">{internships.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-20 space-y-12">

        {/* Responsive Filter Bar */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-[2]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                placeholder="Search roles, skills, or companies..."
                className="w-full pl-16 pr-6 py-5 bg-zinc-100 dark:bg-white/5 rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-[#FF6B00]/20 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row flex-[3] gap-4">
              <div className="relative flex-1">
                <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select
                  className="w-full pl-14 pr-4 py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer border-none focus:ring-2 focus:ring-orange-600/20 transition-all"
                  value={filters.category}
                  onChange={e => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="All">All Categories</option>
                  <optgroup label="Tech & Engineering">
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                  </optgroup>
                  <optgroup label="Business & Finance">
                    <option value="Business Administration">Business Administration</option>
                    <option value="Finance">Finance</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Economics">Economics</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </optgroup>
                  <optgroup label="Creative & Media">
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Fashion Design">Fashion Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Film & Media">Film & Media</option>
                    <option value="Journalism">Journalism</option>
                    <option value="Content Writing">Content Writing</option>
                  </optgroup>
                  <optgroup label="Healthcare & Science">
                    <option value="Medicine">Medicine</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Public Health">Public Health</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Environmental Science">Environmental Science</option>
                  </optgroup>
                  <optgroup label="Law & Social Sciences">
                    <option value="Law">Law</option>
                    <option value="International Relations">International Relations</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Political Science">Political Science</option>
                    <option value="Education">Education</option>
                  </optgroup>
                  <optgroup label="Marketing & Communication">
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Public Relations">Public Relations</option>
                    <option value="Sales">Sales</option>
                    <option value="Event Management">Event Management</option>
                  </optgroup>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative flex-1">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  placeholder="Location..."
                  className="w-full pl-14 pr-4 py-5 bg-zinc-100 dark:bg-white/5 rounded-2xl outline-none font-bold text-sm"
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {['All', 'Remote', 'Onsite', 'Hybrid'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilters({ ...filters, type: t })}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.type === t
                    ? 'bg-[#FF6B00] text-white'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:bg-zinc-200'
                    }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setFilters({ ...filters, paid: !filters.paid })}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${filters.paid
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-transparent bg-zinc-100 dark:bg-white/5 text-zinc-500'
                  }`}
              >
                <DollarSign size={12} className="inline mr-1" />
                {filters.paid ? 'Paid Only' : 'Pay: Any'}
              </button>
            </div>

            {(searchQuery || filters.type !== 'All' || filters.paid || filters.location) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-70"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">
            Available <span className="text-[#FF6B00]">Positions</span>
          </h3>
          <div className="flex-1 h-[2px] bg-zinc-100 dark:bg-white/5" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Showing {filteredInternships.length} Results
          </span>
        </div>

        {/* Internship Grid */}
        {filteredInternships.length === 0 ? (
          <div className="py-32 text-center bg-zinc-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/10">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchCode size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Nothing matching your vibe</h3>
            <p className="text-zinc-500 font-bold max-w-xs mx-auto mt-2">Try clearing your filters or searching for something broader.</p>
            <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-widest">
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map((intern) => (
              <div key={intern.id} className="relative group transition-all duration-500">
                {intern.paid && (
                  <div className="absolute -top-3 left-6 z-30 bg-emerald-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Paid
                  </div>
                )}
                <div className="hover:scale-[1.02] transition-transform duration-300">
                  <InternshipCard internship={intern} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseInternships;