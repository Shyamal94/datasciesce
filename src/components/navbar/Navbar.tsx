import React from 'react';
import { Role, User } from '../../types';
import { Activity, ShieldAlert, Heart, BookOpen, ShieldCheck, Cpu, UserCheck, KeyRound, LogOut, PhoneCall, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentPanel: Role;
  onSwitchPanel: (panel: Role) => void;
  currentUser: User | null;
  onOpenAuth: (role?: Role) => void;
  onLogout: () => void;
  activePatientTab: 'overview' | 'assessment' | 'knowledge' | 'precaution' | 'ml';
  setActivePatientTab: (tab: 'overview' | 'assessment' | 'knowledge' | 'precaution' | 'ml') => void;
  activeAdminTab: 'triage' | 'metrics' | 'aws';
  setActiveAdminTab: (tab: 'triage' | 'metrics' | 'aws') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPanel,
  onSwitchPanel,
  currentUser,
  onOpenAuth,
  onLogout,
  activePatientTab,
  setActivePatientTab,
  activeAdminTab,
  setActiveAdminTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Clinical Alert / Hotline Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-100">WHO Breast Cancer Awareness Program:</span>
          <span className="hidden md:inline text-slate-300">Early detection triples 5-year survival from 29% to 99%.</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-rose-300 font-medium">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Clinical Helpline: 1-800-227-2345</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400">UCI WDBC Machine Learning Engine Active</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-700 to-emerald-600 flex items-center justify-center shadow-md text-white">
              <Heart className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">Onco<span className="text-teal-600">Care</span></span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  currentPanel === 'admin'
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'bg-teal-100 text-teal-800 border border-teal-200'
                }`}>
                  {currentPanel === 'admin' ? 'Admin Panel' : 'Patient Panel'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Breast Cancer Intelligence & Diagnostic System</p>
            </div>
          </div>

          {/* Panel Selector Pill */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => onSwitchPanel('patient')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPanel === 'patient'
                  ? 'bg-white text-teal-900 shadow-sm font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              Patient Portal
            </button>
            <button
              onClick={() => onSwitchPanel('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPanel === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Admin Clinical Panel
            </button>
          </div>

          {/* User Auth Info & Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.authMethod === 'otp' ? `📱 ${currentUser.phone}` : `✉️ ${currentUser.email}`}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs border border-teal-300">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth(currentPanel)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sign In (OTP / Gmail)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {currentPanel === 'patient' ? (
            <>
              <button
                onClick={() => setActivePatientTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePatientTab === 'overview'
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                WHO Global Statistics
              </button>
              <button
                onClick={() => setActivePatientTab('assessment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePatientTab === 'assessment'
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Patient Assessment Form
              </button>
              <button
                onClick={() => setActivePatientTab('knowledge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePatientTab === 'knowledge'
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Knowledge & Biology Section
              </button>
              <button
                onClick={() => setActivePatientTab('precaution')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePatientTab === 'precaution'
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                Precaution & Prevention Section
              </button>
              <button
                onClick={() => setActivePatientTab('ml')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePatientTab === 'ml'
                    ? 'bg-teal-600 text-white font-bold shadow-sm'
                    : 'text-teal-700 bg-teal-50/70 hover:bg-teal-100/70 font-semibold'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                UCI ML Analysis & SHAP
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveAdminTab('triage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'triage'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                Patient Triage & Intake Records
              </button>
              <button
                onClick={() => setActiveAdminTab('metrics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'metrics'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                UCI Model Metrics & Confusion Matrix
              </button>
              <button
                onClick={() => setActiveAdminTab('aws')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeAdminTab === 'aws'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
                AWS & FastAPI Deployment Hub
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
