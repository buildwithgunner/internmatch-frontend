import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { ArrowRight, DollarSign, Calendar, MapPin, Building2, Zap } from 'lucide-react';

function InternshipCard({ internship }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(internship.has_applied || false);
  const [applicationId, setApplicationId] = useState(internship.application_id || null);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const company = internship.company || {};
  const companyLogo = company.logo_path 
    ? `http://localhost:8000/storage/${company.logo_path}` 
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

  return (
    <div className="group relative bg-[#1E1F22] rounded-[2.5rem] p-8 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col h-full min-h-[420px]">
      
      {/* --- Header Badges --- */}
      <div className="flex justify-between items-start mb-6">
        <span className="bg-[#5865F2]/10 text-[#5865F2] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#5865F2]/20">
          {internship.type || 'Remote'}
        </span>
        <Zap size={16} className="text-white/10 group-hover:text-[#ff5c00] transition-colors" />
      </div>

      {/* --- Title & Company --- */}
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-black text-white tracking-tighter leading-tight group-hover:text-[#ff5c00] transition-colors">
          {internship.title}
        </h3>
        <div className="flex items-center gap-3 text-white/40 font-bold text-xs uppercase tracking-wider">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
            {companyLogo ? <img src={companyLogo} alt="logo" className="w-full h-full object-cover" /> : <Building2 size={12} />}
          </div>
          <span className="truncate max-w-[120px]">{company.company_name}</span>
          <span className="w-1 h-1 bg-white/10 rounded-full"></span>
          <span className="flex items-center gap-1"><MapPin size={10}/> {internship.location}</span>
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
          <button 
            onClick={hasApplied ? () => navigate('/student/applications') : handleQuickApply}
            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
              hasApplied 
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-default' 
                : 'bg-[#ff5c00] text-white hover:shadow-[0_10px_30px_rgba(255,92,0,0.3)] hover:-translate-y-1'
            }`}
          >
            {hasApplied ? 'ALREADY APPLIED' : <>QUICK APPLY <ArrowRight size={16} /></>}
          </button>
        )}
      </div>
    </div>
  );
}

export default InternshipCard;