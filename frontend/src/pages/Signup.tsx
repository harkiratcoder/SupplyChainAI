import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  Boxes,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) {
      return { score: 0, label: '', color: 'text-slate-400', barColor: 'bg-slate-200' };
    }
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (pass.length < 8 || score <= 1) {
      return { score: 1, label: 'Weak', color: 'text-rose-600', barColor: 'bg-rose-500' };
    }
    if (score === 2 || score === 3) {
      return { score: 2, label: 'Medium', color: 'text-amber-600', barColor: 'bg-amber-500' };
    }
    return { score: 3, label: 'Strong', color: 'text-emerald-600', barColor: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid business email address.');
      return false;
    }
    if (!companyName.trim()) {
      setErrorMessage('Please enter your company or organization name.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please create a password.');
      return false;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and try again.');
      return false;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
      return false;
    }
    return true;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate mock registration flow
    setTimeout(() => {
      setIsLoading(false);
      addToast(
        'Workspace Registered',
        `Welcome to SupplyChain AI, ${fullName}! Workspace initialized for ${companyName}.`,
        'success'
      );
      navigate('/dashboard');
    }, 850);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* =========================================================
              LEFT SIDE: BRANDING, HEADLINE, TRIAL PREVIEW, BENEFIT POINTS
             ========================================================= */}
          <div className="lg:col-span-6 space-y-8">
            {/* Brand Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs group-hover:bg-brand-700 transition-colors">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  SupplyChain<span className="text-brand-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block -mt-1">
                  Autonomous SCM
                </span>
              </div>
            </Link>

            {/* Headline & Supporting Text */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Start optimizing your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  supply chain in minutes.
                </span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Join forward-thinking supply chain teams automating replenishment, benchmarking vendor contracts in real time, and preventing stockouts with autonomous AI agents.
              </p>
            </div>

            {/* Visual Trial / Provisioning Preview Card */}
            <div className="sc-card p-4 bg-white border border-slate-200/90 shadow-card max-w-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Instant Enterprise Sandbox</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  14-Day Full Access
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">SKU Catalog & Telemetry</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Auto-configured</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Multi-Vendor Price Comparison</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Live Benchmarking</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">AI Procurement Agent with Guardrails</span>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-600">Active</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>No credit card required</span>
                <span>Setup in under 3 minutes</span>
              </div>
            </div>

            {/* 3 Benefit Points */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Real-time stockout prevention with predictive days-remaining runway alerts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Evaluate supplier matrices with volume pricing, lead times, and reliability ratings
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Human-controlled purchasing workflows with mandatory manager authorization gates
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT SIDE: CENTERED SIGNUP CARD
             ========================================================= */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="sc-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl rounded-2xl w-full max-w-md">
              {/* Subtle Onboarding Tagline */}
              <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-700 border border-blue-200/80">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>You're one step away from smarter procurement.</span>
              </div>

              {/* Header */}
              <div className="mb-5 mt-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Set up your enterprise procurement workspace in seconds.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="form-input pl-9 text-sm"
                      placeholder="e.g. Alex Morgan"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label
                    htmlFor="workEmail"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="workEmail"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="form-input pl-9 text-sm"
                      placeholder="alex@acmewholesale.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="form-input pl-9 text-sm"
                      placeholder="e.g. Acme Logistics Global"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="form-input pl-9 pr-10 text-sm"
                      placeholder="At least 8 characters"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Password strength:</span>
                        <span className={`font-semibold ${strength.color}`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 1 ? strength.barColor : 'bg-slate-200'
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 2 ? strength.barColor : 'bg-slate-200'
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 3 ? strength.barColor : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Use 8+ characters with uppercase, lowercase, numbers & symbols.
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="form-input pl-9 pr-10 text-sm"
                      placeholder="Repeat password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {confirmPassword.length > 0 && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                      {password === confirmPassword ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-600 font-medium">
                          Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      disabled={isLoading}
                      className="h-4 w-4 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to the{' '}
                      <span className="text-brand-600 hover:underline font-medium">
                        Terms of Service
                      </span>
                      ,{' '}
                      <span className="text-brand-600 hover:underline font-medium">
                        Privacy Policy
                      </span>
                      , and standard Data Processing Agreement.
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-2.5 text-sm font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating your workspace...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </form>

              {/* Already have an account? Login */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
