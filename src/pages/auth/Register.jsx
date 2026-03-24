import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Check, Sparkles, ChevronDown, RefreshCcw, Globe } from "lucide-react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";

function Register({ restrictedRole }) {
  const [searchParams] = useSearchParams();
  const initialRole = restrictedRole || searchParams.get("role") || "student";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Recruiter Specific State
  const [recruiterType, setRecruiterType] = useState("independent");
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [position, setPosition] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");

  // Captcha & Countries State
  const [countries, setCountries] = useState([]);
  const [captcha, setCaptcha] = useState({ question: "", captchaKey: "" });
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Validation & Strength States
  const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-slate-200", width: "0%" });
  const isMatch = password !== "" && password === passwordConfirmation;
  const isLengthValid = password.length >= 8;

  const role = initialRole;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Strength Logic
  useEffect(() => {
    const evaluateStrength = (pass) => {
      if (!pass) return { label: "", color: "bg-slate-200", width: "0%" };
      let score = 0;
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;

      const levels = [
        { label: "Weak", color: "bg-red-500", width: "25%" },
        { label: "Fair", color: "bg-orange-400", width: "50%" },
        { label: "Good", color: "bg-yellow-500", width: "75%" },
        { label: "Strong", color: "bg-green-500", width: "100%" },
      ];

      return levels[Math.max(0, score - 1)];
    };

    setStrength(evaluateStrength(password));
  }, [password]);

  // Fetch Countries and Captcha
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, captchaRes] = await Promise.all([
          api.get("/countries"),
          api.get("/captcha")
        ]);
        setCountries(countriesRes.data);
        setCaptcha({
          question: captchaRes.data.question,
          captchaKey: captchaRes.data.captcha_key
        });
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchData();
  }, []);

  const refreshCaptcha = async () => {
    try {
      const res = await api.get("/captcha");
      setCaptcha({
        question: res.data.question,
        captchaKey: res.data.captcha_key
      });
      setCaptchaAnswer("");
    } catch (err) {
      console.error("Failed to refresh captcha", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMatch || !isLengthValid) return;

    setLoading(true);
    setError("");

    try {
      const extraData = {};

      if (role === "recruiter") {
        extraData.phone = phone;
        extraData.sector = sector;
        extraData.recruiter_type = recruiterType;
        if (recruiterType === "company") {
          extraData.company_name = companyName;
          extraData.position = position;
          extraData.website = website;
        }
      }

      if (role === "student") {
        extraData.referral_code = referralCode;
      }

      extraData.country = country;
      extraData.captcha_answer = captchaAnswer;
      extraData.captcha_key = captcha.captchaKey;

      const data = await register(name, email, password, role, null, extraData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/otp-verification", { state: { email: data.email, role: data.role }, replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">
      {/* Background Styling */}
      <div
        className="absolute top-0 left-0 w-full h-96 bg-orange-600 z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 100%)' }}
      />

      <div className="w-full max-w-2xl z-10">
        <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white relative">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-orange-500" size={20} />
              <p className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px]">InternMatch Platform</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic">
              Create <span className="text-orange-600">InternMatch</span> Account.
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-4">
              Joining as <span className="text-slate-900 border-b-2 border-orange-500 pb-0.5">{role}</span>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest mb-6 border border-red-100 text-center animate-pulse">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-widest italic">Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Country</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe size={18} />
                  </div>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-12 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all appearance-none"
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Referral Code (Optional)</label>
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Pioneer Link</span>
                  </div>
                  <input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all tracking-[0.2em] uppercase"
                    placeholder="E.G. X8Y2Z9W1"
                    maxLength={10}
                  />
                </div>
              )}

              {role === 'recruiter' && (
                <div className="space-y-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number (Optional)</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Recruiter Type</label>
                      <div className="flex bg-slate-50 rounded-2xl p-1 border-2 border-transparent">
                        <button
                          type="button"
                          onClick={() => setRecruiterType('independent')}
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${recruiterType === 'independent'
                            ? 'bg-white shadow-sm text-orange-600 border border-slate-100'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                          Independent
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecruiterType('company')}
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${recruiterType === 'company'
                            ? 'bg-white shadow-sm text-orange-600 border border-slate-100'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                          Company
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Industry / Sector</label>
                    <div className="relative">
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 pr-12 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all appearance-none"
                        required
                      >
                        <option value="" disabled>Select your industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Marketing & Advertising">Marketing & Advertising</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                        <option value="Media & Entertainment">Media & Entertainment</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {recruiterType === 'company' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Company Name</label>
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                          placeholder="TechCorp"
                          required={recruiterType === 'company'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Position</label>
                        <input
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                          placeholder="HR Manager"
                          required={recruiterType === 'company'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Website (Optional)</label>
                        <input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all"
                          placeholder="company.com"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Password</label>
                    <span className={`text-[9px] font-black uppercase ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all pr-14"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-slate-900 focus:bg-white outline-none font-bold transition-all pr-14 ${isMatch ? 'border-green-200' : 'border-transparent'}`}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Captcha Section */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Security Challenge</label>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-orange-600 hover:text-orange-700 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCcw size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Refresh</span>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-[2] bg-white rounded-2xl border-2 border-slate-200 px-6 py-4 flex items-center justify-center font-black text-lg text-slate-900 italic tracking-tight">
                    {captcha.question || "Loading..."}
                  </div>
                  <div className="flex-1">
                    <input
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-full h-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 focus:border-orange-500 focus:bg-white outline-none font-bold transition-all text-center text-xl"
                      placeholder="Answer"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Validation Indicators */}
              <div className="flex gap-4 px-2">
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${isLengthValid ? 'text-green-500' : 'text-slate-300'}`}>
                  {isLengthValid ? <Check size={12} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />} 8+ Characters
                </div>
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${isMatch ? 'text-green-500' : 'text-slate-300'}`}>
                  {isMatch ? <Check size={12} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />} Passwords Sync
                </div>
              </div>

              {/* FIXED BUTTON COLORS */}
              <Button
                type="submit"
                loading={loading}
                disabled={!isMatch || !isLengthValid}
                className={`w-full py-6 font-black text-lg rounded-2xl shadow-xl transition-all duration-300 active:scale-[0.98] ${isMatch && isLengthValid
                  ? 'bg-orange-600 text-white hover:bg-orange-500 hover:shadow-orange-500/40 hover:-translate-y-1'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                  }`}
              >
                {isMatch && isLengthValid ? 'GET STARTED' : 'COMPLETE FORM'}
              </Button>
            </form>
          )}

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Already have an account? <Link to={`/login?role=${role}`} className="text-orange-600 hover:text-orange-700 transition-colors font-black underline underline-offset-4">Login Here</Link>
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

export default Register;
