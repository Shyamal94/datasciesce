import React, { useState } from 'react';
import { PatientAssessment } from '../../types';
import { saveAssessment } from '../../services/storage';
import confetti from 'canvas-confetti';
import { Heart, User, Calendar, Phone, MapPin, Users, ShieldAlert, CheckCircle2, FileText, Printer, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

interface PatientAssessmentProps {
  onAssessmentCompleted?: (assessment: PatientAssessment) => void;
  onGoToML: () => void;
}

export const PatientAssessmentForm: React.FC<PatientAssessmentProps> = ({ onAssessmentCompleted, onGoToML }) => {
  // Form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherAge, setMotherAge] = useState<number | ''>('');
  const [fatherName, setFatherName] = useState('');
  const [fatherAge, setFatherAge] = useState<number | ''>('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [familyHistory, setFamilyHistory] = useState<'none' | 'maternal' | 'paternal' | 'both'>('none');
  
  // Symptoms Checklist
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [priorMammogram, setPriorMammogram] = useState(false);
  const [priorBiopsy, setPriorBiopsy] = useState(false);

  // Submission state
  const [submittedAssessment, setSubmittedAssessment] = useState<PatientAssessment | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const SYMPTOM_OPTIONS = [
    { id: 'lump', label: 'New palpable firm lump or thickening in breast or underarm', severity: 'high' },
    { id: 'dimpling', label: 'Skin dimpling, puckering, or "orange-peel" texture (peau d’orange)', severity: 'high' },
    { id: 'nipple_inv', label: 'Nipple retraction, sudden inward turning, or asymmetry', severity: 'medium' },
    { id: 'discharge', label: 'Spontaneous bloody or clear discharge from single duct', severity: 'high' },
    { id: 'redness', label: 'Persistent unexplained redness, scaly flaking, or warmth', severity: 'medium' },
    { id: 'focal_pain', label: 'Localized, persistent, non-cyclical breast pain', severity: 'low' },
  ];

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleQuickFill = () => {
    setName('Julianna Roberts');
    setAge(46);
    setPhone('+1 (555) 839-2041');
    setAddress('412 Magnolia Avenue, Suite 3B, Atlanta, GA 30308');
    setMotherName('Helen Roberts');
    setMotherAge(73);
    setFatherName('George Roberts');
    setFatherAge(76);
    setEmergencyContact('+1 (555) 912-4402');
    setEmergencyRelation('Spouse');
    setFamilyHistory('maternal');
    setSelectedSymptoms([
      'New palpable firm lump or thickening in breast or underarm',
      'Skin dimpling, puckering, or "orange-peel" texture (peau d’orange)',
    ]);
    setPriorMammogram(true);
    setPriorBiopsy(false);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Patient Name is required.');
      return;
    }
    if (!age || Number(age) < 18 || Number(age) > 115) {
      setErrorMsg('Please enter a valid adult age (18 - 115).');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Contact Mobile Number is required.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Residential Address is required.');
      return;
    }
    if (!motherName.trim() || !fatherName.trim()) {
      setErrorMsg('Parental details (Mother and Father names) are required for clinical heredity index.');
      return;
    }
    if (!emergencyContact.trim()) {
      setErrorMsg('Emergency Contact Number is required.');
      return;
    }

    setErrorMsg('');

    // Risk Calculation based on age, family history, and symptoms
    let riskTier: 'Low' | 'Moderate' | 'High Suspicion' = 'Low';
    const highSeverityCount = selectedSymptoms.filter((s) =>
      s.includes('lump') || s.includes('dimpling') || s.includes('discharge')
    ).length;

    if (familyHistory === 'both' || (familyHistory === 'maternal' && highSeverityCount >= 1) || highSeverityCount >= 2) {
      riskTier = 'High Suspicion';
    } else if (familyHistory !== 'none' || selectedSymptoms.length >= 1 || Number(age) >= 55) {
      riskTier = 'Moderate';
    }

    const newAssessment: PatientAssessment = {
      id: `BC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      name: name.trim(),
      age: Number(age),
      phone: phone.trim(),
      address: address.trim(),
      motherName: motherName.trim(),
      motherAge: Number(motherAge) || 60,
      fatherName: fatherName.trim(),
      fatherAge: Number(fatherAge) || 65,
      emergencyContact: `${emergencyContact.trim()} (${emergencyRelation})`,
      emergencyRelation,
      familyHistory,
      symptoms: selectedSymptoms,
      priorMammogram,
      priorBiopsy,
      calculatedRisk: riskTier,
      status: riskTier === 'High Suspicion' ? 'Urgent Consult' : 'Pending Review',
      doctorNotes: riskTier === 'High Suspicion'
        ? 'High suspicion intake. Auto-flagged for priority triage due to reported focal symptoms and/or maternal cancer heredity.'
        : 'Intake received. Scheduled for standard clinical review.',
    };

    saveAssessment(newAssessment);
    setSubmittedAssessment(newAssessment);
    if (onAssessmentCompleted) onAssessmentCompleted(newAssessment);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Standardized Clinical Intake Form
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Assessment & Family History Dossier
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Please fill out your personal information, parental lineage ages, emergency contacts, 
            and any breast symptoms. Your assessment is securely routed to our oncology review panel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickFill}
          className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-300 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Auto-Fill Sample Patient
        </button>
      </div>

      {submittedAssessment ? (
        /* Submission Success & Clinical Intake Summary Dossier */
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-lg space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Intake Successfully Logged</span>
                <h3 className="text-xl font-black text-slate-900">
                  Assessment Reference #{submittedAssessment.id}
                </h3>
                <span className="text-xs text-slate-400">
                  Logged on {new Date(submittedAssessment.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
              <button
                onClick={onGoToML}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Proceed to UCI ML Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Risk Tier Alert Badge */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            submittedAssessment.calculatedRisk === 'High Suspicion'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : submittedAssessment.calculatedRisk === 'Moderate'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
              submittedAssessment.calculatedRisk === 'High Suspicion' ? 'text-rose-600' : 'text-amber-600'
            }`} />
            <div>
              <div className="font-bold text-sm">
                Calculated Risk Tier: {submittedAssessment.calculatedRisk}
              </div>
              <p className="text-xs mt-0.5 leading-relaxed">
                {submittedAssessment.calculatedRisk === 'High Suspicion'
                  ? 'Your intake exhibits prominent symptoms or heredity indicators. Our clinical oncology team has flagged your file for expedited review.'
                  : 'Your assessment details have been logged. Please maintain regular mammography screening according to clinical age guidelines.'}
              </p>
            </div>
          </div>

          {/* Dossier Grid Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Primary Patient Information
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-500">Full Name:</span> <span className="font-bold text-slate-800">{submittedAssessment.name}</span></div>
                <div><span className="text-slate-500">Age:</span> <span className="font-bold text-slate-800">{submittedAssessment.age} years</span></div>
                <div><span className="text-slate-500">Phone:</span> <span className="font-bold text-slate-800">{submittedAssessment.phone}</span></div>
                <div><span className="text-slate-500">Emergency:</span> <span className="font-bold text-slate-800">{submittedAssessment.emergencyContact}</span></div>
              </div>
              <div><span className="text-slate-500">Residential Address:</span> <span className="font-medium text-slate-800 block mt-0.5">{submittedAssessment.address}</span></div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Parental Lineage & Heredity Index
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-500">Mother:</span> <span className="font-bold text-slate-800">{submittedAssessment.motherName} ({submittedAssessment.motherAge} yrs)</span></div>
                <div><span className="text-slate-500">Father:</span> <span className="font-bold text-slate-800">{submittedAssessment.fatherName} ({submittedAssessment.fatherAge} yrs)</span></div>
              </div>
              <div>
                <span className="text-slate-500">Family Cancer History:</span>{' '}
                <span className="font-bold uppercase text-slate-800">{submittedAssessment.familyHistory}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Prior Screening: Mammogram ({submittedAssessment.priorMammogram ? 'Yes' : 'No'}), Biopsy ({submittedAssessment.priorBiopsy ? 'Yes' : 'No'})
              </div>
            </div>
          </div>

          {/* Symptoms List */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-bold block mb-1.5 uppercase text-[11px]">Reported Symptoms:</span>
            {submittedAssessment.symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {submittedAssessment.symptoms.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-medium">
                    • {s}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 italic">No localized active symptoms reported (Routine preventative baseline).</span>
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setSubmittedAssessment(null)}
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              Submit Another Assessment
            </button>
          </div>
        </div>
      ) : (
        /* Patient Assessment Entry Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Section 1: Basic Demographics & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                1. Patient Identity & Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="115"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 48"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Full Residential Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Apartment/Suite, City, State, Postal Code"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 2: Parental Lineage Information (Heredity Index) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                2. Parental Information (Genetic & Familial Risk Indicators)
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Hereditary breast cancer mutations (such as BRCA1/BRCA2 and PALB2) are transmitted through both maternal and paternal lineages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mother Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Mother's Details
                </span>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mother's Full Name *</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="e.g. Margaret Vance"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mother's Current Age (or age at passing) *</label>
                  <input
                    type="number"
                    min="30"
                    max="120"
                    value={motherAge}
                    onChange={(e) => setMotherAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 74"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              {/* Father Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Father's Details
                </span>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Father's Full Name *</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Arthur Vance"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Father's Current Age (or age at passing) *</label>
                  <input
                    type="number"
                    min="30"
                    max="120"
                    value={fatherAge}
                    onChange={(e) => setFatherAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 77"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Family History Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Known Family History of Breast or Ovarian Cancer
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'No Known History' },
                  { value: 'maternal', label: 'Maternal Side (Mother/Aunt/Grandmother)' },
                  { value: 'paternal', label: 'Paternal Side (Father/Aunt/Grandmother)' },
                  { value: 'both', label: 'Both Maternal & Paternal' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFamilyHistory(item.value as any)}
                    className={`p-3 text-xs rounded-xl border text-left transition-all ${
                      familyHistory === item.value
                        ? 'bg-teal-50 border-teal-500 font-bold text-teal-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Phone className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">
                3. Emergency Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Emergency Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+1 (555) 910-3841"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Relationship to Patient
                </label>
                <select
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Guardian">Legal Guardian</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Symptoms & Screening History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                4. Symptom Checklist & Clinical Screening History
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Select any current physical changes or sensations you have observed during self-examination:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.label);
                return (
                  <div
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.label)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs leading-snug">{sym.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={priorMammogram}
                  onChange={(e) => setPriorMammogram(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Have you had a mammogram screening within the past 12 months?
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={priorBiopsy}
                  onChange={(e) => setPriorBiopsy(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Have you ever undergone a breast fine needle aspiration (FNA) or core biopsy?
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Required clinical intake criteria for oncology review
            </span>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Submit Patient Assessment Dossier
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
