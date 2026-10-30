import { PatientAssessment, User } from '../types';

const ASSESSMENTS_KEY = 'oncocare_assessments_v1';
const CURRENT_USER_KEY = 'oncocare_current_user_v1';

const INITIAL_SEED_ASSESSMENTS: PatientAssessment[] = [
  {
    id: 'BC-2026-8912',
    submittedAt: '2026-10-28T09:15:00.000Z',
    name: 'Eleanor Vance',
    age: 48,
    phone: '+1 (555) 349-8291',
    address: '742 Evergreen Terrace, Springfield, OR',
    motherName: 'Margaret Vance',
    motherAge: 74,
    fatherName: 'Arthur Vance',
    fatherAge: 77,
    emergencyContact: '+1 (555) 910-3841 (Husband - David Vance)',
    emergencyRelation: 'Husband',
    familyHistory: 'maternal',
    symptoms: ['Palpable firm lump in upper outer quadrant', 'Mild localized tenderness'],
    priorMammogram: true,
    priorBiopsy: false,
    calculatedRisk: 'High Suspicion',
    status: 'Urgent Consult',
    doctorNotes: 'Right breast palpable mass 2.1cm. Referred for targeted ultrasound and core needle biopsy.',
    assignedDoctor: 'Dr. Sarah Lin, MD (Surgical Oncology)',
  },
  {
    id: 'BC-2026-7840',
    submittedAt: '2026-10-29T14:30:00.000Z',
    name: 'Priya Sharma',
    age: 39,
    phone: '+1 (555) 782-1940',
    address: '1204 Pine Street, Seattle, WA',
    motherName: 'Kavita Sharma',
    motherAge: 65,
    fatherName: 'Rajesh Sharma',
    fatherAge: 68,
    emergencyContact: '+1 (555) 881-9023 (Sister - Ananya)',
    emergencyRelation: 'Sister',
    familyHistory: 'none',
    symptoms: ['Cyclical breast discomfort'],
    priorMammogram: false,
    priorBiopsy: false,
    calculatedRisk: 'Low',
    status: 'Cleared',
    doctorNotes: 'Symptoms consistent with benign fibrocystic changes correlated with menstrual cycle. Reassurance given.',
    assignedDoctor: 'Dr. Marcus Webb, MD',
  },
  {
    id: 'BC-2026-6523',
    submittedAt: '2026-10-30T08:45:00.000Z',
    name: 'Maria Santos',
    age: 54,
    phone: '+1 (555) 438-6629',
    address: '88 Oakridge Blvd, Austin, TX',
    motherName: 'Isabella Santos',
    motherAge: 79,
    fatherName: 'Carlos Santos',
    fatherAge: 82,
    emergencyContact: '+1 (555) 672-8819 (Son - Mateo Santos)',
    emergencyRelation: 'Son',
    familyHistory: 'both',
    symptoms: ['Skin dimpling / slight retraction', 'Nipple inversion (new onset)'],
    priorMammogram: true,
    priorBiopsy: true,
    calculatedRisk: 'High Suspicion',
    status: 'Pending Review',
    doctorNotes: 'High genetic predisposition with new onset nipple inversion. Flagged for priority clinical review.',
    assignedDoctor: 'Dr. Sarah Lin, MD',
  },
];

export function getStoredAssessments(): PatientAssessment[] {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) {
      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(INITIAL_SEED_ASSESSMENTS));
      return INITIAL_SEED_ASSESSMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEED_ASSESSMENTS;
  }
}

export function saveAssessment(assessment: PatientAssessment): PatientAssessment[] {
  const current = getStoredAssessments();
  const updated = [assessment, ...current.filter((item) => item.id !== assessment.id)];
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updated));
  return updated;
}

export function updateAssessmentStatus(
  id: string,
  status: PatientAssessment['status'],
  doctorNotes?: string,
  assignedDoctor?: string
): PatientAssessment[] {
  const current = getStoredAssessments();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(doctorNotes !== undefined ? { doctorNotes } : {}),
        ...(assignedDoctor !== undefined ? { assignedDoctor } : {}),
      };
    }
    return item;
  });
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function exportAssessmentsCSV(assessments: PatientAssessment[]): void {
  const headers = [
    'Assessment ID',
    'Date Submitted',
    'Patient Name',
    'Age',
    'Phone',
    'Address',
    'Mother Name',
    'Mother Age',
    'Father Name',
    'Father Age',
    'Emergency Contact',
    'Family History',
    'Calculated Risk',
    'Triage Status',
    'Assigned Doctor',
    'Doctor Notes',
  ];

  const rows = assessments.map((a) => [
    `"${a.id}"`,
    `"${new Date(a.submittedAt).toLocaleDateString()}"`,
    `"${a.name}"`,
    a.age,
    `"${a.phone}"`,
    `"${a.address.replace(/"/g, '""')}"`,
    `"${a.motherName}"`,
    a.motherAge,
    `"${a.fatherName}"`,
    a.fatherAge,
    `"${a.emergencyContact.replace(/"/g, '""')}"`,
    `"${a.familyHistory}"`,
    `"${a.calculatedRisk}"`,
    `"${a.status}"`,
    `"${a.assignedDoctor || 'Unassigned'}"`,
    `"${(a.doctorNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `oncocare_patient_assessments_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
