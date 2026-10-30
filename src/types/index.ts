export type Role = 'patient' | 'admin';
export type AuthMode = 'otp' | 'gmail';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  authMethod: AuthMode;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  panel: Role;
}

export interface WHOCountryStat {
  country: string;
  code: string;
  ratePer100k: number;
  totalAnnualCases: number;
  annualDeaths: number;
  flagEmoji: string;
  rank: number;
  continent: string;
}

export interface PatientAssessment {
  id: string;
  submittedAt: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  motherName: string;
  motherAge: number;
  fatherName: string;
  fatherAge: number;
  emergencyContact: string;
  emergencyRelation: string;
  familyHistory: 'none' | 'maternal' | 'paternal' | 'both';
  symptoms: string[];
  priorMammogram: boolean;
  priorBiopsy: boolean;
  calculatedRisk: 'Low' | 'Moderate' | 'High Suspicion';
  status: 'Pending Review' | 'Triaged' | 'Urgent Consult' | 'Cleared';
  doctorNotes?: string;
  assignedDoctor?: string;
}

export interface UCIFeatures {
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  concave_points_worst: number;
}

export interface ShapItem {
  feature: keyof UCIFeatures | string;
  featureLabel: string;
  patientValue: number;
  referenceMean: number;
  benignMean: number;
  malignantMean: number;
  unit: string;
  shapValue: number;
  impact: 'malignant' | 'benign' | 'neutral';
  explanation: string;
}

export interface PredictionResult {
  prediction: 'Malignant' | 'Benign';
  confidence: number;
  malignantProb: number;
  benignProb: number;
  riskLevel: 'Low' | 'Moderate' | 'High Suspicion';
  baseValue: number;
  shapValues: ShapItem[];
  clinicalExplanation: string;
  timestamp: string;
}

export interface ModelMetrics {
  totalSamples: number;
  benignCount: number;
  malignantCount: number;
  accuracy: number;
  auc: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    falseNegative: number;
    trueNegative: number;
  };
}
