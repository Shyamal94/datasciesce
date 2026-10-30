import React, { useState } from 'react';
import { PatientAssessment } from '../../types';
import { updateAssessmentStatus, exportAssessmentsCSV } from '../../services/storage';
import { MODEL_METRICS, UCI_FEATURE_METADATA } from '../../data/uciModelData';
import { Activity, Users, ShieldAlert, Cpu, Download, Search, Filter, CheckCircle2, AlertTriangle, Eye, Edit3, Cloud, ChevronRight, FileSpreadsheet } from 'lucide-react';

interface AdminDashboardProps {
  assessments: PatientAssessment[];
  onAssessmentsUpdated: (updated: PatientAssessment[]) => void;
  activeAdminTab: 'triage' | 'metrics' | 'aws';
  setActiveAdminTab: (tab: 'triage' | 'metrics' | 'aws') => void;
  onOpenAwsModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  assessments,
  onAssessmentsUpdated,
  activeAdminTab,
  setActiveAdminTab,
  onOpenAwsModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Selected patient for detail inspection & status update modal
  const [selectedPatient, setSelectedPatient] = useState<PatientAssessment | null>(null);
  const [editStatus, setEditStatus] = useState<PatientAssessment['status']>('Pending Review');
  const [editNotes, setEditNotes] = useState('');
  const [editDoctor, setEditDoctor] = useState('');

  const openPatientModal = (patient: PatientAssessment) => {
    setSelectedPatient(patient);
    setEditStatus(patient.status);
    setEditNotes(patient.doctorNotes || '');
    setEditDoctor(patient.assignedDoctor || 'Dr. Sarah Lin, MD (Oncology)');
  };

  const handleSavePatientUpdate = () => {
    if (!selectedPatient) return;
    const updated = updateAssessmentStatus(selectedPatient.id, editStatus, editNotes, editDoctor);
    onAssessmentsUpdated(updated);
    setSelectedPatient(null);
  };

  // Filter logic
  const filteredPatients = assessments.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'All' || p.calculatedRisk === filterRisk;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const highRiskCount = assessments.filter((p) => p.calculatedRisk === 'High Suspicion').length;
  const pendingCount = assessments.filter((p) => p.status === 'Pending Review' || p.status === 'Urgent Consult').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Admin Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Oncology Clinical Command & Intelligence Dashboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Administrator Oversight & Triage Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Monitor patient intake dossiers, review maternal/paternal heredity indicators, triage clinical priorities, 
              and inspect the UCI Wisconsin Diagnostic Breast Cancer Machine Learning model with SHAP telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAwsModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Cloud className="w-4 h-4" />
              AWS & FastAPI Deployment Hub
            </button>
            <button
              onClick={() => exportAssessmentsCSV(assessments)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Patient CSV
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Patients Logged</span>
            <div className="text-2xl font-black text-white mt-1">{assessments.length}</div>
            <span className="text-[11px] text-teal-400">Synchronized Clinical Records</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-semibold">High Suspicion Flagged</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{highRiskCount}</div>
            <span className="text-[11px] text-rose-300">Requires Urgent Oncologist Review</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Triage Queue</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
            <span className="text-[11px] text-amber-300">Awaiting Doctor Clearance</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-semibold">UCI Model Accuracy</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{(MODEL_METRICS.accuracy * 100).toFixed(1)}%</div>
            <span className="text-[11px] text-emerald-300">ROC-AUC: {MODEL_METRICS.auc}</span>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveAdminTab('triage')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeAdminTab === 'triage'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Patient Intake & Clinical Triage ({assessments.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeAdminTab === 'metrics'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          UCI Random Forest Metrics & Confusion Matrix
        </button>
      </div>

      {/* View 1: Patient Triage & Intake Records Table */}
      {activeAdminTab === 'triage' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Patient Intake Dossiers</h3>
              <p className="text-xs text-slate-500">
                Patients who submitted personal assessment data, parental lineage, emergency contacts, and symptoms
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name / phone / ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60"
                />
              </div>

              {/* Risk Filter */}
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Risk Tiers</option>
                <option value="High Suspicion">High Suspicion</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Urgent Consult">Urgent Consult</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Triaged">Triaged</option>
                <option value="Cleared">Cleared</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Patient Name & Age</th>
                  <th className="py-3 px-4">Mobile & Emergency</th>
                  <th className="py-3 px-4">Parental History</th>
                  <th className="py-3 px-4">Reported Symptoms</th>
                  <th className="py-3 px-4 text-center">Risk Tier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{patient.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-400">{patient.age} years old</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{patient.phone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]" title={patient.emergencyContact}>
                          Emerg: {patient.emergencyContact}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800">
                          M: {patient.motherName} ({patient.motherAge})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          F: {patient.fatherName} ({patient.fatherAge})
                        </div>
                        <span className={`inline-block text-[10px] uppercase font-bold mt-0.5 px-1.5 py-0.2 rounded ${
                          patient.familyHistory !== 'none' ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
                        }`}>
                          Hist: {patient.familyHistory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {patient.symptoms.length} symptom{patient.symptoms.length !== 1 ? 's' : ''}
                        </span>
                        {patient.symptoms.length > 0 && (
                          <div className="text-[11px] text-rose-600 truncate max-w-[180px]" title={patient.symptoms.join(', ')}>
                            {patient.symptoms[0]}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          patient.calculatedRisk === 'High Suspicion'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : patient.calculatedRisk === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {patient.calculatedRisk}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          patient.status === 'Urgent Consult'
                            ? 'bg-rose-600 text-white'
                            : patient.status === 'Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openPatientModal(patient)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review Dossier
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No patient assessment records matched your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: UCI Model Metrics & Confusion Matrix */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400">Total WDBC Dataset</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{MODEL_METRICS.totalSamples}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">357 Benign / 212 Malignant</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400">Model Accuracy</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{(MODEL_METRICS.accuracy * 100).toFixed(1)}%</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">5-Fold Cross Validation</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400">ROC-AUC Score</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">{MODEL_METRICS.auc}</div>
              <div className="text-[11px] text-indigo-700 mt-0.5">High Discrimination Power</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400">Precision Rate</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{(MODEL_METRICS.precision * 100).toFixed(1)}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Low False Positives</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400">Recall / Sensitivity</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{(MODEL_METRICS.recall * 100).toFixed(1)}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Malignancy Catch Rate</div>
            </div>
          </div>

          {/* Confusion Matrix & Global Feature Importance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Confusion Matrix */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Diagnostic Verification</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  Confusion Matrix (UCI WDBC Test Partition)
                </h3>
                <p className="text-xs text-slate-500">
                  Performance on fine needle aspirate (FNA) cytologic validation cases:
                </p>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Actual \\ Predicted</th>
                      <th className="py-3 px-4 bg-emerald-50 text-emerald-900">Predicted Benign</th>
                      <th className="py-3 px-4 bg-rose-50 text-rose-900">Predicted Malignant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    <tr>
                      <td className="py-4 px-4 font-bold bg-slate-50 text-left">Actual Benign</td>
                      <td className="py-4 px-4 bg-emerald-500/10 font-mono font-bold text-emerald-800 text-sm">
                        {MODEL_METRICS.confusionMatrix.trueNegative} (TN)
                        <span className="block text-[10px] font-normal text-emerald-600">Correctly Cleared</span>
                      </td>
                      <td className="py-4 px-4 bg-rose-500/10 font-mono font-bold text-rose-700">
                        {MODEL_METRICS.confusionMatrix.falsePositive} (FP)
                        <span className="block text-[10px] font-normal text-rose-500">Over-cautious biopsy</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold bg-slate-50 text-left">Actual Malignant</td>
                      <td className="py-4 px-4 bg-amber-500/10 font-mono font-bold text-amber-800">
                        {MODEL_METRICS.confusionMatrix.falseNegative} (FN)
                        <span className="block text-[10px] font-normal text-amber-600">Borderline atypical</span>
                      </td>
                      <td className="py-4 px-4 bg-rose-500/20 font-mono font-bold text-rose-900 text-sm">
                        {MODEL_METRICS.confusionMatrix.truePositive} (TP)
                        <span className="block text-[10px] font-normal text-rose-700">Confirmed Malignancy</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Global Feature Importance Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Random Forest Architecture</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  Top Gini Feature Importance Weights
                </h3>
                <p className="text-xs text-slate-500">
                  Relative predictive contribution across 100 decision trees in the ensemble:
                </p>
              </div>

              <div className="space-y-3">
                {UCI_FEATURE_METADATA.slice(0, 6).map((feat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{feat.label}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(feat.importanceWeight * 100).toFixed(0)}% Weight
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${feat.importanceWeight * 400}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">{feat.clinicalSignificance}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Patient Dossier Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs uppercase text-indigo-400 font-bold tracking-wider">Patient Intake Reference</span>
                <h3 className="text-xl font-bold">{selectedPatient.name} (#{selectedPatient.id})</h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div><span className="text-slate-500 font-medium">Age:</span> <span className="font-bold text-slate-900">{selectedPatient.age} years</span></div>
                <div><span className="text-slate-500 font-medium">Phone:</span> <span className="font-bold text-slate-900">{selectedPatient.phone}</span></div>
                <div><span className="text-slate-500 font-medium">Address:</span> <span className="font-medium text-slate-800">{selectedPatient.address}</span></div>
                <div><span className="text-slate-500 font-medium">Emergency:</span> <span className="font-bold text-slate-900">{selectedPatient.emergencyContact}</span></div>
              </div>

              {/* Parental Heredity */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[11px] block">Parental Lineage & Heredity:</span>
                <div>Mother: <strong>{selectedPatient.motherName}</strong> ({selectedPatient.motherAge} yrs)</div>
                <div>Father: <strong>{selectedPatient.fatherName}</strong> ({selectedPatient.fatherAge} yrs)</div>
                <div>Hereditary Cancer History: <strong className="uppercase">{selectedPatient.familyHistory}</strong></div>
              </div>

              {/* Reported Symptoms */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] block">Active Physical Symptoms:</span>
                {selectedPatient.symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.symptoms.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-medium">
                        • {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">No symptoms reported. Routine screening.</span>
                )}
              </div>

              {/* Clinical Triage Form */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-4">
                <span className="font-bold text-indigo-950 uppercase text-[11px] block">
                  Oncologist Triage & Status Update
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Clinical Triage Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Urgent Consult">🚨 Urgent Consult</option>
                      <option value="Pending Review">⏳ Pending Review</option>
                      <option value="Triaged">📋 Triaged (Biopsy Scheduled)</option>
                      <option value="Cleared">✅ Cleared (Benign Follow-Up)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Assigned Physician</label>
                    <input
                      type="text"
                      value={editDoctor}
                      onChange={(e) => setEditDoctor(e.target.value)}
                      placeholder="e.g. Dr. Sarah Lin, MD"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Doctor Notes & Instructions</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter diagnostic impressions, biopsy schedule, or medication notes..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePatientUpdate}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Clinical Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
