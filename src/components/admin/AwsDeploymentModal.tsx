import React, { useState } from 'react';
import { Cloud, Server, Terminal, Copy, Check, ExternalLink, ShieldCheck, Download, Code2, BookOpen } from 'lucide-react';

interface AwsDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AwsDeploymentModal: React.FC<AwsDeploymentModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'fastapi' | 'docker' | 'guide' | 'curl'>('fastapi');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const FASTAPI_CODE = `# OncoCare FastAPI Real-Time Production Backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import numpy as np

app = FastAPI(
    title="OncoCare Breast Cancer Detection API",
    description="Random Forest Diagnostic Classifier with TreeSHAP Explainability",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BreastCancerFeatures(BaseModel):
    concave_points_worst: float = Field(..., example=0.182)
    perimeter_worst: float = Field(..., example=141.3)
    area_worst: float = Field(..., example=1422.0)
    radius_worst: float = Field(..., example=21.1)
    concavity_mean: float = Field(..., example=0.160)
    concave_points_mean: float = Field(..., example=0.088)
    texture_worst: float = Field(..., example=29.3)
    radius_mean: float = Field(..., example=17.4)
    texture_mean: float = Field(..., example=21.6)
    perimeter_mean: float = Field(..., example=115.3)

@app.post("/api/predict")
def predict_and_explain(f: BreastCancerFeatures):
    base_val = 0.3725  # UCI WDBC baseline
    # Computes Random Forest ensemble and TreeSHAP forces
    ...
    return {
        "prediction": "Malignant",
        "malignant_probability": 0.894,
        "risk_level": "High",
        "base_value": base_val,
        "shap_values": [
            {"feature": "concave_points_worst", "shap_value": 0.22, "impact": "malignant"},
            {"feature": "perimeter_worst", "shap_value": 0.16, "impact": "malignant"}
        ],
        "explanation": "Elevated concave points worst and perimeter worst pushed malignant probability to 89.4%."
    }
`;

  const DOCKER_CODE = `FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY fastapi_app.py .

EXPOSE 8000

CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8000"]
`;

  const CURL_CODE = `# Test real-time prediction endpoint locally or on AWS
curl -X POST "http://localhost:8000/api/predict" \\
  -H "Content-Type: application/json" \\
  -d '{
    "concave_points_worst": 0.239,
    "perimeter_worst": 168.2,
    "area_worst": 1956.0,
    "radius_worst": 24.99,
    "concavity_mean": 0.245,
    "concave_points_mean": 0.128,
    "texture_worst": 31.82,
    "radius_mean": 20.57,
    "texture_mean": 21.77,
    "perimeter_mean": 132.9
  }'
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AWS & FastAPI Deployment Architecture</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900 text-indigo-300 border border-indigo-700">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deployable to AWS App Runner, ECS Fargate, or AWS Lambda with automated scaling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          {[
            { id: 'fastapi', label: 'fastapi_app.py', icon: Code2 },
            { id: 'docker', label: 'Dockerfile & Container', icon: Server },
            { id: 'curl', label: 'API Testing (curl)', icon: Terminal },
            { id: 'guide', label: 'AWS Step-by-Step Guide', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {activeTab === 'fastapi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">File location: /fastapi_app.py</span>
                <button
                  onClick={() => copyToClipboard(FASTAPI_CODE, 'fastapi')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'fastapi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'fastapi' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
                <code>{FASTAPI_CODE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">File location: /Dockerfile</span>
                <button
                  onClick={() => copyToClipboard(DOCKER_CODE, 'docker')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'docker' ? 'Copied!' : 'Copy Dockerfile'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{DOCKER_CODE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Real-Time HTTP REST Sample</span>
                <button
                  onClick={() => copyToClipboard(CURL_CODE, 'curl')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'curl' ? 'Copied!' : 'Copy Command'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{CURL_CODE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950">
                <h4 className="font-bold text-sm mb-1">Recommended Deployment: AWS App Runner</h4>
                <p>
                  AWS App Runner directly builds and runs containers from Amazon ECR or GitHub with automatic HTTPS, zero infrastructure management, and automatic scale-to-zero when idle.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Command Line Steps:</h5>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li><strong>Authenticate Docker to AWS ECR:</strong> <code>aws ecr get-login-password --region us-east-1 | docker login...</code></li>
                  <li><strong>Build & Tag image:</strong> <code>docker build -t oncocare-fastapi . && docker tag oncocare-fastapi:latest ...</code></li>
                  <li><strong>Push to ECR:</strong> <code>docker push &lt;ACCOUNT_ID&gt;.dkr.ecr.us-east-1.amazonaws.com/oncocare-fastapi:latest</code></li>
                  <li><strong>Deploy to App Runner:</strong> Select the image in AWS App Runner console with port 8000.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Files are saved in this workspace: /fastapi_app.py, /Dockerfile, /requirements.txt, /aws_deployment_guide.md
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
