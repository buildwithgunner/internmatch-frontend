import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import Button from "../../components/ui/Button.jsx";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

const OtpVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { verifyOtp } = useAuth();
    
    const email = state?.email || "";
    const role = state?.role || "student";
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [timer, setTimer] = useState(60);

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!state?.email) navigate("/register");
    }, [state, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) interval = setInterval(() => setTimer((p) => p - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
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
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;
        const newOtp = [...otp];
        data.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(data.length, 5)].focus();
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setError(""); setSuccessMessage(""); setIsResending(true);
        try {
            await api.post("/resend-otp", { email, role });
            setSuccessMessage("Code resent successfully!");
            setTimer(60);
        } catch (err) { setError("Failed to resend code."); } 
        finally { setIsResending(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccessMessage("");
        const otpValue = otp.join("");
        if (otpValue.length !== 6) { setError("Enter 6-digit code."); return; }
        setIsLoading(true);
        try {
            const data = await verifyOtp(email, role, otpValue);
            setSuccessMessage("Account verified!");
            setTimeout(() => {
                if (data.role === "student") navigate("/student/dashboard");
                else navigate(`/${data.role}/dashboard`);
            }, 1500);
        } catch (err) { setError(err.response?.data?.message || "Verification failed"); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-80 bg-orange-600 z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }} />
            <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none">
                <h1 className="text-[20vw] font-black text-slate-200/60 italic tracking-tighter leading-none uppercase">VERIFY</h1>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white relative">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic leading-none">Confirm<span className="text-orange-500">.</span></h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 leading-relaxed">Checking identity for <span className="text-slate-900">{email}</span></p>
                    </div>

                    {(error || successMessage) && (
                        <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 text-center border-l-4 ${error ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'}`}>
                            {error || successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="flex justify-between gap-2">
    {otp.map((digit, index) => (
        <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            // Added text-slate-900 for visibility and border-slate-200 for better contrast
            className="w-full h-14 text-center text-2xl font-black border-2 border-slate-200 bg-slate-50 text-slate-900 focus:text-orange-600 focus:border-orange-500 focus:bg-white transition-all outline-none rounded-xl"
        />
    ))}
</div>

                        <div className="space-y-4">
                            <Button type="submit" loading={isLoading} className="w-full h-16 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-xs tracking-widest transition-all">
                                ACTIVATE ACCOUNT
                            </Button>
                            
                            <button type="button" onClick={handleResend} disabled={timer > 0 || isResending} className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 disabled:opacity-50 transition-colors">
                                <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-50 pt-8">
                        <Link to="/register" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">
                            <ArrowLeft size={14} /> Back to Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;