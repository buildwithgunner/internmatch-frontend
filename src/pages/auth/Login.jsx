import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from "../../components/ui/Button.jsx";

/**
 * @param {{ restrictedRole?: string | null }} props
 */
function Login({ restrictedRole = null }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const rawRole = restrictedRole || searchParams.get('role') || location.state?.role || 'student';

  // Normalize role (handle plural to singular mismatch)
  const normalizedRole = rawRole.toLowerCase() === 'students' ? 'student' :
    rawRole.toLowerCase() === 'recruiters' ? 'recruiter' :
      rawRole.toLowerCase() === 'companies' ? 'company' :
        rawRole.toLowerCase();

  const [role, setRole] = useState(normalizedRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password, role);
      const userRole = data.role;
      const from = location.state?.from?.pathname ||
        (userRole === 'admin' ? '/admin/dashboard' :
          userRole === 'recruiter' ? '/recruiter/dashboard' :
            userRole === 'company' ? '/company/dashboard' :
              '/student/dashboard');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const roleText = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">

      {/* 1. THE ORANGE HEADER SWEEP */}
      <div
        className="absolute top-0 left-0 w-full h-80 bg-orange-600 z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }}
      />

      {/* 2. THE WATERMARK (Matches Register page) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none">
        <h1 className="text-[25vw] font-black text-slate-200/60 italic tracking-tighter leading-none uppercase">
          LOGIN
        </h1>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white relative">

          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-6">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic leading-none">
              Welcome<span className="text-orange-500">.</span>
            </h2>

            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
              Secure access for <span className="text-orange-600 underline decoration-orange-200 underline-offset-4">{roleText}s</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <Link to="/forgot-password" size="sm" className="text-orange-600 hover:text-orange-700 text-[10px] font-black uppercase tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 bottom-4 text-slate-300 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full h-16 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-slate-200"
            >
              LOG INTO ACCOUNT
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Don't have an account? <Link to={`/register?role=${role}`} className="text-orange-600 hover:underline">Register Now</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;