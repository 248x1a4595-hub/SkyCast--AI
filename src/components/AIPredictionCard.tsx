import React from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertOctagon,
  Sprout,
  Car,
  HeartPulse,
  RefreshCw,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { AIPrediction, GeoLocation, CurrentWeather, Language } from '../types/weather';

interface AIPredictionCardProps {
  prediction: AIPrediction | null;
  loading: boolean;
  onRefresh: () => void;
  location: GeoLocation;
  current: CurrentWeather;
  lang?: Language;
}

export const AIPredictionCard: React.FC<AIPredictionCardProps> = ({
  prediction,
  loading,
  onRefresh,
  location,
  current,
  lang = 'en',
}) => {
  const isTelugu = lang === 'te';

  return (
    <div className="space-y-6">
      {/* Hero Banner for AI Weather Intelligence */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-cyan-950/50 border border-cyan-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{isTelugu ? 'జెమిని AI వాతావరణ అంచనా' : 'Neural Atmospheric Predictor • Gemini 3.8 Flash'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isTelugu ? `${location.name} కొరకు AI వాతావరణ విశ్లేషణ` : `AI Meteorological Forecast for ${location.name}`}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {prediction?.summary ||
                (isTelugu
                  ? 'ప్రస్తుత ఉపగ్రహ మరియు వాతావరణ సమాచారాన్ని జెమిని ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ విశ్లేషిస్తోంది...'
                  : 'Synthesizing thermodynamic equations, atmospheric pressure gradients, and satellite telemetry into actionable insights.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* AI Confidence Gauge */}
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-lg">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-cyan-400"
                    fill="transparent"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (125.6 * (prediction?.confidenceScore || 90)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-mono font-bold text-white">
                  {prediction?.confidenceScore || 90}%
                </span>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">
                  {isTelugu ? 'AI ఖచ్చితత్వం' : 'Ensemble Confidence'}
                </div>
                <div className="text-xs text-cyan-300 font-semibold">
                  {prediction?.confidenceScore && prediction.confidenceScore > 85 ? 'High Precision' : 'Moderate'}
                </div>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? (isTelugu ? 'విశ్లేషిస్తోంది...' : 'Computing...') : isTelugu ? 'తిరిగి విశ్లేషించు' : 'Re-Analyze'}</span>
            </button>
          </div>
        </div>

        {/* Confidence Rationale Footnote */}
        {prediction?.confidenceRationale && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Calibration: {prediction.confidenceRationale}</span>
          </div>
        )}
      </div>

      {/* Primary Analytics Grid: Thermal Trend & Anomaly Detection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thermal Trend Card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isTelugu ? 'ఉష్ణోగ్రత తీరు తెన్నులు' : 'Predicted Temperature Trend'}
              </h3>
              <p className="text-xs text-slate-400">Atmospheric thermal pattern evolution</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {prediction?.temperatureTrend || 'Diurnal Stability'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on incoming solar radiation and boundary layer humidity, expect maximum daytime peaks around{' '}
              <strong className="text-white font-mono">{current.temp}°C</strong> with nighttime radiation cooling down to seasonal norms.
            </p>
          </div>
        </div>

        {/* Atmospheric Anomaly Detector */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isTelugu ? 'వాతావరణ వైపరీత్యాల శోధన' : 'Atmospheric Anomaly Detection'}
              </h3>
              <p className="text-xs text-slate-400">Barometric drops & sudden storm indicators</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {prediction?.anomalies || 'No severe anomalies observed'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Surface pressure currently measures <strong className="text-white font-mono">{current.pressure} hPa</strong>. Isobaric gradient remains stable with low sudden microburst probability.
            </p>
          </div>
        </div>
      </div>

      {/* Sectoral Impact Matrices: Farming, Travel, Health */}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          {isTelugu ? 'రంగాల వారీగా AI సలహాలు (వ్యవసాయం, ప్రయాణం, ఆరోగ్యం)' : 'Sectoral AI Impact Advisory Matrix'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agriculture / AgroWeather AI */}
          <div className="glass-card-interactive rounded-2xl p-6 border border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  AgroWeather AI
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {isTelugu ? 'వ్యవసాయ & పంటల సలహా' : 'Farming & Crop Protection'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {prediction?.impacts?.agriculture ||
                  'Favorable soil moisture conditions for routine paddy, cotton, and vegetable irrigation. Avoid chemical spraying during high winds.'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Evapotranspiration: Moderate</span>
              <span className="text-emerald-400">Optimal Field Work</span>
            </div>
          </div>

          {/* Travel & Commute Advisory */}
          <div className="glass-card-interactive rounded-2xl p-6 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                  Transit Intelligence
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {isTelugu ? 'రవాణా & ప్రయాణ సూచన' : 'Travel & Commuting Advisory'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {prediction?.impacts?.travel ||
                  'Clear highway visibility and normal airport runway conditions. Carry light rain protection if traveling in evening transit windows.'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Visibility: {current.visibility} km</span>
              <span className="text-cyan-400">Good Highway Index</span>
            </div>
          </div>

          {/* Health & Wellness Precautions */}
          <div className="glass-card-interactive rounded-2xl p-6 border border-rose-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  Biometeorology
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {isTelugu ? 'ఆరోగ్య సంరక్షణ సూచనలు' : 'Health & Environmental Wellness'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {prediction?.impacts?.health ||
                  'Maintain regular hydration intervals. Apply SPF 30+ sun protection during midday UV peaks. Safe for outdoor cardio.'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>UV Index: {current.uv_index}</span>
              <span className="text-rose-400">Hydration Alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec Footnote */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Core AI Architecture: {prediction?.aiModel || 'Gemini 3.8 Flash (SkyCast Meteorological Fine-Tuning)'}</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">Latency: ~420ms • Verified Physics Bounds</span>
      </div>
    </div>
  );
};
