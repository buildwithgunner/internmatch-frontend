import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, Building2, CheckCircle, AlertCircle, FileDown, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef(null);

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

  const handleExportPDF = async () => {
    const element = dashboardRef.current;
    if (!element) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        onclone: (clonedDoc) => {
          const elements = clonedDoc.getElementsByTagName('*');
          for (const el of elements) {
            const computed = window.getComputedStyle(el);
            const properties = [
              'color',
              'backgroundColor',
              'borderColor',
              'borderTopColor',
              'borderBottomColor',
              'borderLeftColor',
              'borderRightColor',
              'backgroundImage',
              'fill',
              'stroke'
            ];

            properties.forEach(prop => {
              const value = computed[prop];
              if (value && value.includes('oklch')) {
                if (prop === 'backgroundImage') {
                  el.style.backgroundImage = 'none';
                  if (computed.webkitBackgroundClip === 'text' || computed.backgroundClip === 'text') {
                    el.style.color = '#4f46e5';
                    el.style.webkitTextFillColor = '#4f46e5';
                  }
                } else if (prop === 'backgroundColor') {
                  el.style.backgroundColor = 'transparent';
                } else {
                  el.style[prop] = 'currentColor';
                }
              }
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Admin_Dashboard_Summary_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

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
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#f8fafc]" ref={dashboardRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium uppercase text-[10px] tracking-widest">Platform overview and management tools</p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          )}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card bg-white shadow-sm border border-slate-100 rounded-[2rem]">
            <div className="card-body p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-black mt-2 text-slate-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/manage-users" className="card bg-white hover:shadow-xl transition-shadow border border-slate-100 rounded-[2rem]">
          <div className="card-body items-center text-center py-10">
            <Users size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Manage Users</h3>
            <p className="text-slate-500 text-sm mt-2">View, verify, or suspend accounts</p>
          </div>
        </Link>

        <Link to="/admin/manage-postings" className="card bg-white hover:shadow-xl transition-shadow border border-slate-100 rounded-[2rem]">
          <div className="card-body items-center text-center py-10">
            <Briefcase size={48} className="text-secondary mb-4" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Manage Postings</h3>
            <p className="text-slate-500 text-sm mt-2">Review and moderate internship listings</p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card bg-white hover:shadow-xl transition-shadow border border-slate-100 rounded-[2rem]">
          <div className="card-body items-center text-center py-10">
            <FileText size={48} className="text-accent mb-4" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reports</h3>
            <p className="text-slate-500 text-sm mt-2">Analytics and platform insights</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;