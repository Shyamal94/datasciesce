import React, { useState } from 'react';
import { UCIFeatures, PredictionResult } from '../../types';
import { UCI_FEATURE_METADATA, BENCHMARK_SAMPLES } from '../../data/uciModelData';
import { predictBreastCancer } from '../../services/rfClassifier';
import { Cpu, Sparkles, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, HelpCircle, Layers, Activity, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const NumericalAnalysis: React.FC = () => {
  // Initial feature state using benign benchmark
  const [features, setFeatures] = useState<UCIFeatures>(BENCHMARK_SAMPLES[0].features);
  const [selectedPreset, setSelectedPreset] = useState<string>(BENCHMARK_SAMPLES[0].id);
  const [result, setResult] = useState<PredictionResult>(() => predictBreastCancer(BENCHMARK_SAMPLES[0].features));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeExplainTab, setActiveExplainTab] = useState<'waterfall' | 'force' | 'table'>('waterfall');

  const handleFeatureChange = (key: keyof UCIFeatures, value: number) => {
    setSelectedPreset('custom');
    setFeatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = BENCHMARK_SAMPLES.find((b) => b.id === presetId);
    if (found) {
      setSelectedPreset(presetId);
      setFeatures(found.features);
      const res = predictBreastCancer(found.features);
      setResult(res);
    }
  };

  const handleRunInference = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = predictBreastCancer(features);
      setResult(res);
      setIsAnalyzing(false);
    }, 350);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              Machine Learning Cytologic Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              UCI WDBC Numerical Analysis & Random Forest Classifier
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Input fine-needle aspirate (FNA) nuclear features. Our Random Forest ensemble model 
              evaluates malignancy risk, followed by authentic <span className="font-bold text-slate-800">TreeSHAP (SHapley Additive exPlanations)</span> 
              to provide transparent, explainable reasoning behind every clinical decision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block w-full lg:w-auto">
              Benchmark Presets:
            </span>
            {BENCHMARK_SAMPLES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedPreset === preset.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form (Left 5 cols) & Prediction / SHAP Display (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Nuclear Feature Input Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                Fine Needle Aspirate (FNA) Features
              </h3>
              <p className="text-[11px] text-slate-500">
                Derived from digitized high-resolution cytologic cell nuclei (UCI WDBC)
              </p>
            </div>
            <button
              onClick={handleRunInference}
              disabled={isAnalyzing}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Re-Calculate
            </button>
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
            {UCI_FEATURE_METADATA.map((meta) => {
              const currentVal = features[meta.key];
              const isAboveOverall = currentVal > meta.overallMean;
              const isAboveMalignant = currentVal >= meta.malignantMean;

              return (
                <div key={meta.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{meta.label}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({meta.unit})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={meta.min}
                        max={meta.max}
                        step={meta.step}
                        value={currentVal}
                        onChange={(e) => handleFeatureChange(meta.key, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={currentVal}
                    onChange={(e) => handleFeatureChange(meta.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />

                  {/* Clinical reference thresholds */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Benign Avg: {meta.benignMean}</span>
                    <span className={`font-semibold ${
                      isAboveMalignant ? 'text-rose-600' : isAboveOverall ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {isAboveMalignant ? '⚠️ Malignant Zone' : isAboveOverall ? 'Moderate' : '✓ Normal Benign'}
                    </span>
                    <span>Malignant Avg: {meta.malignantMean}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunInference}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              {isAnalyzing ? 'Running Random Forest Model...' : 'Execute Random Forest & Compute SHAP'}
            </button>
          </div>
        </div>

        {/* Right: Output Diagnostic Card & SHAP Explanations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Diagnostic Result Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Model Diagnostic Output
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className={`text-3xl font-black tracking-tight ${
                    result.prediction === 'Malignant' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {result.prediction.toUpperCase()}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    result.prediction === 'Malignant'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    Risk Tier: {result.riskLevel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Model Certainty</div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {result.confidence}%
                </div>
                <div className="text-[11px] text-slate-500">
                  Ensemble Tree Agreement
                </div>
              </div>
            </div>

            {/* Probability Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Benign Probability: {(result.benignProb * 100).toFixed(1)}%
                </span>
                <span className="text-rose-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Malignant Probability: {(result.malignantProb * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full h-3.5 bg-emerald-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${result.benignProb * 100}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${result.malignantProb * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>0.0 (Benign)</span>
                <span>Clinical Decision Threshold (0.50)</span>
                <span>1.0 (Malignant)</span>
              </div>
            </div>

            {/* Doctor Clinical Natural Language Explanation */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              result.prediction === 'Malignant'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1 text-slate-900 uppercase text-[11px]">
                <Activity className="w-3.5 h-3.5 text-teal-700" />
                Oncologist Decision Summary & Recommendation:
              </div>
              {result.clinicalExplanation}
            </div>
          </div>

          {/* SHAP Explainability Engine */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  SHAP (SHapley Additive exPlanations)
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Why Did the Model Produce This Output?
                </h3>
                <p className="text-xs text-slate-500">
                  Decomposing model prediction into individual Shapley feature contributions ($f(x) = E[f(x)] + \sum \phi_i$)
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveExplainTab('waterfall')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeExplainTab === 'waterfall' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Waterfall Plot
                </button>
                <button
                  onClick={() => setActiveExplainTab('force')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeExplainTab === 'force' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Force Plot
                </button>
                <button
                  onClick={() => setActiveExplainTab('table')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeExplainTab === 'table' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Feature Table
                </button>
              </div>
            </div>

            {/* Baseline Context Ribbon */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div>
                <span className="font-bold text-slate-800">Base Value $E[f(x)]$:</span>{' '}
                <span className="font-mono font-semibold text-slate-900">{(result.baseValue * 100).toFixed(1)}%</span>{' '}
                <span className="text-[11px] text-slate-400">(UCI baseline malignant prevalence)</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">Predicted $f(x)$:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{(result.malignantProb * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* View 1: SHAP Waterfall Plot */}
            {activeExplainTab === 'waterfall' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>Feature & Value</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Pulls to Benign (-)
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Pushes to Malignant (+)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {result.shapValues.map((item, idx) => {
                    const isPositive = item.shapValue > 0;
                    const barWidth = Math.min(100, Math.abs(item.shapValue) * 350);

                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{item.featureLabel}</span>
                            <span className="font-mono text-slate-500 text-[11px]">
                              = {item.patientValue} {item.unit}
                            </span>
                          </div>
                          <span className={`font-mono font-bold text-xs ${
                            isPositive ? 'text-rose-600' : 'text-emerald-600'
                          }`}>
                            {isPositive ? `+${(item.shapValue * 100).toFixed(1)}%` : `${(item.shapValue * 100).toFixed(1)}%`}
                          </span>
                        </div>

                        {/* Relative contribution horizontal bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                          {isPositive ? (
                            <>
                              <div className="h-full bg-transparent" style={{ width: '50%' }} />
                              <div
                                className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
                                style={{ width: `${barWidth / 2}%` }}
                              />
                            </>
                          ) : (
                            <>
                              <div className="h-full bg-transparent" style={{ width: `${50 - barWidth / 2}%` }} />
                              <div
                                className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
                                style={{ width: `${barWidth / 2}%` }}
                              />
                            </>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500 leading-tight pt-0.5">
                          {item.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 2: SHAP Force Plot */}
            {activeExplainTab === 'force' && (
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Dual Opposing Forces Diagram
                  </h4>
                  <p className="text-xs text-slate-500">
                    Blue forces pull the decision toward Benign (negative SHAP), while red forces push the score toward Malignant (positive SHAP).
                  </p>

                  {/* Visual Force Balance Bar */}
                  <div className="relative pt-6 pb-2">
                    <div className="flex h-8 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
                      {/* Left: Benign contributors */}
                      <div className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold px-2 truncate transition-all duration-500" style={{ width: `${result.benignProb * 100}%` }}>
                        Benign Forces ({(result.benignProb * 100).toFixed(0)}%)
                      </div>
                      {/* Right: Malignant contributors */}
                      <div className="bg-rose-500 flex items-center justify-center text-white text-xs font-bold px-2 truncate transition-all duration-500" style={{ width: `${result.malignantProb * 100}%` }}>
                        Malignant Forces ({(result.malignantProb * 100).toFixed(0)}%)
                      </div>
                    </div>

                    {/* Indicator pointer */}
                    <div
                      className="absolute top-1 text-xs font-mono font-bold text-slate-900 transition-all duration-500 -translate-x-1/2"
                      style={{ left: `${result.malignantProb * 100}%` }}
                    >
                      ▼ f(x)={(result.malignantProb * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold text-emerald-900 block text-[11px] uppercase">Top Benign Anchors:</span>
                      {result.shapValues.filter((s) => s.shapValue < 0).slice(0, 3).map((s, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span>{s.featureLabel}:</span>
                          <span className="font-bold font-mono">{(s.shapValue * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-950 space-y-1">
                      <span className="font-bold text-rose-900 block text-[11px] uppercase">Top Malignant Drivers:</span>
                      {result.shapValues.filter((s) => s.shapValue > 0).slice(0, 3).map((s, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span>{s.featureLabel}:</span>
                          <span className="font-bold font-mono">+{(s.shapValue * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Feature Table */}
            {activeExplainTab === 'table' && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Feature</th>
                      <th className="py-2.5 px-3 text-right">Patient Value</th>
                      <th className="py-2.5 px-3 text-right">UCI Benign Avg</th>
                      <th className="py-2.5 px-3 text-right">UCI Malignant Avg</th>
                      <th className="py-2.5 px-3 text-right">SHAP Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {result.shapValues.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{item.featureLabel}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">{item.patientValue} {item.unit}</td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700">{item.benignMean}</td>
                        <td className="py-2 px-3 text-right font-mono text-rose-700">{item.malignantMean}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            item.shapValue > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.shapValue > 0 ? `+${(item.shapValue * 100).toFixed(1)}%` : `${(item.shapValue * 100).toFixed(1)}%`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
