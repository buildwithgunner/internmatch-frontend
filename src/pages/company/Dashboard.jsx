import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Calendar, Eye, Plus, LogOut, ArrowRight, Users, Zap} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import InterviewList from '../../components/company/InterviewList';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplicants: 0,
    interviews: 0,
    profileViews: 0,
  });

  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/company/dashboard-stats');
        setStats(res.data.stats || {});
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.company_name || 'Company'} 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Here's a quick overview of your recruitment activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/company/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
            >
              <Plus size={20} /> Post New Internship
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-slate-200/50 dark:bg-slate-800/40 animate-pulse border border-slate-200/50 dark:border-slate-700/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Active Postings" 
              value={stats.activePostings} 
              icon={<Briefcase size={28} />} 
              accent="orange" 
            />
            <StatCard 
              title="Total Applicants" 
              value={stats.totalApplicants} 
              icon={<Users size={28} />} 
              accent="emerald" 
            />
            <StatCard 
              title="Scheduled Interviews" 
              value={stats.interviews} 
              icon={<Calendar size={28} />} 
              accent="purple" 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Column - Interviews */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/40 bg-slate-50/70 dark:bg-slate-800/30">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Calendar size={28} className="text-orange-600 dark:text-orange-500" />
                  Recent & Upcoming Interviews
                </h2>
              </div>
              <div className="p-6 md:p-8">
                <InterviewList />
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Zap size={24} className="text-orange-600 dark:text-orange-500" />
              Quick Actions
            </h2>

            <div className="space-y-4">
              <Link
                to="/company/manage-postings"
                className="flex items-center gap-5 p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-4 bg-orange-600/10 dark:bg-orange-700/20 rounded-2xl text-orange-600 dark:text-orange-400">
                  <Briefcase size={24} />
                </div>
                <div>
                  <div className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                    Manage Postings
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Edit, pause or close roles
                  </div>
                </div>
              </Link>

              <Link
                to="/company/applicants"
                className="flex items-center gap-5 p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-4 bg-emerald-600/10 dark:bg-emerald-700/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <Users size={24} />
                </div>
                <div>
                  <div className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                    View Applicants
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Review and shortlist talent
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, accent = 'orange' }) {
  const accentClasses = {
    orange: 'bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300',
    emerald: 'bg-emerald-600/10 dark:bg-emerald-700/20 text-emerald-700 dark:text-emerald-300',
    purple: 'bg-purple-600/10 dark:bg-purple-700/20 text-purple-700 dark:text-purple-300',
  };

  return (
    <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-8 flex items-center gap-5">
        <div className={`p-5 rounded-2xl ${accentClasses[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;