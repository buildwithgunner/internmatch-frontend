import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, User, CheckCircle, XCircle, ExternalLink, Trash2, AlertCircle, ChevronDown, ChevronUp, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../../services/api.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Interviews() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'completed'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPastOpen, setIsPastOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchInterviews = async (reset = false) => {
    if (reset) {
      setPage(1);
      setHasMore(true);
    }

    setLoading(true);

    try {
      const res = await api.get('/company/interviews', {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          status: filter === 'completed' ? 'completed' : undefined,
        },
      });

      const { interviews: newInterviews, total } = res.data;

      if (reset) {
        setUpcoming(filter === 'upcoming' ? newInterviews : []);
        setPast(filter === 'completed' ? newInterviews : []);
      } else {
        if (filter === 'upcoming') {
          setUpcoming(prev => [...prev, ...newInterviews]);
        } else {
          setPast(prev => [...prev, ...newInterviews]);
        }
      }

      setHasMore((page * ITEMS_PER_PAGE) < total);
    } catch (err) {
      console.error('Failed to fetch interviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews(true);
  }, [filter]);

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchInterviews();
  };

  const handleCancel = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancel Interview?',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Please provide a reason...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel',
      inputValidator: (value) => !value && 'You must provide a reason!',
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl'
      }
    });

    if (reason) {
      try {
        await api.post(`/company/interviews/${id}/cancel`, { reason });
        Swal.fire({
          icon: 'success',
          title: 'Cancelled',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
        fetchInterviews(true);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Cancel',
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
      }
    }
  };

  const handleReschedule = async (id) => {
    const { value: formValues } = await Swal.fire({
      title: 'Reschedule Interview',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="New Date (YYYY-MM-DD)" type="date">' +
        '<input id="swal-input2" class="swal2-input" placeholder="New Time (HH:MM)" type="time">',
      focusConfirm: false,
      preConfirm: () => {
        const date = document.getElementById('swal-input1').value;
        const time = document.getElementById('swal-input2').value;
        if (!date || !time) {
          Swal.showValidationMessage('Please enter both date and time');
          return false;
        }
        return { date, time };
      },
      showCancelButton: true,
      confirmButtonText: 'Reschedule',
      customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
    });

    if (formValues) {
      try {
        await api.patch(`/company/interviews/${id}/reschedule`, {
          scheduled_at: `${formValues.date}T${formValues.time}:00`,
        });
        Swal.fire({
          icon: 'success',
          title: 'Rescheduled',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
        fetchInterviews(true);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Reschedule',
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
      }
    }
  };

  const InterviewCard = ({ interview }) => {
    const statusConfig = {
      scheduled: { bg: 'bg-amber-500/10 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', label: 'Scheduled' },
      completed: { bg: 'bg-emerald-500/10 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', label: 'Completed' },
      cancelled: { bg: 'bg-rose-500/10 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', label: 'Cancelled' },
    }[interview.status?.toLowerCase()] || { bg: 'bg-slate-500/10', text: 'text-slate-700 dark:text-slate-300', label: 'Unknown' };

    return (
      <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          {/* Candidate */}
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                {interview.student?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="flex-1">
              <Link
                to={`/company/applicants/${interview.student?.id}`}
                className="font-semibold text-lg text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-500 transition-colors flex items-center gap-2"
              >
                {interview.student?.name || 'Candidate'} <ExternalLink size={14} />
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {interview.student?.email || '—'}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3">
            <Briefcase size={18} className="text-orange-600 dark:text-orange-500" />
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {interview.application?.internship?.title || 'Unknown Role'}
            </p>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-orange-600 dark:text-orange-500" />
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {new Date(interview.scheduled_at).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(interview.scheduled_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3">
            {interview.type === 'video' && <Video size={18} className="text-purple-600 dark:text-purple-400" />}
            {interview.type === 'phone' && <Phone size={18} className="text-blue-600 dark:text-blue-400" />}
            {interview.type === 'in-person' && <MapPin size={18} className="text-rose-600 dark:text-rose-400" />}
            <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
              {interview.type || 'Standard'}
            </span>
          </div>

          {/* Meeting Link */}
          <div className="flex items-center gap-3">
            <ExternalLink size={18} className="text-slate-500 dark:text-slate-400" />
            {interview.meeting_link ? (
              <a
                href={interview.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-500 hover:underline font-medium"
              >
                Join Meeting
              </a>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 italic">No link provided</span>
            )}
          </div>

          {/* Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.bg} ${statusConfig.text} text-sm font-medium border-current/20`}>
            {statusConfig.label}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
            <Link
              to={`/company/interviews/${interview.id}`}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors text-center"
            >
              View Details
            </Link>

            {interview.status === 'scheduled' && (
              <>
                <button
                  onClick={() => handleReschedule(interview.id)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Reschedule
                </button>

                <button
                  onClick={() => handleCancel(interview.id)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
              Interviews <Calendar size={32} className="text-orange-600 dark:text-orange-500" />
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage upcoming, completed, and cancelled interviews.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Upcoming / Completed List */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-200/50 dark:bg-slate-800/40 animate-pulse border border-slate-200/50 dark:border-slate-700/40" />
            ))}
          </div>
        ) : (filter === 'upcoming' ? upcoming : past).length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl p-12 md:p-20 text-center">
            <Calendar size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              No {filter === 'completed' ? 'completed' : 'upcoming'} interviews
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              {filter === 'completed'
                ? 'Completed interviews will appear here once marked as done.'
                : 'Schedule interviews from the Applicants section.'}
            </p>
            <Link
              to="/company/applicants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
            >
              View Applicants <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(filter === 'upcoming' ? upcoming : past).map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center pt-10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-10 py-4 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Collapsible Past/Cancelled Section */}
        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden">
          <button
            onClick={() => setIsPastOpen(!isPastOpen)}
            className="w-full px-8 py-6 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/30 text-left"
          >
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-orange-600 dark:text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Past & Cancelled Interviews ({past.length})
              </h2>
            </div>
            {isPastOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isPastOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {past.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No past or cancelled interviews yet.
              </div>
            ) : (
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {past.map(interview => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interviews;