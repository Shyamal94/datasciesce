import React, { useState } from 'react';
import { WHO_GLOBAL_STATS, WHO_TOP_COUNTRIES, STAGE_SURVIVAL_RATES, WHO_PILLARS } from '../../data/whoData';
import { Globe, Users, Skull, Activity, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Search, Filter } from 'lucide-react';

interface PatientHomeProps {
  onGoToAssessment: () => void;
  onGoToML: () => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({ onGoToAssessment, onGoToML }) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const continents = ['All', 'Europe', 'Americas', 'Asia', 'Oceania'];

  const filteredCountries = WHO_TOP_COUNTRIES.filter((c) => {
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
    const matchesSearch = c.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-teal-700/50">
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/15 border border-teal-300/30 text-teal-200 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            Official WHO & IARC Global Surveillance Report
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Breast Cancer Intelligence & Detection Portal
          </h1>
          
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal">
            Real-time epidemiologic data from the World Health Organization (WHO), personal risk assessment, 
            oncologic precaution guidelines, and cytologic machine learning analysis powered by the 
            Wisconsin Diagnostic Breast Cancer dataset with SHAP explainability.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onGoToAssessment}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2"
            >
              Start Patient Clinical Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToML}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              Run UCI Machine Learning & SHAP
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Required Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              WHO Global Breast Cancer Key Indicators
            </h2>
            <p className="text-xs text-slate-500">
              Verified clinical metrics sourced from WHO Global Health Observatory & GLOBOCAN Database
            </p>
          </div>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 hidden sm:inline">
            Updated for 2024–2026 Reporting Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Cases in the Year */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Total Cases / Year</span>
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {WHO_GLOBAL_STATS.annualCasesFormatted}
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                New cases diagnosed worldwide annually, representing <span className="font-semibold text-slate-700">11.7%</span> of all new cancer cases.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                #1 most commonly occurring cancer in women
              </div>
            </div>
          </div>

          {/* Card 2: Highest Ratio Country */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Highest Ratio Country</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {WHO_GLOBAL_STATS.highestRatioCountry} 🇧🇪
                </div>
              </div>
              <div className="text-xs font-semibold text-indigo-900">
                {WHO_GLOBAL_STATS.highestRatioValue} (Age-Standardized)
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Followed closely by Netherlands (105.9), France (102.5), and USA (97.8 per 100k).
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-indigo-700 font-medium">
                <span>Reflects high mammography screening rate</span>
              </div>
            </div>
          </div>

          {/* Card 3: Deaths in 1 Day */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Daily Mortality</span>
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Skull className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-600 tracking-tight">
                {WHO_GLOBAL_STATS.dailyDeathsFormatted}
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Calculated from <span className="font-semibold text-slate-700">{WHO_GLOBAL_STATS.annualDeathsFormatted}</span> annual deaths globally (1 death every 47 seconds).
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                70% occur in low- & middle-income countries
              </div>
            </div>
          </div>

          {/* Card 4: Active Cases of this Year / 5-Yr Prevalence */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Active Living Cases</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {WHO_GLOBAL_STATS.activePrevalence5YrFormatted}
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Women currently alive diagnosed with breast cancer within the past 5 years.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Largest prevalent cancer group in the world
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Survival Rate Comparison by Stage (Why Early Detection Matters) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Early Intervention Impact</span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            5-Year Relative Survival Rate by Diagnosis Stage
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Detecting breast cancer at Stage I before metastasis provides an astounding 99% cure/survival rate,
            reinforcing the critical role of timely clinical assessment and algorithmic cytologic screening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STAGE_SURVIVAL_RATES.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-800">{item.stage}</span>
                  <span className={`text-sm font-black ${
                    item.fiveYearSurvival >= 90 ? 'text-emerald-600' : item.fiveYearSurvival >= 70 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {item.fiveYearSurvival}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.fiveYearSurvival >= 90 ? 'bg-emerald-500' : item.fiveYearSurvival >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.fiveYearSurvival}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Country Incidence Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Country-Wise Breast Cancer Incidence & Mortality Ratios
            </h3>
            <p className="text-xs text-slate-500">
              Age-standardized rate (ASR) per 100,000 females (WHO International Agency for Research on Cancer)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Continent filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {continents.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedContinent(c)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedContinent === c ? 'bg-white font-bold text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Country / Territory</th>
                <th className="py-3 px-4 text-right">Incidence Ratio (per 100k)</th>
                <th className="py-3 px-4 text-right">Estimated Annual Cases</th>
                <th className="py-3 px-4 text-right">Annual Deaths</th>
                <th className="py-3 px-4 text-center">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCountries.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-500">#{c.rank}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flagEmoji}</span>
                      <span className="font-bold text-slate-900">{c.country}</span>
                      <span className="text-[10px] text-slate-400">({c.continent})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {c.ratePer100k}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                    {c.totalAnnualCases.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-700 font-semibold">
                    {c.annualDeaths.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.ratePer100k >= 100
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : c.ratePer100k >= 80
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {c.ratePer100k >= 100 ? 'Very High Ratio' : c.ratePer100k >= 80 ? 'Elevated' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHO Global Breast Cancer Initiative (GBCI) 3 Pillars */}
      <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 rounded-2xl p-6 border border-teal-200/80">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Global Health Action Framework
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
          WHO Global Breast Cancer Initiative (GBCI) Strategy
        </h3>
        <p className="text-xs text-slate-600 mb-6 max-w-3xl">
          The WHO target aims to reduce annual breast cancer mortality by 2.5% per year, which will avert 2.5 million deaths 
          globally over a 20-year span by adhering to three integrated pillars:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WHO_PILLARS.map((pillar) => (
            <div key={pillar.id} className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                {pillar.title}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{pillar.subtitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
