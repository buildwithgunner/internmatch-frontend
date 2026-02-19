import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Search, Mail, MoreVertical, CheckCircle, XCircle, Clock, UserCheck, User, Link as LinkIcon, 
  Briefcase, Calendar, Filter, Users, Hourglass, CheckSquare, Sparkles, ExternalLink, 
  ChevronRight, Github, Linkedin, ArrowRight 
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

function ViewApplicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const internshipsRes = await api.get('/company/my-internships');
        const myInternships = internshipsRes.data.postings || [];
        if (myInternships.length === 0) {
          setLoading(false);
          return;
        }

        const appsPromises = myInternships.map(intern => 
          api.get(`/internships/${intern.id}/applications`)
            .catch(() => ({ data: { applications: [] } }))
        );

        const results = await Promise.all(appsPromises);
        const allApps = results.flatMap((res, index) => {
          const applications = res.data.applications || [];
          return applications.map(app => ({
            ...app,
            internshipTitle: myInternships[index].title,
            internshipId: myInternships[index].id,
          }));
        });

        setApplicants(allApps);
        setFilteredApplicants(allApps);
      } catch (err) {
        console.error('Failed to load applicants', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  useEffect(() => {
    let result = applicants;

    if (statusFilter !== 'All') {
      result = result.filter(app => app.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.student?.name?.toLowerCase().includes(q) ||
        app.internshipTitle?.toLowerCase().includes(q)
      );
    }

    setFilteredApplicants(result);
  }, [searchTerm, statusFilter, applicants]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    const result = await Swal.fire({
      title: `Move to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}?`,
      text: "This will notify the student of their application progress.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#ea580c',
      customClass: {
        popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    }
  };

  const handleViewProfile = async (studentId) => {
    setProfileLoading(true);
    setSelectedApplicant(null);

    try {
      const res = await api.get(`/student/profile/${studentId}`);
      setSelectedApplicant(res.data.student);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Profile',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const stats = [
    { label: 'Total Pipeline', value: applicants.length, icon: <Users size={20} />, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Pending', value: applicants.filter(a => a.status === 'pending').length, icon: <Hourglass size={20} />, color: 'text-amber-500' },
    { label: 'Interviews', value: applicants.filter(a => a.status === 'interview').length, icon: <UserCheck size={20} />, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Hired', value: applicants.filter(a => a.status === 'accepted').length, icon: <CheckSquare size={20} />, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
              <Sparkles size={14} /> Talent Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Applicant <span className="text-orange-600 dark:text-orange-500">Pipeline</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Review, shortlist, and move candidates through your hiring process.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
              <input
                placeholder="Search name or role..."
                className="w-full pl-14 pr-12 py-4 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full">
                  <XCircle size={16} className="text-slate-500 dark:text-slate-400" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-6 py-4 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl text-slate-700 dark:text-slate-300 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-center gap-5"
            >
              <div className={`p-4 rounded-2xl ${stat.color === 'text-orange-600 dark:text-orange-400' ? 'bg-orange-600/10 dark:bg-orange-700/20' : stat.color.replace('text-', 'bg-').replace('-500', '-500/10 dark:bg-') + '/20 dark:bg-' + stat.color.replace('text-', '').replace('-500', '-900/20')}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading applicants...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl p-12 md:p-20 text-center">
            <Users size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              No applicants match your filters
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Try adjusting search or status filters, or check back later.
            </p>
            <Link
              to="/company/applicants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApplicants.map(app => (
              <div
                key={app.id}
                className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 md:p-8 space-y-6">
                  {/* Candidate */}
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xl">
                        {app.student?.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                        {app.student?.name || 'Applicant'}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Mail size={14} /> {app.student?.email || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-orange-600 dark:text-orange-500" />
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {app.internshipTitle || 'Role'}
                    </p>
                  </div>

                  {/* Applied Date */}
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-orange-600 dark:text-orange-500" />
                    <p className="text-slate-700 dark:text-slate-300">
                      Applied {new Date(app.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium">
                    {app.status === 'pending' && <Clock size={14} />}
                    {app.status === 'accepted' && <CheckCircle size={14} />}
                    {app.status === 'rejected' && <XCircle size={14} />}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
                    <button
                      onClick={() => handleViewProfile(app.student.id)}
                      className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <User size={18} /> View Profile
                    </button>

                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <MoreVertical size={18} /> Actions
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[20] menu p-3 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl w-64 border border-slate-200/50 dark:border-slate-700/40 mt-2 space-y-1">
                        <li>
                          <button onClick={() => handleStatusUpdate(app.id, 'reviewed')} className="py-3 font-medium flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                            <Clock size={18} className="text-blue-600" /> Mark Reviewed
                          </button>
                        </li>
                        <li>
                          <button onClick={() => navigate(`/company/schedule-interview/${app.id}`, { state: { studentId: app.student.id, studentName: app.student.name } })} className="py-3 font-medium flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                            <UserCheck size={18} className="text-purple-600" /> Schedule Interview
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="py-3 font-medium flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-emerald-600">
                            <CheckCircle size={18} /> Issue Offer
                          </button>
                        </li>
                        <div className="divider my-1 opacity-50"></div>
                        <li>
                          <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="py-3 font-medium flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-rose-600">
                            <XCircle size={18} /> Decline
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applicant Profile Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/40 px-8 py-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <User size={28} className="text-orange-600 dark:text-orange-500" />
                  Candidate Profile
                </h2>
                <button 
                  onClick={() => setSelectedApplicant(null)}
                  className="p-3 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full transition-colors"
                >
                  <XCircle size={24} className="text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="p-8 md:p-12 space-y-10">
                {/* Basic Info */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="avatar placeholder">
                    <div className="w-32 h-32 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-5xl font-bold shadow-xl">
                      {selectedApplicant.name?.charAt(0) || '?'}
                    </div>
                  </div>
                  <div className="text-center md:text-left space-y-3">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {selectedApplicant.name}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center md:justify-start">
                      <Mail size={18} /> {selectedApplicant.email}
                    </p>
                    {selectedApplicant.linkedin && (
                      <a
                        href={selectedApplicant.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-500 hover:underline"
                      >
                        <Linkedin size={18} /> LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Bio & Skills */}
                {selectedApplicant.bio && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText size={20} className="text-orange-600 dark:text-orange-500" /> About
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedApplicant.bio}
                    </p>
                  </div>
                )}

                {selectedApplicant.skills && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Zap size={20} className="text-orange-600 dark:text-orange-500" /> Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.split(',').map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-xl border border-orange-200/50 dark:border-orange-700/30 text-sm font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedApplicant.documents?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText size={20} className="text-orange-600 dark:text-orange-500" /> Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApplicant.documents.map(doc => (
                        <a
                          key={doc.id}
                          href={`http://localhost:8000/storage/${doc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border border-slate-200/50 dark:border-slate-700/40"
                        >
                          <div className="flex items-center gap-4">
                            <FileText size={24} className="text-orange-600 dark:text-orange-500" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                                {doc.original_name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                                {doc.type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <ExternalLink size={18} className="text-slate-400 dark:text-slate-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/40 flex flex-wrap gap-4 justify-center md:justify-end">
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="px-8 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-semibold transition-all"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedApplicant.email}`}
                    className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2"
                  >
                    <Mail size={18} /> Contact Candidate
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplicants;