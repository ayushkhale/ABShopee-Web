import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../services/api";
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
  FaCheckCircle,
  FaShieldAlt,
  FaRocket,
  FaUsers,
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

const getPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, passed, total: 5 };
};

const Register = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestId, setRequestId] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.current.show({ severity: "warn", summary: "Required", detail: "Please enter your email" });
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost("/auth/signup", { identifier: email, role: "seller" });
      if (res.data.success) {
        setRequestId(res.data.requestId);
        setStep(2);
        toast.current.show({ severity: "success", summary: "OTP Sent", detail: `Check your inbox: ${email}` });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: err?.response?.data?.message || "Could not initiate signup",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.current.show({ severity: "warn", summary: "Invalid OTP", detail: "Enter the 6-digit code" });
      return;
    }
    if (strength.passed < 5 || password !== confirmPassword) {
      toast.current.show({ severity: "warn", summary: "Check Password", detail: "Ensure password requirements are met" });
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost("/auth/signup/verify", {
        identifier: email,
        otp,
        context: "registration",
        password,
        role: "seller",
        requestId,
      });
      if (res.data.success) {
        saveTokens(res.data.data.user);
        toast.current.show({ severity: "success", summary: "Account Created!", detail: "Welcome to AB SHOPEE" });
setTimeout(() => navigate("/register-business"), 1000);
      }
    } catch (err) {
         const errorCode = err?.response?.data?.errorCode;

   if (errorCode === "ALREADY_REGISTERED") {
      navigate("/login", { state: { email } });
      return;
   }

      toast.current.show({
        severity: "error",
        summary: "Verification Failed",
        detail: err?.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const strengthConfig = [
    { color: '#ef4444', label: 'Very Weak' },
    { color: '#f97316', label: 'Weak' },
    { color: '#eab308', label: 'Fair' },
    { color: '#22c55e', label: 'Strong' },
    { color: '#16a34a', label: 'Very Strong' },
  ];

  const passwordChecks = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'upper', label: 'One uppercase letter' },
    { key: 'lower', label: 'One lowercase letter' },
    { key: 'number', label: 'One number' },
    { key: 'special', label: 'One special character' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: color.background }}>
      <Toast ref={toast} />

      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12" style={{ backgroundColor: color.primary }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logolight} alt="" className="w-22 h-22" />
        </div>

        {/* Main copy */}
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Start Selling<br />in Minutes
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Join thousands of sellers growing their business on India's trusted marketplace.
          </p>

          {/* Perks */}
          <div className="space-y-5">
            {[
              { icon: <FaRocket />, title: "Quick Setup", desc: "Get your store live in under 5 minutes" },
              { icon: <FaShieldAlt />, title: "Secure Payments", desc: "Razorpay integrated, fully automated" },
              { icon: <FaUsers />, title: "2M+ Customers Can Be Added", desc: "Access to our growing customer base" },
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

        {/* Footer trust */}

        <div className="flex-col gap-50">
          {/* <div className="flex items-center gap-2">
            <FaCheckCircle className="text-white/60 text-sm" />
            <p className="text-white/60 text-xs font-semibold text-center">
              AB Shopee All Rights Reserved
            </p>
          </div> */}

          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-white/60 text-sm" />
            <p className="text-white/60 text-xs font-semibold">
              Developed & Mainatined By Compunic Pvt. Ltd.
            </p>
          </div>
        </div>

      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <img src={logodark} alt="AB SHOPEE Logo" className="w-22 h-22" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            {[
              { num: 1, label: 'Email' },
              { num: 2, label: 'Verify' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      backgroundColor: step >= s.num ? color.primary : '#E5E7EB',
                      color: step >= s.num ? '#fff' : '#9CA3AF'
                    }}
                  >
                    {step > s.num ? <FaCheckCircle /> : s.num}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: step >= s.num ? color.primary : '#9CA3AF' }}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div className="flex-1 h-1 rounded-full mx-2 transition-all"
                    style={{ backgroundColor: step > s.num ? color.primary : '#E5E7EB' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black mb-1" style={{ color: color.text }}>
                    Create Account
                  </h1>
                  <p className="text-sm text-gray-500">
                    Enter your email to get started with AB SHOPEE
                  </p>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    Business Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                      <FaEnvelope className="text-xs" style={{ color: color.primary }} />
                    </div>
                    <InputText
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full !pl-14 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                      autoFocus
                    />
                  </div>
                </div>

             
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ backgroundColor: color.primary }}
                >
                  {loading
                    ? <><i className="pi pi-spin pi-spinner" /> Sending...</>
                    : <>Send Verification Code <FaArrowRight /></>
                  }
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP + Password ── */}
            {step === 2 && (
              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                <div>
                  <h1 className="text-2xl font-black mb-1" style={{ color: color.text }}>
                    Verify & Set Password
                  </h1>
                  <p className="text-sm text-gray-500">
                    Code sent to <span className="font-bold" style={{ color: color.primary }}>{email}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    6-Digit OTP
                  </label>
                  <InputText
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    placeholder="• • • • • •"
                    className="w-full !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-center !text-2xl !font-black !tracking-[0.5em]"
                    autoFocus
                  />
                  {otp.length === 6 && (
                    <div className="flex items-center gap-2 mt-2">
                      <FaCheckCircle className="text-blue-500 text-xs" />
                      <span className="text-xs font-semibold text-blue-600">OTP entered</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    Set Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                      <FaLock className="text-xs" style={{ color: color.primary }} />
                    </div>
                    <InputText
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full !pl-14 !pr-12 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {password.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all"
                            style={{
                              backgroundColor: i < strength.passed
                                ? strengthConfig[strength.passed - 1].color
                                : '#E5E7EB'
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: strength.passed > 0 ? strengthConfig[strength.passed - 1].color : '#9CA3AF' }}>
                          {strength.passed > 0 ? strengthConfig[strength.passed - 1].label : ''}
                        </span>
                        <span className="text-xs text-gray-400">{strength.passed}/5 checks</span>
                      </div>

                      {/* Checks list */}
                      <div className="grid grid-cols-1 gap-1 pt-1">
                        {passwordChecks.map((check) => (
                          <div key={check.key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${strength.checks[check.key] ? 'bg-blue-500' : 'bg-gray-200'}`}>
                              {strength.checks[check.key] && <FaCheckCircle className="text-white text-[8px]" />}
                            </div>
                            <span className={`text-xs transition-colors ${strength.checks[check.key] ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                      <FaLock className="text-xs" style={{ color: color.primary }} />
                    </div>
                    <InputText
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full !pl-14 !pr-12 !py-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${password === confirmPassword ? 'bg-blue-500' : 'bg-red-400'}`}>
                        <FaCheckCircle className="text-white text-[8px]" />
                      </div>
                      <span className={`text-xs font-semibold ${password === confirmPassword ? 'text-blue-600' : 'text-red-500'}`}>
                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6 || strength.passed < 5 || password !== confirmPassword}
                  className="w-full text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 disabled:scale-100"
                  style={{ backgroundColor: color.primary }}
                >
                  {loading
                    ? <><i className="pi pi-spin pi-spinner" /> Creating Account...</>
                    : <>Create My Account <FaArrowRight /></>
                  }
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                >
                  ← Back to email
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Already a seller?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Sign In */}
            <Link to="/login">
              <button className="w-full py-4 rounded-2xl border-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
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
                Sign In Instead
              </button>
            </Link>
          </div>

          {/* Bottom trust line */}
          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            By registering, you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: color.primary }}>Terms</span>
            {" "}&amp;{" "}
            <span className="underline cursor-pointer" style={{ color: color.primary }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
