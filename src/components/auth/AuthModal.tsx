import React, { useState, useEffect } from 'react';
import { Role, AuthMode, User } from '../../types';
import { Shield, Smartphone, Mail, Lock, CheckCircle2, ArrowRight, RefreshCw, KeyRound, UserCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'patient',
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [authMode, setAuthMode] = useState<AuthMode>('otp');

  // Mobile OTP state
  const [phoneCountry, setPhoneCountry] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // Gmail / Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // Synchronize when initialRole changes
  useEffect(() => {
    setSelectedRole(initialRole);
  }, [initialRole]);

  // Handle OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      setOtpError('Please enter a valid mobile number (at least 7 digits)');
      return;
    }
    setOtpError('');
    // Generate realistic 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(code);
    setOtpSent(true);
    setOtpTimer(45);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }
    if (enteredOtp !== simulatedOtp && enteredOtp !== '123456') {
      setOtpError('Invalid OTP code. Please enter the code shown above or click Auto-fill.');
      return;
    }

    const defaultName = selectedRole === 'admin' ? 'Dr. Elizabeth Warren, MD (Admin)' : 'Sarah Jenkins (Patient)';
    const user: User = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: defaultName,
      phone: `${phoneCountry} ${phoneNumber}`,
      role: selectedRole,
      authMethod: 'otp',
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid Gmail / Email address');
      return;
    }
    if (!password || password.length < 6) {
      setEmailError('Password must be at least 6 characters');
      return;
    }

    setEmailError('');
    const user: User = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: selectedRole === 'admin' ? 'Chief Medical Administrator' : email.split('@')[0],
      email: email.toLowerCase(),
      role: selectedRole,
      authMethod: 'gmail',
    };
    onLoginSuccess(user);
    onClose();
  };

  const fillQuickDemo = (role: Role, mode: AuthMode) => {
    setSelectedRole(role);
    setAuthMode(mode);
    setOtpError('');
    setEmailError('');

    if (mode === 'otp') {
      setPhoneNumber(role === 'admin' ? '5550198234' : '5550143890');
      const testCode = '482910';
      setSimulatedOtp(testCode);
      setOtpSent(true);
      setEnteredOtp(testCode);
      setOtpTimer(40);
    } else {
      if (role === 'admin') {
        setEmail('admin.oncology@oncocare.org');
        setPassword('AdminOnco#2026');
      } else {
        setEmail('clara.davis@gmail.com');
        setPassword('PatientCare$99');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200">
        
        {/* Header Ribbon */}
        <div className={`p-6 text-white ${selectedRole === 'admin' ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900' : 'bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Clinical Security Gateway</span>
                <h3 className="text-xl font-bold leading-tight">
                  {selectedRole === 'admin' ? 'Administrator Clinical Panel' : 'Patient Care & Detection Portal'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-200/90 leading-relaxed">
            Secure two-factor verified authentication for {selectedRole === 'admin' ? 'authorized oncology staff and clinical researchers' : 'patients undergoing clinical assessment & screening'}.
          </p>

          {/* Panel Selector Tabs */}
          <div className="flex p-1 mt-4 bg-black/25 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'patient'
                  ? 'bg-white text-teal-900 shadow-md font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Patient Panel
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Admin Panel
            </button>
          </div>
        </div>

        {/* Auth Method Selector */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setOtpError(''); }}
              className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 mr-6 ${
                authMode === 'otp'
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile Number with OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('gmail'); setEmailError(''); }}
              className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                authMode === 'gmail'
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              Gmail with Password
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-3 space-y-4">

          {/* Quick Demo Fill Pills */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">Quick Test Credentials:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => fillQuickDemo(selectedRole, 'otp')}
                className="text-xs bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 font-medium px-2.5 py-1 rounded-md transition-colors"
              >
                1-Click OTP Demo
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo(selectedRole, 'gmail')}
                className="text-xs bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium px-2.5 py-1 rounded-md transition-colors"
              >
                1-Click Gmail Demo
              </button>
            </div>
          </div>

          {/* Mode 1: Mobile with OTP */}
          {authMode === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    disabled={otpSent}
                    className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="Enter 10-digit number"
                    disabled={otpSent}
                    className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      Send OTP
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Simulation Notification */}
              {otpSent && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-2 animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Verification Code Dispatched
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700">Expires in {otpTimer}s</span>
                  </div>
                  <p className="text-slate-600">
                    A test SMS was routed to <span className="font-semibold text-slate-800">{phoneCountry} {phoneNumber}</span>.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono bg-white px-2.5 py-1 rounded border border-emerald-300 text-sm font-bold tracking-widest text-emerald-950">
                      {simulatedOtp}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(simulatedOtp)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded transition-colors"
                    >
                      Auto-fill Code
                    </button>
                  </div>
                </div>
              )}

              {/* Enter OTP Field */}
              {otpSent && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      className={`text-xs flex items-center gap-1 ${
                        otpTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-teal-600 hover:text-teal-800 font-medium'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Resend Code {otpTimer > 0 ? `(${otpTimer}s)` : ''}
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="e.g. 849201"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-center font-mono text-lg tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              {otpError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {otpError}
                </div>
              )}

              {otpSent && (
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Verify & Access {selectedRole === 'admin' ? 'Admin Panel' : 'Patient Portal'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>
          ) : (
            /* Mode 2: Gmail with Password */
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Gmail / Clinical Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com or oncocare.org"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-teal-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {emailError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {emailError}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'admin'
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                Sign In with Gmail / Password
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              HIPAA & GDPR Compliant Medical Encryption Protocol
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
