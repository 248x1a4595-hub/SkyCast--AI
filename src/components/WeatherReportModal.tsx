import React from 'react';
import { X, Printer, Download, ShieldCheck, CloudRain, Wind, Droplets, Sun, Compass } from 'lucide-react';
import { GeoLocation, CurrentWeather, AirQualityData, AIPrediction, DailyForecast, DisasterAlert } from '../types/weather';

interface WeatherReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: GeoLocation;
  current: CurrentWeather;
  aqi: AirQualityData;
  prediction: AIPrediction | null;
  daily: DailyForecast[];
  alerts: DisasterAlert[];
}

export const WeatherReportModal: React.FC<WeatherReportModalProps> = ({
  isOpen,
  onClose,
  location,
  current,
  aqi,
  prediction,
  daily,
  alerts,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header Action Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono font-bold text-slate-300">
              OFFICIAL METEOROLOGICAL DOSSIER • SKYCAST AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-100 print:text-black print:bg-white print:p-0">
          {/* Document Masthead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 print:border-black/20 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-cyan-400 print:text-blue-700 tracking-wider">
                  SKYCAST AI
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 print:text-blue-900 font-mono font-semibold">
                  INTELLIGENCE REPORT
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white print:text-black">
                Atmospheric & Disaster Risk Assessment
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Region: {location.name}, {location.admin1 ? `${location.admin1}, ` : ''}{location.country} ({location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E)
              </p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-400 print:text-gray-600">
              <div>Date: {currentDate}</div>
              <div>Report ID: SKY-{Math.floor(Math.random() * 900000 + 100000)}</div>
              <div>Security Classification: Public Advisory</div>
            </div>
          </div>

          {/* Current State Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-white/5 print:border-gray-300">
              <span className="text-[11px] font-mono text-slate-400 print:text-gray-600 uppercase">Surface Temp</span>
              <div className="text-2xl font-black text-white print:text-black mt-1">{current.temp}°C</div>
              <span className="text-[10px] text-cyan-400 print:text-blue-600">Feels like {current.feels_like}°C</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-white/5 print:border-gray-300">
              <span className="text-[11px] font-mono text-slate-400 print:text-gray-600 uppercase">Air Quality (US AQI)</span>
              <div className="text-2xl font-black text-emerald-400 print:text-green-700 mt-1">{aqi.aqi}</div>
              <span className="text-[10px] text-slate-300 print:text-gray-600">Status: {aqi.status}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-white/5 print:border-gray-300">
              <span className="text-[11px] font-mono text-slate-400 print:text-gray-600 uppercase">Barometric Pressure</span>
              <div className="text-2xl font-black text-white print:text-black mt-1">{current.pressure} hPa</div>
              <span className="text-[10px] text-slate-300 print:text-gray-600">Isobaric Baseline</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-white/5 print:border-gray-300">
              <span className="text-[11px] font-mono text-slate-400 print:text-gray-600 uppercase">Wind Velocity</span>
              <div className="text-2xl font-black text-white print:text-black mt-1">{current.wind_speed} km/h</div>
              <span className="text-[10px] text-slate-300 print:text-gray-600">Direction: {current.wind_direction}°</span>
            </div>
          </div>

          {/* AI Neural Synthesis Section */}
          <div className="p-5 rounded-2xl bg-slate-800/40 print:bg-gray-50 border border-cyan-500/20 print:border-gray-300 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 print:text-blue-700 text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>AI METEOROLOGICAL SYNTHESIS (GEMINI 3.8 FLASH ENGINE)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 print:text-gray-800 leading-relaxed">
              {prediction?.summary ||
                'Atmospheric circulation models exhibit sustained boundary layer stability with seasonal diurnal variances.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 print:bg-white border border-white/5 print:border-gray-200">
                <strong className="block text-emerald-400 print:text-green-700 mb-1">Agriculture Sector</strong>
                <span className="text-slate-300 print:text-gray-700 text-[11px] leading-relaxed">
                  {prediction?.impacts?.agriculture || 'Normal irrigation regimes sufficient for crop cultivation.'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 print:bg-white border border-white/5 print:border-gray-200">
                <strong className="block text-cyan-400 print:text-blue-700 mb-1">Transit & Aviation</strong>
                <span className="text-slate-300 print:text-gray-700 text-[11px] leading-relaxed">
                  {prediction?.impacts?.travel || 'Clear flight corridors and normal highway friction indices.'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 print:bg-white border border-white/5 print:border-gray-200">
                <strong className="block text-rose-400 print:text-red-700 mb-1">Community Health</strong>
                <span className="text-slate-300 print:text-gray-700 text-[11px] leading-relaxed">
                  {prediction?.impacts?.health || 'Particulate matter within permissive WHO safety thresholds.'}
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Extended Trend Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
              7-Day Prognosis Timeline
            </h3>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 print:text-black border-collapse">
                <thead>
                  <tr className="border-b border-white/10 print:border-gray-300 text-[11px] font-mono text-slate-400 print:text-gray-600">
                    <th className="py-2">Date</th>
                    <th className="py-2">Condition</th>
                    <th className="py-2">High / Low</th>
                    <th className="py-2">Rain Prob.</th>
                    <th className="py-2">Precipitation</th>
                    <th className="py-2">Max Wind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-gray-200">
                  {daily.slice(0, 7).map((d) => (
                    <tr key={d.date} className="hover:bg-white/5">
                      <td className="py-2.5 font-mono">
                        {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-2.5">{d.condition}</td>
                      <td className="py-2.5 font-bold font-mono">
                        {d.max_temp}° / {d.min_temp}°C
                      </td>
                      <td className="py-2.5 font-mono text-cyan-400 print:text-blue-600">
                        {d.precipitation_probability}%
                      </td>
                      <td className="py-2.5 font-mono">{d.precipitation_sum} mm</td>
                      <td className="py-2.5 font-mono">{d.wind_speed_max} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disaster Early Warning Summary */}
          {alerts.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/30 print:bg-red-50 border border-rose-500/30 print:border-red-300 space-y-1">
              <strong className="text-rose-400 print:text-red-700 text-xs font-bold block">
                ACTIVE SEVERE WEATHER WARNINGS IN FORCE ({alerts.length})
              </strong>
              {alerts.map((a) => (
                <div key={a.id} className="text-xs text-rose-200 print:text-red-800">
                  • <strong>{a.title}</strong>: {a.description} ({a.safetyInstruction})
                </div>
              ))}
            </div>
          )}

          {/* Institutional Sign-off & Verification */}
          <div className="pt-6 border-t border-white/10 print:border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] font-mono text-slate-500 print:text-gray-500 gap-2">
            <div>Generated by SkyCast AI Meteorological Engine • College Project Demonstration</div>
            <div>Calibrated with Open-Meteo & WMO World Weather Watch</div>
          </div>
        </div>
      </div>
    </div>
  );
};
