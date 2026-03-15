import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import Button from "../../components/ui/Button.jsx";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/forgot-password', { email, role });
      setSuccess('If an account exists, you will receive an OTP.');

      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">

      {/* 1. THE ORANGE HEADER SWEEP */}
      <div
        className="absolute top-0 left-0 w-full h-80 bg-orange-600 z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }}
      />

      {/* 2. THE WATERMARK */}
      <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none">
        <h1 className="text-[20vw] font-black text-slate-200/60 italic tracking-tighter leading-none uppercase">
          RESET
        </h1>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white relative">

          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-6">
              <KeyRound size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic leading-none">
              Recovery<span className="text-orange-500">.</span>
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 leading-relaxed">
              Enter your details to receive a <span className="text-orange-600">Secure OTP</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Type</label>
              <select
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student Account</option>
                <option value="recruiter">Recruiter Account</option>
                <option value="company">Company Account</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registered Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                  required
                />
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full h-16 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-slate-200"
            >
              SEND RESET CODE
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 text-[10px] font-black uppercase tracking-widest transition-all">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;