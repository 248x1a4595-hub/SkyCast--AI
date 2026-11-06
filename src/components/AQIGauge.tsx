import React from 'react';
import { Wind, Shield, AlertTriangle, Activity, Heart, UserCheck, Flame, Sun } from 'lucide-react';
import { AirQualityData, Language } from '../types/weather';

interface AQIGaugeProps {
  aqiData: AirQualityData;
  cityName: string;
  lang?: Language;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({ aqiData, cityName, lang = 'en' }) => {
  const isTelugu = lang === 'te';
  const aqi = aqiData.aqi;

  // Percentage for semi-circle gauge (0 to 300 max)
  const clampedAqi = Math.min(300, Math.max(0, aqi));
  const normalizedAngle = (clampedAqi / 300) * 180; // 0 to 180 degrees

  const pollutants = [
    { name: 'PM2.5', label: 'Fine Respirable', value: aqiData.pm2_5, unit: 'µg/m³', max: 60, status: aqiData.pm2_5 < 15 ? 'Good' : aqiData.pm2_5 < 35 ? 'Moderate' : 'Poor' },
    { name: 'PM10', label: 'Inhalable Dust', value: aqiData.pm10, unit: 'µg/m³', max: 100, status: aqiData.pm10 < 45 ? 'Good' : aqiData.pm10 < 80 ? 'Moderate' : 'Poor' },
    { name: 'O₃', label: 'Ozone', value: aqiData.o3, unit: 'µg/m³', max: 120, status: aqiData.o3 < 60 ? 'Good' : 'Moderate' },
    { name: 'NO₂', label: 'Nitrogen Dioxide', value: aqiData.no2, unit: 'µg/m³', max: 80, status: aqiData.no2 < 40 ? 'Good' : 'Moderate' },
    { name: 'SO₂', label: 'Sulphur Dioxide', value: aqiData.so2, unit: 'µg/m³', max: 50, status: 'Good' },
    { name: 'CO', label: 'Carbon Monoxide', value: aqiData.co, unit: 'mg/m³', max: 5, status: 'Good' },
  ];

  return (
    <div className="space-y-6">
      {/* Primary AQI Gauge Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Dial Graphic */}
          <div className="flex flex-col items-center justify-center relative w-64">
            <svg viewBox="0 0 200 120" className="w-56 h-36 overflow-visible">
              <defs>
                <linearGradient id="aqiGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#f97316" />
                  <stop offset="85%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Progress Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#aqiGaugeGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (normalizedAngle / 180) * 251.2}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Value In Center */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
                {aqi}
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border"
                style={{
                  backgroundColor: `${aqiData.color}20`,
                  color: aqiData.color,
                  borderColor: `${aqiData.color}50`,
                }}
              >
                {aqiData.status}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">US AQI Standard</span>
            </div>
          </div>

          {/* Diagnostic & Advisory Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  {isTelugu ? `${cityName} లో గాలి నాణ్యత సూచిక` : `Air Quality Index in ${cityName}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTelugu
                    ? `ప్రధాన కాలుష్య కారకం: ${aqiData.dominantPollutant}`
                    : `Dominant atmospheric particulate: ${aqiData.dominantPollutant}`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>UV {aqiData.uv} (Max Today)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{isTelugu ? 'ఆరోగ్య సలహా & జాగ్రత్తలు:' : 'Health & Respiratory Guidance:'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{aqiData.healthAdvice}</p>
            </div>

            {/* Quick action badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5 text-[11px] text-slate-300 flex items-center gap-1">
                {aqi > 100 ? '😷 Wear N95 Mask Outdoor' : '🍃 Outdoor Air Safe'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5 text-[11px] text-slate-300 flex items-center gap-1">
                {aqi > 120 ? '🪟 Keep Windows Closed' : '🪟 Normal Ventilation'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/5 text-[11px] text-slate-300 flex items-center gap-1">
                {aqi > 150 ? '🏃 Postpone Heavy Running' : '🏃 Ideal for Jogging & Sports'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutant Level Breakdown Cards */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          {isTelugu ? 'వివరణాత్మక కాలుష్య కారకాల స్థాయిలు' : 'Atmospheric Pollutant Breakdown (Concentrations)'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pollutants.map((p) => {
            const pct = Math.min(100, Math.round((p.value / p.max) * 100));
            return (
              <div
                key={p.name}
                className="glass-card-interactive rounded-xl p-3 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300">{p.name}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        p.status === 'Good'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : p.status === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{p.label}</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold font-mono text-white">{p.value}</span>
                    <span className="text-[10px] text-slate-400">{p.unit}</span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        p.status === 'Good' ? 'bg-emerald-400' : p.status === 'Moderate' ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vulnerable Demographic Protection Matrix */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          {isTelugu ? 'ప్రత్యేక ఆరోగ్య సమూహాల జాగ్రత్తలు' : 'Vulnerable Group Health Recommendations'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Asthma & COPD</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {aqi > 100
                ? 'Carry quick-relief inhalers. Particulates may provoke bronchial inflammation.'
                : 'Safe ambient air for daily routine. Normal breathing without airway distress.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
              <Activity className="w-4 h-4" />
              <span>Athletes & Runners</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {aqi > 120
                ? 'Relocate long aerobic endurance training indoors. Elevated minute ventilation increases particulate intake.'
                : 'Excellent atmospheric quality for competitive sprints, marathons, and cycling.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Seniors & Children</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {aqi > 100
                ? 'Limit strenuous playground games during peak rush hours (8-10 AM & 5-8 PM).'
                : 'Encourage fresh-air outdoor recreation and natural sunlight exposure.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1.5">
              <Flame className="w-4 h-4" />
              <span>Indoor Air Quality</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {aqi > 100
                ? 'Operate HEPA room purifiers and avoid unvented kerosene or incense sticks.'
                : 'Keep windows cracked for cross-ventilation and natural oxygenation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
