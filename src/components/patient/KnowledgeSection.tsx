import React, { useState } from 'react';
import { BookOpen, Dna, Activity, Search, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, XCircle, Info } from 'lucide-react';

export const KnowledgeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'causes' | 'pathophysiology' | 'anatomy' | 'selfexam' | 'myths'>('causes');

  const CAUSES = [
    {
      title: 'Hereditary Genetic Mutations (BRCA1, BRCA2 & PALB2)',
      category: 'Genetic',
      desc: 'About 5% to 10% of breast cancers are hereditary, caused by abnormal gene mutations passed down from parents. BRCA1 and BRCA2 mutations carry a 45%–72% lifetime risk of breast cancer compared to ~12% in the general population.',
      icon: 'Dna',
      actionable: 'Genetic counseling and multigene panel testing are recommended if a first-degree relative was diagnosed before age 50.',
    },
    {
      title: 'Prolonged Hormonal Estrogen & Progesterone Exposure',
      category: 'Endocrine',
      desc: 'Estrogen stimulates breast cell proliferation. Risk increases with early menarche (before age 12), late natural menopause (after age 55), nulliparity (not having children), or having a first child after age 30.',
      icon: 'Activity',
      actionable: 'Breastfeeding for 12+ cumulative months helps reset cellular cycles and lowers lifetime estrogen burden.',
    },
    {
      title: 'Advancing Age & Gender Biology',
      category: 'Demographic',
      desc: 'Age is one of the most prominent non-modifiable risk factors. While breast cancer can develop in young women and rarely in men (<1%), over 80% of clinical cases occur in individuals aged 50 and above.',
      icon: 'Info',
      actionable: 'Annual or biennial mammography is recommended starting between ages 40 and 50 depending on personal risk guidelines.',
    },
    {
      title: 'High Breast Tissue Density (BI-RADS Category D)',
      category: 'Morphological',
      desc: 'Dense breasts have higher amounts of glandular and fibrous connective tissue relative to fatty tissue. Dense tissue not only harbors more cells prone to malignancy, but also masks small tumors on standard mammograms (the "white-out" effect).',
      icon: 'Search',
      actionable: 'Women with dense breasts benefit from supplemental screening using automated 3D breast tomosynthesis (DBT) or ultrasound.',
    },
    {
      title: 'Environmental Carcinogens & Prior Mantle Radiation',
      category: 'Environmental',
      desc: 'Women who underwent chest radiation therapy during childhood or adolescence (such as for Hodgkin lymphoma) have a significantly higher risk of developing breast neoplasms later in life.',
      icon: 'ShieldCheck',
      actionable: 'Early MRI surveillance starting at age 25 or 8 years post-radiation is clinically recommended.',
    },
  ];

  const PATHWAY_STEPS = [
    {
      step: '01',
      title: 'DNA Mutation & Loss of Cell Cycle Checkpoints',
      subtitle: 'Molecular Initiation',
      detail: 'Normal breast epithelial cells acquire somatic or inherited DNA alterations (e.g., in TP53, PIK3CA, or HER2 amplification). The damaged cell bypasses cellular apoptosis (programmed cell death) and gains continuous self-renewing signals.',
    },
    {
      step: '02',
      title: 'Atypical Hyperplasia & Cellular Crowding',
      subtitle: 'Pre-Malignant Proliferation',
      detail: 'Mutated cells multiply rapidly within the terminal ductal lobular units (TDLU). The cells become stacked and mildly disorganized, expanding the lumen without invading the basement membrane.',
    },
    {
      step: '03',
      title: 'Ductal Carcinoma In Situ (DCIS)',
      subtitle: 'Non-Invasive Stage 0',
      detail: 'Malignant cells completely fill the mammary ducts. At this stage, the tumor is entirely confined inside the ductal lining and cannot spread to lymph nodes or distant organs. Highly curable with lumpectomy.',
    },
    {
      step: '04',
      title: 'Basement Membrane Breakdown & Micro-Invasion',
      subtitle: 'Invasive Carcinoma (IDC / ILC)',
      detail: 'Tumor cells secrete matrix metalloproteinases (MMPs), dissolving the collagen basement membrane. Cancer cells infiltrate the breast fatty stroma, gaining direct access to lymphatic channels and capillaries.',
    },
    {
      step: '05',
      title: 'Lymphatic Dissemination & Distant Metastasis',
      subtitle: 'Systemic Spread (Stage III–IV)',
      detail: 'Malignant cells travel through the sentinel lymph nodes in the axilla (underarm). If untreated, circulating tumor cells (CTCs) extravasate into secondary target organs, most commonly bone marrow, liver, lungs, and brain.',
    },
  ];

  const MYTHS_AND_FACTS = [
    {
      myth: 'Only women with a family history of breast cancer need to worry about it.',
      fact: 'FACT: Approximately 85% of women who develop breast cancer have NO prior family history. Most cases result from sporadic somatic gene mutations that accumulate over lifetime exposure.',
    },
    {
      myth: 'Finding a breast lump always means you have malignant breast cancer.',
      fact: 'FACT: Over 80% of biopsied breast lumps turn out to be completely benign, such as harmless cysts, fibroadenomas, or hormonal fibrocystic tissue changes.',
    },
    {
      myth: 'Wearing underwire bras or using antiperspirants causes breast cancer.',
      fact: 'FACT: Decades of rigorous epidemiologic studies (including American Cancer Society reviews) confirm no scientific connection between antiperspirants or underwire bras and breast cancer.',
    },
    {
      myth: 'Mammograms cause cancer to spread because of breast compression or radiation.',
      fact: 'FACT: Mammography involves a tiny, regulated dose of radiation (equivalent to ~7 weeks of natural background radiation). Compression is essential for sharp diagnostic images and does not dislodge tumor cells.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          Clinical Oncology Education & Etiology
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Comprehensive Breast Cancer Knowledge Section
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Understand the biological mechanisms, genetic triggers, pathophysiological transformation 
          from normal ductal epithelium to invasive carcinoma, and clinical guidelines for early detection.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {[
            { id: 'causes', label: 'Causes & Etiology', icon: Dna },
            { id: 'pathophysiology', label: 'How Cancer Happens', icon: Activity },
            { id: 'selfexam', label: 'Self-Examination Guide', icon: Search },
            { id: 'myths', label: 'Myths vs Scientific Facts', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Causes */}
      {activeTab === 'causes' && (
        <div className="space-y-4">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-slate-900">What Causes Breast Cancer?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breast cancer results from DNA damage causing uncontrolled division in milk-producing glands (lobules) or drainage pathways (ducts).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAUSES.map((cause, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {cause.category} Factor
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{cause.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{cause.desc}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 bg-teal-50/50 p-2.5 rounded-lg flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Clinical Precaution:</strong> {cause.actionable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Pathophysiology - How Cancer Happens */}
      {activeTab === 'pathophysiology' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Oncogenesis Timeline</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Pathophysiology: Step-by-Step Disease Progression
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              How a healthy mammary epithelial cell transforms into an invasive malignancy over months to years:
            </p>
          </div>

          <div className="relative border-l-2 border-teal-500 ml-4 pl-6 space-y-8">
            {PATHWAY_STEPS.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                  {step.step}
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-teal-300 transition-colors">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                    <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      {step.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5 text-teal-700 shrink-0" />
            <p className="text-xs text-teal-950 leading-relaxed">
              <strong>Key Takeaway:</strong> Because breast cancer often stays localized as Carcinoma In Situ (DCIS) for an extended period, 
              regular screening allows intervention before the basement membrane is breached, preventing metastasis entirely.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Self-Exam Guide */}
      {activeTab === 'selfexam' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Monthly Breast Self-Examination (BSE) Protocol
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perform this exam once a month, ideally 3 to 5 days after your menstrual cycle ends when breast tissue is least tender or swollen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center">1</div>
              <h4 className="font-bold text-sm text-slate-900">Mirror Visual Inspection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stand before a mirror with shoulders straight and arms on your hips. Inspect both breasts for:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                <li>Changes in shape, size, or symmetry</li>
                <li>Skin dimpling, puckering, or bulging</li>
                <li>Nipple inversion or position shift</li>
                <li>Redness, rash, or soreness</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center">2</div>
              <h4 className="font-bold text-sm text-slate-900">Palpation While Lying Down</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lie on your back. Breast tissue spreads evenly over the chest wall, making deep lumps easier to feel.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                <li>Use finger pads of middle 3 fingers</li>
                <li>Apply light, medium, and firm pressure</li>
                <li>Move in overlapping vertical strips</li>
                <li>Cover entire area collarbone to ribs</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center">3</div>
              <h4 className="font-bold text-sm text-slate-900">Shower & Underarm Sweep</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Soapy water reduces skin friction and allows fingers to glide effortlessly over tissue.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                <li>Raise one arm behind head</li>
                <li>Check for axillary (underarm) nodes</li>
                <li>Gently check nipples for spontaneous discharge</li>
                <li>Repeat symmetrically for other breast</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Myths vs Scientific Facts */}
      {activeTab === 'myths' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Common Myths vs. Scientific Evidence
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Debunking misinformation with peer-reviewed clinical research and oncology consensus:
            </p>
          </div>

          <div className="space-y-4">
            {MYTHS_AND_FACTS.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-start gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold line-through">MYTH: "{item.myth}"</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="text-xs leading-relaxed font-medium">{item.fact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
