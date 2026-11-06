import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Thermometer,
  Key,
  Bell,
  Code2,
  Check,
  Cpu,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { UnitSystem, Language } from '../types/weather';

interface SettingsViewProps {
  unit: UnitSystem;
  onUnitChange: (u: UnitSystem) => void;
  lang: Language;
  onLangChange: (l: Language) => void;
  openWeatherKey: string;
  onSaveOpenWeatherKey: (key: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  unit,
  onUnitChange,
  lang,
  onLangChange,
  openWeatherKey,
  onSaveOpenWeatherKey,
}) => {
  const [keyInput, setKeyInput] = useState<string>(openWeatherKey);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [notifStatus, setNotifStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const handleSaveKey = () => {
    onSaveOpenWeatherKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const perm = await Notification.requestPermission();
      setNotifStatus(perm);
      if (perm === 'granted') {
        new Notification('SkyCast AI Alert System', {
          body: 'Atmospheric alerts and severe weather warnings are now active on your device!',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Settings & Project Architecture</h2>
            <p className="text-xs text-slate-400">Configure units, languages, telemetry sources, and review college specs</p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Units & Measurement */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Thermometer className="w-4 h-4" />
            <span>Unit of Measurement</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUnitChange('metric')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unit === 'metric'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm">Metric Units</div>
              <div className="text-[11px] text-slate-400 mt-1">°C, km/h, mm, hPa</div>
            </button>

            <button
              onClick={() => onUnitChange('imperial')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unit === 'imperial'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm">Imperial Units</div>
              <div className="text-[11px] text-slate-400 mt-1">°F, mph, in, inHg</div>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Globe className="w-4 h-4" />
            <span>Language Localization</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onLangChange('en')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                lang === 'en'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm">English</div>
              <div className="text-[11px] text-slate-400 mt-1">Standard Meteorological Nomenclature</div>
            </button>

            <button
              onClick={() => onLangChange('te')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                lang === 'te'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm">తెలుగు (Telugu)</div>
              <div className="text-[11px] text-slate-400 mt-1">ప్రాంతీయ భాషా వాతావరణ సమాచారం</div>
            </button>
          </div>
        </div>
      </div>

      {/* Weather API Key Integration */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Key className="w-4 h-4" />
            <span>Telemetry & API Provider Configuration</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Open-Meteo Active (High Precision, Zero Friction)
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          SkyCast AI comes pre-configured with globally calibrated Open-Meteo & WMO ensemble feeds out-of-the-box. You can also optionally supply an OpenWeatherMap API key if you wish to benchmark alternative radar layer tiles:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste OpenWeatherMap API Key (optional)"
            className="flex-1 w-full bg-slate-950 text-slate-200 text-xs px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            onClick={handleSaveKey}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Key Saved!' : 'Save Key'}</span>
          </button>
        </div>
      </div>

      {/* Browser Emergency Alert Notifications */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Bell className="w-4 h-4" />
            <span>Severe Weather Push Notifications</span>
          </div>
          <p className="text-xs text-slate-300">
            Enable instant browser audio-visual notifications when severe storm or flood warnings are issued for your location.
          </p>
        </div>

        <button
          onClick={requestNotificationPermission}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            notifStatus === 'granted'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
          }`}
        >
          {notifStatus === 'granted' ? <ShieldCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          <span>{notifStatus === 'granted' ? 'Alerts Enabled' : 'Enable Emergency Alerts'}</span>
        </button>
      </div>

      {/* College Project Architecture Specification */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-slate-200 text-sm font-bold">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>College Capstone Project Specification & Technical Stack</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Frontend Architecture</span>
            </div>
            <p className="text-slate-300">
              React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Leaflet GIS, Responsive Glassmorphism Design.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Engine & Models</span>
            </div>
            <p className="text-slate-300">
              Gemini 3.8 Flash via @google/genai SDK, server-side context synthesis, biometeorology & agricultural inference.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>Data Feeds</span>
            </div>
            <p className="text-slate-300">
              Open-Meteo High-Resolution Ensemble (ECMWF, GFS), RainViewer Radar tiles, European/US AQI Standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
