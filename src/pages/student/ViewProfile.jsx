import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, Linkedin, FileText,
  ExternalLink, Edit, AlertCircle, Sparkles,
  ShieldCheck, Zap
} from 'lucide-react';
import api from '../../services/api.js';

function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        setProfile(res.data.student);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 dark:bg-slate-950/70">
        <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
        <p className="mt-6 text-lg font-medium text-slate-500 dark:text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 p-6">
        <AlertCircle className="h-20 w-20 text-rose-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Profile not loaded</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
          Something went wrong. Please try again or contact support.
        </p>
      </div>
    );
  }

  const skills = profile.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-700 to-orange-600 pt-20 pb-32 px-5 md:px-8 overflow-hidden shadow-2xl shadow-orange-600/20">
        <div className="absolute inset-0 backdrop-blur-2xl bg-black/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl flex-shrink-0 bg-white/20 backdrop-blur-sm">
                {profile.avatar ? (
                  <img
                    src={`http://localhost:8000/storage/${profile.avatar}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold bg-gradient-to-br from-orange-500 to-rose-600">
                    {profile.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-xl rounded-full text-white text-sm font-semibold mb-4 border border-white/20">
                  <Sparkles size={16} /> Student Profile
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                  {profile.name}
                </h1>
                {profile.headline && (
                  <p className="mt-3 text-xl md:text-2xl text-orange-100/90 font-medium">
                    {profile.headline}
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/student/profile/edit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-700 font-semibold rounded-2xl hover:bg-orange-50 transition-all shadow-lg"
            >
              <Edit size={20} /> Edit Profile
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl text-white border border-white/20">
              <Mail size={18} /> {profile.email}
            </div>
            {profile.phone && (
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl text-white border border-white/20">
                <Phone size={18} /> {profile.phone}
              </div>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0a66c2]/80 backdrop-blur-xl px-6 py-3 rounded-2xl text-white border border-white/20 hover:bg-[#0a66c2] transition-all"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-20 relative z-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Left - Bio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="text-orange-600 dark:text-orange-500" size={28} /> About Me
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                {profile.bio || "Your story goes here — what drives you, your experience, and your career aspirations."}
              </p>
            </div>

            {skills.length > 0 && (
              <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-8 md:p-10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Zap className="text-orange-600 dark:text-orange-500" size={28} /> Key Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-5 py-2.5 bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 font-medium rounded-xl border border-orange-200/50 dark:border-orange-700/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Documents */}
          <div className="space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-orange-600/10 dark:bg-orange-700/20 rounded-2xl">
                  <ShieldCheck size={28} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Documents</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Securely stored & visible to recruiters</p>
                </div>
              </div>

              {profile.documents?.length > 0 ? (
                <div className="space-y-4">
                  {profile.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={`http://localhost:8000/storage/${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group border border-slate-200/50 dark:border-slate-700/40"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <FileText className="text-orange-600 dark:text-orange-500" size={24} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {doc.original_name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                            {doc.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic text-center py-8">
                  No documents uploaded yet.
                </p>
              )}

              {!profile.is_profile_complete && (
                <div className="mt-6 p-6 bg-rose-50/70 dark:bg-rose-950/30 backdrop-blur-xl border border-rose-200/50 dark:border-rose-800/40 rounded-2xl text-rose-700 dark:text-rose-300">
                  <AlertCircle className="inline mr-2" size={18} />
                  Profile is incomplete — recruiters may see a limited version.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;