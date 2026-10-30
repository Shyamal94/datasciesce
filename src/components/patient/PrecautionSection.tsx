import React, { useState } from 'react';
import { ShieldAlert, Ban, CheckCircle2, Heart, Dumbbell, Apple, Wine, Flame, AlertCircle, Sparkles } from 'lucide-react';

export const PrecautionSection: React.FC = () => {
  // Interactive habit self-check
  const [habitState, setHabitState] = useState<Record<string, boolean>>({
    noSmoke: true,
    noAlcohol: true,
    healthyDiet: true,
    weeklyExercise: false,
    healthyBmi: true,
    regularCheckup: false,
  });

  const toggleHabit = (key: string) => {
    setHabitState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(habitState).filter(Boolean).length;
  const healthScore = Math.round((completedCount / 6) * 100);

  const RESTRICTIONS = [
    {
      title: 'Zero or Strictly Limited Alcohol Consumption',
      tag: 'Strict Precaution',
      why: 'Alcohol increases levels of estrogen and other hormones associated with hormone-receptor-positive breast cancer. It also damages cellular DNA via acetaldehyde production. Even 1 alcoholic drink per day increases relative breast cancer risk by 7% to 10%.',
      rule: 'Avoid alcoholic beverages completely or limit to rare celebrations.',
      icon: Wine,
    },
    {
      title: 'Complete Avoidance of Tobacco Smoking & Vaping',
      tag: 'Strict Precaution',
      why: 'Tobacco smoke contains over 70 recognized chemical carcinogens that penetrate breast tissue and bind to DNA. Heavy smoking—particularly starting before a first full-term pregnancy—significantly elevates invasive breast cancer risk.',
      rule: 'Zero tobacco use and avoidance of prolonged passive secondhand smoke.',
      icon: Flame,
    },
    {
      title: 'Elimination of Deep-Fried, Trans-Fat & Ultra-Processed Foods',
      tag: 'Dietary Precaution',
      why: 'Commercial deep frying at high temperatures generates polycyclic aromatic hydrocarbons (PAHs) and trans-fatty acids. High dietary glycemic load and industrial trans-fats trigger systemic inflammation, insulin resistance, and elevated insulin-like growth factor-1 (IGF-1), which promotes tumor cell proliferation.',
      rule: 'Eliminate hydrogenated vegetable oils, commercial fast food, and high-fructose packaged snacks.',
      icon: Ban,
    },
    {
      title: 'Avoidance of Sedentary Behavior & Prolonged Inactivity',
      tag: 'Lifestyle Precaution',
      why: 'Physical inactivity fosters visceral adiposity, hyperinsulinemia, and elevated circulating estrogens. Prolonged daily sitting without movement impairs metabolic rate and immune tumor surveillance.',
      rule: 'Break up sitting every 45 minutes; aim for at least 7,000 to 10,000 steps daily.',
      icon: Ban,
    },
    {
      title: 'Caution with Unmonitored Hormone Replacement Therapy (HRT)',
      tag: 'Endocrine Precaution',
      why: 'Long-term combined estrogen-plus-progestin therapy (>3 to 5 years) has been clinically shown by the Women’s Health Initiative to elevate breast cancer incidence and breast density.',
      rule: 'Only use lowest effective HRT dose under close gynecologic supervision.',
      icon: AlertCircle,
    },
  ];

  const PROTECTIVE_ACTIONS = [
    {
      title: 'Prescribed Exercise Regimen (150–300 Mins / Week)',
      desc: 'Engage in at least 150 minutes of moderate aerobic exercise (brisk walking, cycling, swimming) or 75 minutes of vigorous exercise weekly, plus resistance strength training twice a week. Physical activity reduces circulating estrogen and insulin levels by up to 25%.',
      icon: Dumbbell,
      badge: 'Reduces Risk by ~20%',
    },
    {
      title: 'Antioxidant & Polyphenol-Rich Plant-Forward Diet',
      desc: 'Follow a Mediterranean-style pattern: cruciferous vegetables (broccoli, cabbage, kale containing sulforaphane), berries rich in anthocyanins, wild salmon (omega-3 fatty acids), olive oil, and fiber-rich legumes that bind and eliminate excess estrogens in the digestive tract.',
      icon: Apple,
      badge: 'Cellular Protection',
    },
    {
      title: 'Maintaining a Healthy Body Mass Index (BMI 18.5–24.9)',
      desc: 'After menopause, adipose (fat) tissue becomes the body’s primary source of estrogen production via the aromatase enzyme. Maintaining healthy body composition significantly curtails circulating estrogen and chronic low-grade inflammation.',
      icon: Heart,
      badge: 'Metabolic Shield',
    },
    {
      title: 'Protective Effect of Cumulative Breastfeeding',
      desc: 'Women who breastfeed have a lower risk of developing both ER-positive and triple-negative breast cancer. Lactation sheds cell layers with potential DNA mutations and delays the resumption of regular ovulatory menstrual cycles.',
      icon: Sparkles,
      badge: '4.3% Drop per 12 Mo',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
          Evidence-Based Preventive Oncology
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Precaution & Lifestyle Prevention Section
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Scientific consensus reveals that up to <span className="font-bold text-slate-800">30% to 40% of all breast cancers</span> are 
          preventable through proactive lifestyle modifications, dietary adherence, and avoiding high-risk carcinogenic triggers.
        </p>
      </div>

      {/* Interactive Habit Tracker & Score Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-teal-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-teal-800/70">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Self-Audit Tool</span>
            <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
              Your Daily Breast Health Protective Score
            </h3>
            <p className="text-xs text-teal-200/80 mt-1">
              Check off your regular preventative habits to calculate your protective defense score:
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/15">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{healthScore}%</div>
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold">Protective Index</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-6">
          {[
            { key: 'noSmoke', label: 'Zero Tobacco / No Smoking', icon: Flame },
            { key: 'noAlcohol', label: 'Zero / Minimal Alcohol', icon: Wine },
            { key: 'healthyDiet', label: 'No Fried / Junk Food (Plant-Rich)', icon: Apple },
            { key: 'weeklyExercise', label: '150+ Mins Exercise / Week', icon: Dumbbell },
            { key: 'healthyBmi', label: 'Maintain Healthy BMI Range', icon: Heart },
            { key: 'regularCheckup', label: 'Monthly Self-Exam / Routine Screen', icon: Sparkles },
          ].map((item) => {
            const isChecked = habitState[item.key];
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleHabit(item.key)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isChecked
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-white font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-emerald-400 text-slate-950 font-bold' : 'border border-white/30'
                }`}>
                  {isChecked ? '✓' : ''}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Icon className="w-4 h-4 text-teal-300" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 1: What We DON'T Have to Do (Strict Restrictions) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              What We DON'T Have to Do (Strict Avoidance Guidelines)
            </h3>
            <p className="text-xs text-slate-500">
              Clear clinical guidelines on high-risk carcinogenic triggers to eliminate from daily life
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESTRICTIONS.map((res, i) => {
            const Icon = res.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {res.tag}
                    </span>
                    <Icon className="w-4 h-4 text-rose-500" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{res.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.why}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-rose-700 bg-rose-50/60 p-2.5 rounded-lg">
                  🚫 {res.rule}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: What We MUST Do (Protective Lifestyle Interventions) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              What We HAVE to Do (Protective Lifestyle Habits)
            </h3>
            <p className="text-xs text-slate-500">
              Evidence-based oncologic habits proven to strengthen cellular resilience and immune defense
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROTECTIVE_ACTIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.badge}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
