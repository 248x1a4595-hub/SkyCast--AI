import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CloudRain,
  Wind,
  Zap,
  PhoneCall,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  Volume2,
  HelpCircle,
  Radio,
  Share2,
} from 'lucide-react';
import { DisasterAlert, DisasterAssessment, GeoLocation, Language } from '../types/weather';

interface DisasterAlertsViewProps {
  alerts: DisasterAlert[];
  assessment: DisasterAssessment | null;
  location: GeoLocation;
  lang?: Language;
}

export const DisasterAlertsView: React.FC<DisasterAlertsViewProps> = ({
  alerts,
  assessment,
  location,
  lang = 'en',
}) => {
  const isTelugu = lang === 'te';

  // Interactive Checklist State
  const [completedChecklist, setCompletedChecklist] = useState<Record<number, boolean>>({});

  // Simulated Emergency Drill Mode
  const [drillActive, setDrillActive] = useState<boolean>(false);
  const [drillType, setDrillType] = useState<'cyclone' | 'flood' | 'heatwave'>('cyclone');

  const toggleChecklist = (index: number) => {
    setCompletedChecklist((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Base emergency contacts
  const emergencyHotlines = [
    { title: 'National Emergency Helpline', number: '112', desc: 'Unified 24x7 Disaster, Police & Medical Dispatch' },
    { title: 'Disaster Management (NDRF / SDMA)', number: '1070 / 1078', desc: 'Flood relief, cyclone evacuation & rescue' },
    { title: 'Fire & Rescue Service', number: '101', desc: 'Urban search, electrical fires & fallen trees' },
    { title: 'Ambulance & Trauma Care', number: '108', desc: 'Emergency medical services & mobile ICU' },
  ];

  // Default simulated drill alerts
  const simulatedDrillAlerts: Record<string, DisasterAlert> = {
    cyclone: {
      id: 'drill-cyclone-super',
      title: isTelugu ? 'నమూనా డ్రిల్: తీవ్ర తుఫాను హెచ్చరిక (Category 3)' : 'SIMULATION DRILL: Very Severe Cyclonic Storm (Cat 3)',
      threatLevel: 'Critical',
      type: 'Cyclone / Gale Storm',
      severity: 'Warning',
      description: isTelugu
        ? `సిమ్యులేషన్ పరీక్ష: తీరం దాటబోతున్న తుఫాను కారణంగా గంటకు 120-140 కి.మీ వేగంతో బలమైన ఈదురు గాలులు మరియు భారీ వర్షపాతం నమోదవుతాయి.`
        : `Drill scenario: Cyclone eye approaching within 150 km. Gale squalls peaking at 135 km/h, storm surge up to 2.5 meters.`,
      safetyInstruction: isTelugu
        ? 'లోతట్టు ప్రాంతాల ప్రజలు వెంటనే తుఫాను పునరావాస కేంద్రాలకు వెళ్లాలి. మత్స్యకారులు వేటకు వెళ్లకూడదు.'
        : 'Evacuate vulnerable mud/thatched dwellings. Move to designated storm shelters. Secure food, potable water, and emergency medication.',
      effectiveTime: 'DRILL MODE ACTIVE',
      area: location.name,
    },
    flood: {
      id: 'drill-flood-flash',
      title: isTelugu ? 'నమూనా డ్రిల్: ఆకస్మిక వరద & నదీ ప్రవాహ హెచ్చరిక' : 'SIMULATION DRILL: Red Warning - Flash Flood Inundation',
      threatLevel: 'Critical',
      type: 'Flash Flood Hazard',
      severity: 'Warning',
      description: isTelugu
        ? `సిమ్యులేషన్ పరీక్ష: ఎగువ ప్రాజెక్టుల నుండి భారీగా నీరు విడుదల. లోతట్టు గ్రామాలు మరియు పట్టణ ప్రాంతాలు మునిగిపోయే ప్రమాదం.`
        : `Drill scenario: Reservoir water discharge exceeds crest levels. Immediate runoff inundation expected along natural drainages and floodplains.`,
      safetyInstruction: isTelugu
        ? 'పై అంతస్తులకు లేదా ఎత్తైన ప్రదేశాలకు చేరుకోండి. విద్యుత్ మెయిన్ స్విచ్ ఆఫ్ చేయండి.'
        : 'Ascend to higher elevations or multi-story pucca buildings. Cut main circuit breakers. Do not walk into moving current.',
      effectiveTime: 'DRILL MODE ACTIVE',
      area: location.name,
    },
    heatwave: {
      id: 'drill-heatwave-extreme',
      title: isTelugu ? 'నమూనా డ్రిల్: రెడ్ అలర్ట్ తీవ్ర వడగాల్పులు' : 'SIMULATION DRILL: Red Alert - Extreme Thermal Wave',
      threatLevel: 'Severe',
      type: 'Severe Heatwave',
      severity: 'Warning',
      description: isTelugu
        ? `సిమ్యులేషన్ పరీక్ష: ఉష్ణోగ్రతలు 45°C దాటి నమోదవుతున్నాయి. తీవ్రమైన వడదెబ్బ ప్రమాదం.`
        : `Drill scenario: Persistent high-pressure dome causing sustained temperatures over 44.5°C with 0% cloud cover.`,
      safetyInstruction: isTelugu
        ? 'మధ్యాహ్న సమయాలలో బయటకు రావద్దు. వృద్ధులు మరియు చిన్నారులను గమనిస్తూ ఉండండి.'
        : 'Stay in shade or air-cooled facilities. Frequent electrolyte oral rehydration. Immediate cold-sponge intervention on thermal exhaustion.',
      effectiveTime: 'DRILL MODE ACTIVE',
      area: location.name,
    },
  };

  const displayedAlerts = drillActive ? [simulatedDrillAlerts[drillType], ...alerts] : alerts;

  const defaultChecklist = assessment?.emergencyChecklist || [
    'Charge mobile phones, power banks, and battery-operated emergency transceivers',
    'Store at least 5 liters of purified drinking water per person for 3 days',
    'Keep waterproof ziplock bags for original identity documents and emergency cash',
    'Locate nearest municipal disaster shelter, school, or community cyclone refuge',
    'Ensure unencumbered drainage lines around homestead or building entrances',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Threat Level Dial */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isTelugu ? 'విపత్తు ముందస్తు హెచ్చరిక విభాగం' : 'Early Disaster Alert & Hazard Mitigation'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isTelugu ? `${location.name} విపత్తు సంసిద్ధతా కేంద్రం` : `Disaster Resilience Center — ${location.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time atmospheric hazard monitoring cross-calibrated with meteorological radar feeds, isobaric drops, and official emergency directives.
            </p>
          </div>

          {/* Overall Hazard Risk Score */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-white/10 shadow-xl">
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Threat Level</span>
              <span
                className={`text-2xl font-black font-mono ${
                  displayedAlerts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                }`}
              >
                {displayedAlerts.length > 0 ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Active Alerts</span>
              <span className="text-2xl font-black font-mono text-cyan-300">{displayedAlerts.length}</span>
            </div>
          </div>
        </div>

        {/* Emergency Drill Simulator Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${drillActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-200">
              {isTelugu ? 'విపత్తు నమూనా పరీక్ష (Drill Simulator):' : 'Emergency Preparedness Drill Simulator:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={drillType}
              onChange={(e) => setDrillType(e.target.value as any)}
              disabled={drillActive}
              className="bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
            >
              <option value="cyclone">Cyclone & Gale Storm</option>
              <option value="flood">Flash Flood & Inundation</option>
              <option value="heatwave">Red Alert Heatwave</option>
            </select>

            <button
              onClick={() => setDrillActive(!drillActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                drillActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {drillActive ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{drillActive ? 'End Simulated Drill' : 'Launch Simulation Drill'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Bulletins Section */}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          {isTelugu ? 'ప్రస్తుత వాతావరణ అత్యవసర బులెటిన్లు' : 'Active Severe Weather Bulletins'}
        </h3>

        {displayedAlerts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 border border-emerald-500/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {isTelugu ? 'ప్రస్తుతానికి ఎటువంటి విపత్తు ముప్పు లేదు' : 'All Clear — No Severe Hazard Bulletins Active'}
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Surface winds, convective precipitation, and air temperature over {location.name} remain within safe baseline operational bounds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="relative overflow-hidden rounded-2xl p-6 bg-slate-900/90 border border-rose-500/40 shadow-xl transition-all hover:border-rose-500/70"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-rose-500 text-white shadow-sm shadow-rose-500/40 animate-pulse">
                        {alert.threatLevel} Alert
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-white/10">
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Effective: {alert.effectiveTime}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight">{alert.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                    {/* Protective Safety Directive */}
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-rose-300 mb-0.5">Mandatory Action Directive:</strong>
                        <span>{alert.safetyInstruction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <a
                      href="tel:112"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>SOS 112</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Preparedness Checklist & Action Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Checklist */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              {isTelugu ? 'వ్యక్తిగత అత్యవసర సంసిద్ధతా చెక్‌లిస్ట్' : 'Personal Disaster Readiness Checklist'}
            </h4>
            <span className="text-xs font-mono text-cyan-300">
              {Object.values(completedChecklist).filter(Boolean).length} / {defaultChecklist.length} Verified
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Verify every safety step prior to severe weather onset to ensure family and property protection.
          </p>

          <div className="space-y-2.5 pt-1">
            {defaultChecklist.map((item, idx) => {
              const isChecked = !!completedChecklist[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <button className="mt-0.5 text-cyan-400 shrink-0">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-500" />}
                  </button>
                  <span className={`text-xs ${isChecked ? 'line-through opacity-75' : ''}`}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Hotlines Directory */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              {isTelugu ? 'అత్యవసర హెల్ప్‌లైన్ నంబర్లు' : '24x7 Emergency SOS Dispatch Hotlines'}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Toll-Free Nationwide</span>
          </div>

          <p className="text-xs text-slate-400">
            Direct government rescue lines for immediate evacuation, medical ambulance dispatch, and disaster response.
          </p>

          <div className="space-y-3 pt-1">
            {emergencyHotlines.map((hl) => (
              <div
                key={hl.number}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <h5 className="text-xs font-bold text-white">{hl.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{hl.desc}</p>
                </div>
                <a
                  href={`tel:${hl.number.split('/')[0].trim()}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{hl.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
