import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../services/api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { ShieldAlert, CheckCircle2, ArrowLeft, Lock } from "lucide-react";

const ResetPassword = () => {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || state?.email || "";
    const role = searchParams.get("role") || state?.role || "student";

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) navigate("/forgot-password");
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1].focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => { if (index < 6) newOtp[index] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)].focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        const otpValue = otp.join("");
        if (otpValue.length !== 6) { setError("Enter complete 6-digit OTP."); return; }
        setLoading(true);
        try {
            await api.post("/verify-reset-otp", { email, role, otp: otpValue });
            setStep(2);
            setSuccessMessage("Code verified. Set your new password.");
        } catch (err) { setError(err.response?.data?.message || "Invalid OTP."); }
        finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
        if (password !== passwordConfirmation) { setError("Passwords do not match."); return; }
        setLoading(true);
        try {
            await api.post("/reset-password", { email, role, otp: otp.join(""), password, password_confirmation: passwordConfirmation });
            setSuccessMessage("Success! Redirecting to login...");
            setTimeout(() => navigate(`/login?role=${role}`), 2000);
        } catch (err) { setError(err.response?.data?.message || "Reset failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-80 bg-orange-600 z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }} />
            <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none">
                <h1 className="text-[20vw] font-black text-slate-200/60 italic tracking-tighter leading-none uppercase">SECURE</h1>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white relative">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-6">
                            {step === 1 ? <ShieldAlert size={32} /> : <Lock size={32} />}
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic leading-none">
                            {step === 1 ? "Verify" : "New Pass"}<span className="text-orange-500">.</span>
                        </h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
                            {step === 1 ? `Sent to ${email}` : "Choose a strong password"}
                        </p>
                    </div>

                    {(error || successMessage) && (
                        <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 text-center border-l-4 ${error ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'}`}>
                            {error || successMessage}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-full h-14 text-center text-xl font-black border-2 border-slate-50 bg-slate-50 rounded-xl focus:border-orange-500 focus:bg-white transition-all outline-none"
                                    />
                                ))}
                            </div>
                            <Button type="submit" loading={loading} className="w-full h-16 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl shadow-slate-200">
                                VERIFY CODE
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="rounded-2xl border-slate-50 bg-slate-50 font-bold h-14" />
                            <Input label="Confirm Password" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required placeholder="••••••••" className="rounded-2xl border-slate-50 bg-slate-50 font-bold h-14" />
                            <Button type="submit" loading={loading} className="w-full h-16 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-xs tracking-widest transition-all mt-4">
                                UPDATE PASSWORD
                            </Button>
                        </form>
                    )}

                    <div className="mt-10 text-center border-t border-slate-50 pt-8">
                        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 text-[10px] font-black uppercase tracking-widest transition-all">
                            <ArrowLeft size={14} /> Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;