import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_companies: 0,
    total_internships: 0,
    total_applications: 0,
    active_internships: 0,
    pending_verifications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.total_students, icon: Users, color: 'text-blue-600' },
    { title: 'Total Companies', value: stats.total_companies, icon: Building2, color: 'text-purple-600' },
    { title: 'Total Internships', value: stats.total_internships, icon: Briefcase, color: 'text-green-600' },
    { title: 'Total Applications', value: stats.total_applications, icon: FileText, color: 'text-orange-600' },
    { title: 'Active Postings', value: stats.active_internships, icon: CheckCircle, color: 'text-emerald-600' },
    { title: 'Pending Verification', value: stats.pending_verifications, icon: AlertCircle, color: 'text-red-600' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="text-base-content/60 mt-2">Platform overview and management tools</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/60">{stat.title}</p>
                  <p className="text-3xl font-black mt-2">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-base-200 ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/manage-users" className="card bg-base-100 hover:shadow-xl transition-shadow border border-base-200">
          <div className="card-body items-center text-center py-10">
            <Users size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold">Manage Users</h3>
            <p className="text-base-content/60 mt-2">View, verify, or suspend accounts</p>
          </div>
        </Link>

        <Link to="/admin/manage-postings" className="card bg-base-100 hover:shadow-xl transition-shadow border border-base-200">
          <div className="card-body items-center text-center py-10">
            <Briefcase size={48} className="text-secondary mb-4" />
            <h3 className="text-xl font-bold">Manage Postings</h3>
            <p className="text-base-content/60 mt-2">Review and moderate internship listings</p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card bg-base-100 hover:shadow-xl transition-shadow border border-base-200">
          <div className="card-body items-center text-center py-10">
            <FileText size={48} className="text-accent mb-4" />
            <h3 className="text-xl font-bold">Reports</h3>
            <p className="text-base-content/60 mt-2">Analytics and platform insights</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;