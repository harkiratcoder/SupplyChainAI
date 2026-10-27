import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Boxes,
  Users,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Form states
  const [email, setEmail] = useState('julian.drake@acmefoods.com');
  const [password, setPassword] = useState('SupplyChain2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid business email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      addToast(
        'Welcome Back',
        `Logged in as ${email === 'julian.drake@acmefoods.com' ? 'Julian Drake (Head of Procurement)' : email}`,
        'success'
      );
      navigate('/dashboard');
    }, 850);
  };

  const handleQuickFill = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('DemoPass2026!');
    setErrorMessage(null);
    addToast('Credentials Auto-filled', `Selected ${roleName} profile`, 'info');
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('SSO Authenticated', 'Logged in via Enterprise Google Workspace', 'success');
      navigate('/dashboard');
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(false);
    addToast(
      'Password Reset Sent',
      `Instructions dispatched to ${forgotEmail || email}`,
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* =========================================================
              LEFT SIDE: BRANDING, HEADLINE, DASHBOARD MINI-PREVIEW, BENEFITS
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
                Welcome back to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  smarter procurement.
                </span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Log in to monitor live inventory burn rates, benchmark multi-supplier quotes, and authorize AI-generated purchase orders.
              </p>
            </div>

            {/* Small Product Illustration / Mini Dashboard Preview */}
            <div className="sc-card p-4 bg-white border border-slate-200/90 shadow-card max-w-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time SCM Telemetry</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-50 text-brand-700 px-2 py-0.5 rounded font-medium border border-blue-200">
                  Central Hub
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                {/* Mini Stock Card */}
                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-rose-700">
                      Stockout Alert
                    </span>
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                  </div>
                  <p className="font-bold text-slate-900 mt-1 truncate">
                    Orange Juice (JUC-001)
                  </p>
                  <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    2.67 Days Runway Left
                  </p>
                </div>

                {/* Mini Recommendation */}
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-brand-700">
                      AI Sourcing
                    </span>
                    <Sparkles className="w-3 h-3 text-brand-600" />
                  </div>
                  <p className="font-bold text-slate-900 mt-1 truncate">
                    ABC Foods Ltd.
                  </p>
                  <p className="text-[11px] text-brand-700 font-semibold mt-0.5">
                    136L @ $85/L (2d Lead)
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Benefit Points */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Monitor inventory with predictive days-remaining runways
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Manage suppliers and compare contracted price matrices
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Make AI-assisted procurement decisions with human approval gates
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT SIDE: CENTERED LOGIN CARD & CONTROLS
             ========================================================= */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="sc-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl rounded-2xl w-full max-w-md">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Sign In
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your business credentials to access the platform.
                </p>
              </div>

              {/* 1-Click Quick Demo Profiles */}
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Quick Demo Credentials
                  </span>
                  <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-1.5 py-0.2 rounded">
                    1-Click Autofill
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('julian.drake@acmefoods.com', 'Director Julian')}
                    className="py-1.5 px-2.5 text-[11px] font-medium bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-lg text-slate-700 hover:text-brand-700 transition-colors truncate text-left shadow-2xs"
                  >
                    Julian Drake (Director)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('sarah.jenkins@acmefoods.com', 'Ops Lead Sarah')}
                    className="py-1.5 px-2.5 text-[11px] font-medium bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-lg text-slate-700 hover:text-brand-700 transition-colors truncate text-left shadow-2xs"
                  >
                    Sarah Jenkins (Ops)
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="name@company.com"
                      className="form-input pl-9 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input with Visibility Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setIsForgotPasswordOpen(true);
                      }}
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Enter password"
                      className="form-input pl-9 pr-10 text-sm"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-slate-600">Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Button with Loading State */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-2.5 text-sm font-semibold shadow-sm transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Or Continue With Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2.5 text-slate-400 font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google-Style Login Button UI Placeholder */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2.5 py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {/* Google Multi-Color SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google Workspace</span>
              </button>

              {/* Below Form Signup Link */}
              <div className="mt-5 pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-sm w-full">
            <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your work email address to receive secure password recovery instructions.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                className="form-input text-xs"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
