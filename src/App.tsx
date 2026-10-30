import React, { useState, useEffect } from 'react';
import { Role, User, PatientAssessment } from './types';
import { getStoredAssessments, getStoredUser, saveStoredUser } from './services/storage';
import { Navbar } from './components/navbar/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { PatientHome } from './components/patient/PatientHome';
import { PatientAssessmentForm } from './components/patient/PatientAssessment';
import { KnowledgeSection } from './components/patient/KnowledgeSection';
import { PrecautionSection } from './components/patient/PrecautionSection';
import { NumericalAnalysis } from './components/patient/NumericalAnalysis';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AwsDeploymentModal } from './components/admin/AwsDeploymentModal';
import { Heart, ShieldCheck, PhoneCall, ExternalLink, Activity } from 'lucide-react';

export default function App() {
  const [currentPanel, setCurrentPanel] = useState<Role>('patient');
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<Role>('patient');
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);

  // Tabs for Patient Panel
  const [activePatientTab, setActivePatientTab] = useState<'overview' | 'assessment' | 'knowledge' | 'precaution' | 'ml'>('overview');

  // Tabs for Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'triage' | 'metrics' | 'aws'>('triage');

  // Stored assessments
  const [assessments, setAssessments] = useState<PatientAssessment[]>(() => getStoredAssessments());

  // Handle panel switching
  const handleSwitchPanel = (panel: Role) => {
    setCurrentPanel(panel);
    // If not authenticated or role mismatch, offer quick login
    if (!currentUser || currentUser.role !== panel) {
      // Auto-adjust demo user or prompt modal if preferred
      // For effortless testing, we maintain the panel selection
    }
  };

  const handleOpenAuth = (role?: Role) => {
    setAuthModalRole(role || currentPanel);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setCurrentPanel(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
  };

  const handleAssessmentCompleted = (newAssessment: PatientAssessment) => {
    setAssessments(getStoredAssessments());
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentPanel={currentPanel}
        onSwitchPanel={handleSwitchPanel}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        activePatientTab={activePatientTab}
        setActivePatientTab={setActivePatientTab}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentPanel === 'patient' ? (
          <div>
            {activePatientTab === 'overview' && (
              <PatientHome
                onGoToAssessment={() => setActivePatientTab('assessment')}
                onGoToML={() => setActivePatientTab('ml')}
              />
            )}
            {activePatientTab === 'assessment' && (
              <PatientAssessmentForm
                onAssessmentCompleted={handleAssessmentCompleted}
                onGoToML={() => setActivePatientTab('ml')}
              />
            )}
            {activePatientTab === 'knowledge' && <KnowledgeSection />}
            {activePatientTab === 'precaution' && <PrecautionSection />}
            {activePatientTab === 'ml' && <NumericalAnalysis />}
          </div>
        ) : (
          <AdminDashboard
            assessments={assessments}
            onAssessmentsUpdated={setAssessments}
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={(tab) => {
              if (tab === 'aws') {
                setIsAwsModalOpen(true);
              } else {
                setActiveAdminTab(tab);
              }
            }}
            onOpenAwsModal={() => setIsAwsModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="font-bold text-slate-800">OncoCare Intelligence Platform</span>
              <p className="text-[11px] text-slate-400">
                Ground-truth clinical analytics based on WHO GLOBOCAN & UCI Machine Learning WDBC benchmark
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => handleSwitchPanel(currentPanel === 'patient' ? 'admin' : 'patient')}
              className="text-teal-700 font-bold hover:underline"
            >
              Switch to {currentPanel === 'patient' ? 'Admin Panel' : 'Patient Panel'}
            </button>
            <button
              onClick={() => setIsAwsModalOpen(true)}
              className="text-indigo-700 font-bold hover:underline flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5" />
              AWS FastAPI Architecture
            </button>
            <span className="text-slate-400 hidden md:inline">24/7 Cancer Information Line: 1-800-227-2345</span>
          </div>
        </div>
      </footer>

      {/* Dual-Panel Login Modal (Mobile OTP + Gmail Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* AWS & FastAPI Deployment Architecture Modal */}
      <AwsDeploymentModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />

    </div>
  );
}
