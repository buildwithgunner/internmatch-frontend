import { useState, useEffect, useMemo } from 'react';
import {
  Briefcase, Building2, Calendar, XCircle,
  ExternalLink, Clock, CheckCircle2, AlertCircle,
  Inbox, MapPin, DollarSign, ArrowRight, Search,
  ShieldCheck, Zap, MoreHorizontal, Filter, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Swal from 'sweetalert2';
import Button from "../../components/ui/Button.jsx";

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data.applications || []);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        app.internship?.title?.toLowerCase().includes(q) ||
        app.internship?.company?.company_name?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleCancel = async (applicationId) => {
    const result = await Swal.fire({
      title: 'Withdraw Application?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Withdraw',
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden',
        confirmButton: 'px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all',
        cancelButton: 'px-8 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-semibold transition-all'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/applications/${applicationId}`);
        setApplications(prev => prev.filter(a => a.id !== applicationId));
        Swal.fire({ icon: 'success', title: 'Withdrawn', timer: 1500, showConfirmButton: false });
      } catch {
        Swal.fire('Error', 'Failed to withdraw.', 'error');
      }
    }
  };

  const handleViewDetails = (internship) => {
    if (!internship) return;
    Swal.fire({
      width: '800px',
      padding: '0',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      buttonsStyling: false,
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden',
        confirmButton: 'px-12 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-semibold hover:scale-105 transition-all m-6'
      },
      html: `
        <div class="text-left p-10 pb-6 dark:text-slate-100">
          <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">${internship.title}</h2>
          <p class="text-orange-600 dark:text-orange-400 font-bold text-xl mb-8">${internship.recruiter?.name ? internship.recruiter.name + (internship.recruiter.company_name ? ' • ' + internship.recruiter.company_name : '') : (internship.company?.company_name || 'Independent Recruiter')}</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div class="p-5 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/40">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Location</p>
              <p class="font-semibold">${internship.location || 'Remote'}</p>
            </div>
            <div class="p-5 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/40">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Stipend</p>
              <p class="font-semibold">${internship.paid ? (internship.stipend || 'Paid') : 'Unpaid'}</p>
            </div>
            <div class="p-5 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/40">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Type</p>
              <p class="font-semibold">${internship.type || 'Standard'}</p>
            </div>
          </div>
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Description</h4>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${internship.description || 'No description available.'}</p>
            </div>
          </div>
        </div>`
    });
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: <Inbox size={20} />, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'In Review', value: applications.filter(a => a.status?.toLowerCase() === 'pending').length, icon: <Clock size={20} />, color: 'text-amber-500' },
    { label: 'Interviews / Offers', value: applications.filter(a => ['interview', 'offered'].includes(a.status?.toLowerCase() || '')).length, icon: <ShieldCheck size={20} />, color: 'text-emerald-500' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your applications...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 pb-16 space-y-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header + Stats */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-full border border-slate-200/50 dark:border-slate-700/40 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              <Zap size={14} /> Application Pipeline
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Your <span className="text-orange-600 dark:text-orange-500">Applications</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Track progress, manage responses, and stay organized.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl backdrop-blur-xl border transition-all hover:-translate-y-1 hover:shadow-xl duration-300 ${i === 0
                    ? 'bg-orange-600/10 dark:bg-orange-800/20 border-orange-500/30 dark:border-orange-600/30 text-orange-800 dark:text-orange-200'
                    : 'bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/40 text-slate-900 dark:text-slate-100'
                  }`}
              >
                <div className={`flex items-center gap-3 mb-3 ${stat.color}`}>
                  {stat.icon}
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{stat.label}</p>
                </div>
                <p className="text-3xl font-extrabold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-4 shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              placeholder="Search roles or companies..."
              className="w-full pl-14 pr-12 py-4 bg-transparent rounded-2xl outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300/50 dark:border-slate-600/50 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full transition-colors">
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {['all', 'pending', 'interview', 'offered', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all backdrop-blur-xl border ${statusFilter === s
                    ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20 dark:bg-orange-700 dark:border-orange-700 dark:shadow-orange-700/20'
                    : 'bg-white/40 dark:bg-slate-800/40 border-slate-300/50 dark:border-slate-600/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 text-slate-700 dark:text-slate-300'
                  }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-6 bg-red-500/10 dark:bg-red-900/20 border border-red-500/30 dark:border-red-600/30 rounded-2xl text-red-700 dark:text-red-300">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="py-24 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl flex items-center justify-center rotate-6">
                <Inbox size={40} className="opacity-40 -rotate-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300">No applications found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Adjust filters or explore new opportunities.</p>
              </div>
              <Button
                onClick={() => navigate('/student/browse')}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
              >
                Browse Opportunities
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map(app => (
              <div
                key={app.id}
                className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-orange-600/20 dark:bg-orange-700/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                        <Briefcase size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {app.internship?.title || 'Role'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span>{app.internship?.recruiter?.name ? app.internship.recruiter.name + (app.internship.recruiter.company_name ? ' • ' + app.internship.recruiter.company_name : '') : (app.internship?.company?.company_name || 'Independent')}</span>
                          <span>•</span>
                          <span>{app.internship?.location || 'Remote'}</span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={app.status || 'pending'} />
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/40 grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Applied</p>
                      <p className="font-medium">
                        {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex justify-end items-end gap-3">
                      <button
                        onClick={() => handleViewDetails(app.internship)}
                        className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                      >
                        View Details <ArrowRight size={16} />
                      </button>

                      {app.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancel(app.id)}
                          className="px-5 py-2 bg-red-500/10 dark:bg-red-900/20 border border-red-500/30 dark:border-red-600/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/20 dark:hover:bg-red-900/30 transition-colors font-medium"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    pending: { bg: 'bg-amber-500/10 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', label: 'In Review', pulse: true },
    reviewed: { bg: 'bg-blue-500/10 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', label: 'Shortlisted' },
    interview: { bg: 'bg-purple-500/10 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', label: 'Interviewing' },
    offered: { bg: 'bg-emerald-500/10 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', label: 'Offer' },
    rejected: { bg: 'bg-rose-500/10 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', label: 'Not Selected' },
  };

  const config = configs[status.toLowerCase()] || configs.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${config.bg} ${config.text} text-xs font-semibold uppercase tracking-wide border-current/20`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''} shadow-md shadow-current/30`} />
      {config.label}
    </div>
  );
}

export default Applications;