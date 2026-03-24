import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, MoreVertical, Users, Briefcase, MapPin, 
  Calendar, Pause, Play, Trash2, Zap, 
  Search, ArrowUpRight, CheckCircle2, AlertCircle, 
  ChevronDown, Filter, SortDesc, SortAsc,  XCircle
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

function ManagePostings() {
  const [postings, setPostings] = useState([]);
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, applicants-desc, status
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await api.get('/company/my-internships');
        setPostings(res.data.postings || []);
      } catch (err) {
        setError('Could not load your internship postings.');
      } finally {
        setLoading(false);
      }
    };
    fetchPostings();
  }, []);

  // Filter + Sort logic
  useEffect(() => {
    let result = [...postings];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === 'applicants-desc') {
        return (b.applications_count || 0) - (a.applications_count || 0);
      }
      if (sortBy === 'status') {
        const order = ['active', 'paused', 'closed'];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }
      return 0;
    });

    setFilteredPostings(result);
    setSelectedIds([]); // clear selection on filter/sort change
  }, [postings, searchQuery, statusFilter, sortBy]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPostings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPostings.map(p => p.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const actionText = action === 'pause' ? 'pause' : action === 'resume' ? 'resume' : 'delete';

    const result = await Swal.fire({
      title: `Bulk ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}?`,
      text: `This will ${actionText} ${count} posting${count > 1 ? 's' : ''}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'delete' ? '#ef4444' : '#10b981',
      confirmButtonText: `Yes, ${actionText}`,
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      for (const id of selectedIds) {
        if (action === 'delete') {
          await api.delete(`/internships/${id}`);
        } else {
          const newStatus = action === 'pause' ? 'paused' : 'active';
          await api.put(`/internships/${id}`, { status: newStatus });
        }
      }

      // Refresh list
      const res = await api.get('/company/my-internships');
      setPostings(res.data.postings || []);
      setSelectedIds([]);

      Swal.fire({
        icon: 'success',
        title: 'Bulk Action Complete',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Bulk Action Failed',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    }
  };

  const statusConfig = {
    active: { bg: 'bg-emerald-500/10 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', label: 'Live & Active', icon: <Play size={14} fill="currentColor" /> },
    paused: { bg: 'bg-amber-500/10 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', label: 'On Hold', icon: <Pause size={14} fill="currentColor" /> },
    closed: { bg: 'bg-rose-500/10 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', label: 'Closed', icon: <XCircle size={14} /> },
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const action = newStatus === 'paused' ? 'Pause' : 'Resume';

    const result = await Swal.fire({
      title: `${action} Posting?`,
      text: `This will ${newStatus === 'paused' ? 'hide' : 'reactivate'} the listing for students.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      confirmButtonColor: newStatus === 'paused' ? '#f59e0b' : '#10b981',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/internships/${id}`, { status: newStatus });
      setPostings(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Listing?',
      text: `Are you sure you want to permanently remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Permanently',
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/internships/${id}`);
      setPostings(prev => prev.filter(p => p.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading your postings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
              <CheckCircle2 size={16} /> Active Listings
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Manage <span className="text-orange-600 dark:text-orange-500">Postings</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Control visibility, review applicants, and update your opportunities.
            </p>
          </div>

          <Link
            to="/company/post"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
          >
            <Plus size={20} /> Post New Internship
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              placeholder="Search by title or location..."
              className="w-full pl-14 pr-12 py-4 bg-transparent rounded-2xl border border-slate-300/50 dark:border-slate-600/50 focus:border-orange-500 dark:focus:border-orange-400 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-700 dark:text-slate-300 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-700 dark:text-slate-300 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="applicants-desc">Most Applicants</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-5 shadow-xl flex flex-wrap gap-4 items-center">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              {selectedIds.length} selected
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Pause size={18} /> Pause Selected
              </button>
              <button
                onClick={() => handleBulkAction('resume')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Play size={18} /> Resume Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Postings Grid */}
        {postings.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl p-12 md:p-20 text-center">
            <Briefcase size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              No postings yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Create your first internship opportunity to start attracting talent.
            </p>
            <Link
              to="/company/post"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
            >
              <Plus size={20} /> Create First Posting
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPostings.map(posting => {
              const config = statusConfig[posting.status] || statusConfig.closed;
              const isSelected = selectedIds.includes(posting.id);

              return (
                <div
                  key={posting.id}
                  className={`bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border ${
                    isSelected 
                      ? 'border-orange-500 shadow-2xl shadow-orange-500/30' 
                      : 'border-slate-200/50 dark:border-slate-700/40'
                  } rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative`}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(posting.id)}
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                          {posting.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {posting.location || 'Remote'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(posting.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.text} text-xs font-medium border-current/20`}>
                        {config.icon}
                        {config.label}
                      </div>
                    </div>

                    {/* Applicants */}
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <Users size={20} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {posting.applications_count || 0}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Applicants
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
                      <Link
                        to={`/company/applicants/${posting.id}`}
                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Users size={18} /> View Applicants
                      </Link>

                      <Link
                        to={`/internship/${posting.id}`} // assuming public preview route
                        target="_blank"
                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowUpRight size={18} /> Preview as Student
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(posting.id, posting.status)}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                          posting.status === 'active'
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {posting.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                        {posting.status === 'active' ? 'Pause' : 'Resume'}
                      </button>

                      <button
                        onClick={() => handleDelete(posting.id, posting.title)}
                        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bulk Actions (when items selected) */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl px-8 py-5 flex items-center gap-6 z-50">
            <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {selectedIds.length} selected
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Pause size={18} /> Pause
              </button>
              <button
                onClick={() => handleBulkAction('resume')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Play size={18} /> Resume
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent = 'orange' }) {
  const accentClasses = {
    orange: 'bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300',
    emerald: 'bg-emerald-600/10 dark:bg-emerald-700/20 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-600/10 dark:bg-amber-700/20 text-amber-700 dark:text-amber-300',
  };

  return (
    <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-8 flex items-center gap-5">
        <div className={`p-5 rounded-2xl ${accentClasses[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            {label}
          </p>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManagePostings;