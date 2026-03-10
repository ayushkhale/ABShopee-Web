import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost, apiGet } from "../services/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import logolight from "../assets/logolight.png";
import logodark from "../assets/logodark.png";
import {
  FaStore,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaShieldAlt,
  FaCheckCircle,
  FaChartLine,
  FaHeadset,
} from "react-icons/fa";

const color = {
  primary: '#0B77A7',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const saveTokens = (user) => {
  localStorage.setItem("accessToken", user.accessToken);
  localStorage.setItem("refreshToken", user.refreshToken);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userRole", user.role);
};

const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [mode, setMode] = useState("password");

  // Password Login
  const [pwForm, setPwForm] = useState({ identifier: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // OTP Login
  const [otpStep, setOtpStep] = useState(1);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!pwForm.identifier || !pwForm.password) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Email and password are required" });
      return;
    }
    setPwLoading(true);
    try {
      const res = await apiPost("/auth/login", {
        identifier: pwForm.identifier,
        password: pwForm.password,
      });
      if (res.data.success) {
        saveTokens(res.data.data.user);
        toast.current.show({ severity: "success", summary: "Welcome back!", detail: "Redirecting…" });
setTimeout(() => {
  checkBusinessAndRedirect();
}, 800);      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Login Failed",
        detail: err?.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setPwLoading(false);
    }
  };

 
const checkBusinessAndRedirect = async () => {
  try {
    const res = await apiGet("/open/business/info");

    if (res.data.success && res.data.data) {
      // Business exists
      navigate("/dashboard");
    } else {
      // No business found
      navigate("/register-business");
    }
  } catch (error) {
    console.error("Business check failed", error);
    navigate("/register-business");
  }
};

const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otpEmail) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Please enter your email" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await apiPost("/auth/login/otp", { identifier: otpEmail, role: "seller" });
      if (res.data.success || res.data.requestId) {
        setRequestId(res.data.requestId);
        setOtpStep(2);
        toast.current.show({ severity: "info", summary: "OTP Sent", detail: `Check your inbox at ${otpEmail}` });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: err?.response?.data?.message || "Could not send OTP",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Enter 6-digit OTP" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await apiPost("/auth/login/otp/verify", {
        identifier: otpEmail,
        otp: otpCode,
        context: "login",
        requestId,
        role: "seller",
      });
      if (res.data.success) {
        saveTokens(res.data.data.user);
        toast.current.show({ severity: "success", summary: "Verified!", detail: "Redirecting to dashboard…" });
setTimeout(() => {
  checkBusinessAndRedirect();
}, 800);      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Verification Failed",
        detail: err?.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: color.background }}>
      <Toast ref={toast} />

      {/* ── LEFT PANEL — Branding ── */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12"
        style={{ backgroundColor: color.primary }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logolight} alt="AB SHOPEE" className="w-22 h-auto" />
        </div>

        {/* Main copy */}
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Welcome<br />Back!
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Sign in to manage your store, track orders, and grow your business on India's trusted marketplace.
          </p>

          {/* Perks */}
          <div className="space-y-5">
            {[
              { icon: <FaChartLine />,  title: "Live Analytics",      desc: "Real-time orders, revenue & customer insights" },
              { icon: <FaShieldAlt />,  title: "Secure & Encrypted",  desc: "Bank-grade security on every login" },
              { icon: <FaHeadset />,    title: "24/7 Support",        desc: "Dedicated seller support always available" },
            ].map((perk, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{perk.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-white/60 text-sm" />
          <p className="text-white/60 text-xs font-semibold">
            Developed &amp; Maintained by Compunic Pvt. Ltd.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
           <img src={logodark} alt="AB SHOPEE Logo" className="w-22 h-22" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-black mb-1" style={{ color: color.text }}>
                Sign In
              </h1>
              <p className="text-sm text-gray-500">
                Continue to your seller dashboard
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-7">
              {[
                { key: "password", label: "Password",  icon: <FaLock className="text-xs" /> },
                { key: "otp",      label: "OTP Login", icon: <FaKey  className="text-xs" /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setMode(tab.key); setOtpStep(1); setOtpCode(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    mode === tab.key
                      ? "bg-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={mode === tab.key ? { color: color.primary } : {}}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ── PASSWORD LOGIN ── */}
            {mode === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color.primary}15` }}
                    >
                      <FaEnvelope className="text-xs" style={{ color: color.primary }} />
                    </div>
                    <InputText
                      type="email"
                      value={pwForm.identifier}
                      onChange={(e) => setPwForm({ ...pwForm, identifier: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full !pl-14 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-bold hover:underline transition-colors"
                      style={{ color: color.primary }}
                      tabIndex={-1}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color.primary}15` }}
                    >
                      <FaLock className="text-xs" style={{ color: color.primary }} />
                    </div>
                    <InputText
                      type={showPass ? "text" : "password"}
                      value={pwForm.password}
                      onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full !pl-14 !pr-14 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pwLoading}
                  className="w-full text-white py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
                  style={{ backgroundColor: color.primary }}
                >
                  {pwLoading
                    ? <><i className="pi pi-spin pi-spinner" /> Signing In...</>
                    : <>Sign In <FaArrowRight className="text-xs" /></>
                  }
                </button>
              </form>
            )}

            {/* ── OTP LOGIN ── */}
            {mode === "otp" && (
              <div>
                {/* Step 1 — Email */}
                {otpStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div
                      className="flex items-start gap-3 p-4 rounded-2xl border text-xs font-medium"
                      style={{ backgroundColor: `${color.primary}10`, borderColor: `${color.primary}30`, color: color.secondary }}
                    >
                      <FaKey className="mt-0.5 flex-shrink-0" />
                      <span>We'll send a one-time password to your registered email for secure login.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                        Email Address
                      </label>
                      <div className="relative">
                        <div
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${color.primary}15` }}
                        >
                          <FaEnvelope className="text-xs" style={{ color: color.primary }} />
                        </div>
                        <InputText
                          type="email"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full !pl-14 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="w-full text-white py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                      style={{ backgroundColor: color.primary }}
                    >
                      {otpLoading
                        ? <><i className="pi pi-spin pi-spinner" /> Sending...</>
                        : <>Send OTP <FaArrowRight className="text-xs" /></>
                      }
                    </button>
                  </form>
                )}

                {/* Step 2 — Verify OTP */}
                {otpStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* Sent-to banner */}
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                        <FaCheckCircle className="text-emerald-500" />
                        OTP sent to <span className="font-black">{otpEmail}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setOtpStep(1); setOtpCode(""); }}
                        className="text-xs font-bold hover:underline"
                        style={{ color: color.primary }}
                      >
                        Change
                      </button>
                    </div>

                    {/* OTP input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide text-center">
                        Enter 6-Digit OTP
                      </label>
                      <InputText
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full !py-5 !rounded-2xl !bg-gray-50 !border-2 !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-center !text-3xl !font-black !tracking-[1rem]"
                        autoFocus
                      />
                      {otpCode.length === 6 && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <FaCheckCircle className="text-xs" style={{ color: color.primary }} />
                          <span className="text-xs font-semibold" style={{ color: color.primary }}>OTP entered</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Didn't receive the code?{" "}
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="font-bold hover:underline"
                          style={{ color: color.primary }}
                        >
                          Resend OTP
                        </button>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={otpLoading || otpCode.length !== 6}
                      className="w-full text-white py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                      style={{ backgroundColor: color.primary }}
                    >
                      {otpLoading
                        ? <><i className="pi pi-spin pi-spinner" /> Verifying...</>
                        : <>Verify &amp; Sign In <FaArrowRight className="text-xs" /></>
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() => { setOtpStep(1); setOtpCode(""); }}
                      className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      ← Back to email
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">New to AB SHOPEE?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register CTA */}
            <Link to="/register">
              <button
                className="w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ borderColor: color.primary, color: color.primary }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = color.primary;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = color.primary;
                }}
              >
                Create New Account
              </button>
            </Link>
          </div>

          {/* Bottom trust */}
          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: color.primary }}>Terms</span>
            {" "}&amp;{" "}
            <span className="underline cursor-pointer" style={{ color: color.primary }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
