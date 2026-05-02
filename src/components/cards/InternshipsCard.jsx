import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { ArrowRight, DollarSign, Calendar, MapPin, Building2, Zap, CheckCircle, Flag, Bookmark } from 'lucide-react';

function InternshipCard({ internship }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(internship.has_applied || false);
  const [applicationId, setApplicationId] = useState(internship.application_id || null);
  const [isSaved, setIsSaved] = useState(internship.is_saved || false);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const company = internship.company || {};
  const companyLogo = company.logo_path
    ? `https://internmatch-backend-api.up.railway.app/storage/${company.logo_path}`
    : null;

  const handleQuickApply = () => {
    if (role === 'student' && !user?.is_profile_complete) {
      Swal.fire({
        title: '<span class="font-black uppercase tracking-tighter">Profile Incomplete</span>',
        text: 'You need to finish your profile before applying.',
        icon: 'warning',
        confirmButtonText: 'Finish Profile',
        confirmButtonColor: '#ff5c00',
        customClass: { popup: 'rounded-[2rem]' }
      }).then((result) => {
        if (result.isConfirmed) navigate('/student/profile/edit');
      });
      return;
    }
    setIsApplying(true);
  };

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      setError('Say something briefly about why you are a fit.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/internships/${internship.id}/apply`, {
        cover_letter_text: coverLetter.trim(),
        document_types: ['resume'],
      });
      setHasApplied(true);
      setApplicationId(res.data.application?.id || null);
      setIsApplying(false);
      Swal.fire({ icon: 'success', title: 'Applied!', showConfirmButton: false, timer: 1500 });
    } catch (err) {
      setError('Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    Swal.fire({
      title: 'Report Internship',
      text: 'Please provide a reason for reporting this internship. False reporting may result in your account being banned.',
      input: 'textarea',
      inputPlaceholder: 'Why are you reporting this?',
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      preConfirm: (reason) => {
        if (!reason || reason.trim().length < 10) {
          Swal.showValidationMessage('Please provide a descriptive reason (at least 10 characters)');
        }
        return reason;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`/internships/${internship.id}/report`, { reason: result.value });
          Swal.fire('Reported', 'Thank you. Admin will review this.', 'success');
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to report', 'error');
        }
      }
    });
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (role !== 'student') return;
    try {
      const res = await api.post(`/internships/${internship.id}/save`);
      setIsSaved(res.data.is_saved);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
        background: '#1E1F22',
        color: '#fff'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getTrustBadgeColor = (level) => {
    switch (level) {
      case 'Trusted Recruiter': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Verified': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Moderate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Risky': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="group relative bg-[#1E1F22] rounded-[2.5rem] p-8 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col h-full min-h-[420px]">

      {/* --- Header Badges --- */}
      <div className="flex justify-between items-start mb-6">
        <span className="bg-[#5865F2]/10 text-[#5865F2] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#5865F2]/20">
          {internship.type || 'Remote'}
        </span>
        <div className="flex items-center gap-3">
          {role === 'student' && (
            <button
              onClick={handleSave}
              className={`transition-all duration-300 ${isSaved ? 'text-orange-500' : 'text-white/20 hover:text-white/60'}`}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}
          <Zap size={16} className="text-white/10 group-hover:text-[#ff5c00] transition-colors" />
        </div>
      </div>

      {/* --- Title & Company --- */}
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-black text-white tracking-tighter leading-tight group-hover:text-[#ff5c00] transition-colors">
          {internship.title}
        </h3>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center flex-wrap gap-2 text-white/60 font-medium text-xs">
            {internship.recruiter?.name ? (
              <>
                <span>{internship.recruiter.name}</span>
                {internship.recruiter.is_verified && <CheckCircle size={12} className="text-blue-400" />}
                {internship.recruiter.position && <span className="text-white/30">• {internship.recruiter.position}</span>}
                <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black border tracking-wider ml-1 ${getTrustBadgeColor(internship.recruiter.trust_level)}`}>
                  {internship.recruiter.trust_level || 'New'} ({internship.recruiter.trust_score || 0})
                </span>
              </>
            ) : (
              <span>Recruiter</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-white/40 font-bold text-xs uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
              {companyLogo ? <img src={companyLogo} alt="logo" className="w-full h-full object-cover" /> : <Building2 size={12} />}
            </div>
            <span className="truncate max-w-[120px]">{company.company_name || internship.company?.company_name || 'Independent'}</span>
            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
            <span className="flex items-center gap-1"><MapPin size={10} /> {internship.location}</span>
          </div>
        </div>
      </div>

      {/* --- Metadata Pills --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {internship.paid && (
          <div className="flex items-center gap-1 bg-[#00C896]/10 text-[#00C896] text-[9px] font-black px-3 py-1.5 rounded-xl border border-[#00C896]/20">
            PAID
          </div>
        )}
        <div className="bg-white/5 text-white/60 text-[9px] font-black px-3 py-1.5 rounded-xl border border-white/10 uppercase">
          #{internship.stipend || 'Competitive'}
        </div>
      </div>

      {/* --- Description --- */}
      <p className="text-white/40 text-sm leading-relaxed font-medium mb-8 line-clamp-3 group-hover:text-white/60 transition-colors">
        {internship.description || 'Gain real-world experience in a fast-paced environment with industry leaders.'}
      </p>

      {/* --- Footer & Action --- */}
      <div className="mt-auto pt-6 border-t border-white/5">
        {isApplying ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <textarea
              className="textarea bg-[#0B0C0E] border-white/10 text-white w-full h-24 rounded-2xl focus:ring-1 ring-[#ff5c00] transition-all text-xs font-bold"
              placeholder="Why you?"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setIsApplying(false)} className="btn btn-ghost btn-sm text-white/30 font-black text-[10px]">CANCEL</button>
              <button onClick={handleSubmit} disabled={loading} className="btn bg-[#ff5c00] hover:bg-[#e65200] border-none btn-sm flex-1 text-white font-black text-[10px]">
                {loading ? 'SENDING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={hasApplied ? () => navigate('/student/applications') : handleQuickApply}
              className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${hasApplied
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-default'
                : 'bg-[#ff5c00] text-white hover:shadow-[0_10px_30px_rgba(255,92,0,0.3)] hover:-translate-y-1'
                }`}
            >
              {hasApplied ? 'ALREADY APPLIED' : <>QUICK APPLY <ArrowRight size={16} /></>}
            </button>
            {role === 'student' && (
              <button
                onClick={handleReport}
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                title="Report Internship"
              >
                <Flag size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipCard;