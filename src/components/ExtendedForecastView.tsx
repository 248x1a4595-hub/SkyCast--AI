import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  Zap,
  Snowflake,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { DailyForecast, UnitSystem, Language } from '../types/weather';

interface ExtendedForecastViewProps {
  daily: DailyForecast[];
  unit: UnitSystem;
  lang?: Language;
}

export const ExtendedForecastView: React.FC<ExtendedForecastViewProps> = ({
  daily,
  unit,
  lang = 'en',
}) => {
  const isTelugu = lang === 'te';
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  if (!daily || daily.length === 0) return null;

  const toUnit = (c: number) => (unit === 'imperial' ? Math.round((c * 9) / 5 + 32) : c);

  const selectedDay = daily[selectedDayIdx] || daily[0];

  const getWeatherIcon = (code: number, className = 'w-6 h-6') => {
    if ([95, 96, 99].includes(code)) return <Zap className={`${className} text-amber-400`} />;
    if ([71, 73, 75, 85, 86].includes(code)) return <Snowflake className={`${className} text-cyan-200`} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-cyan-400`} />;
    if ([1, 2].includes(code)) return <CloudSun className={`${className} text-amber-300`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-400`} />;
    return <Sun className={`${className} text-amber-400`} />;
  };

  const globalMax = Math.max(...daily.map((d) => toUnit(d.max_temp)));
  const globalMin = Math.min(...daily.map((d) => toUnit(d.min_temp)));
  const globalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>{isTelugu ? '7-14 రోజుల సమగ్ర అంచనా' : 'Medium-Range Meteorological Horizon'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isTelugu ? 'వారపు వాతావరణ బులెటిన్' : '7-Day & Extended Weather Outlook'}
          </h2>
          <p className="text-xs text-slate-300">
            Ensemble meteorological forecasting calibrated with atmospheric pressure and frontal movements.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-300">
            14-Day Synoptic Run
          </span>
        </div>
      </div>

      {/* Selected Day Spotlight Card */}
      {selectedDay && (
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 shadow-lg">
                {getWeatherIcon(selectedDay.conditionCode, 'w-10 h-10')}
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {new Date(selectedDay.date).toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{selectedDay.condition}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Expected High: <strong className="text-white font-mono">{toUnit(selectedDay.max_temp)}°{unit === 'imperial' ? 'F' : 'C'}</strong>, Low: <strong className="text-white font-mono">{toUnit(selectedDay.min_temp)}°{unit === 'imperial' ? 'F' : 'C'}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Rain Risk</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {selectedDay.precipitation_probability}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Precipitation</span>
                <span className="text-sm font-bold text-white font-mono">{selectedDay.precipitation_sum} mm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Max Wind</span>
                <span className="text-sm font-bold text-white font-mono">{selectedDay.wind_speed_max} km/h</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-mono">UV Index</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{selectedDay.uv_index_max}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Cards Timeline List */}
      <div className="space-y-3">
        {daily.slice(0, 7).map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          const maxT = toUnit(day.max_temp);
          const minT = toUnit(day.min_temp);

          // Normalized temperature bar width
          const leftPct = ((minT - globalMin) / globalRange) * 100;
          const widthPct = Math.max(10, ((maxT - minT) / globalRange) * 100);

          const dateObj = new Date(day.date);
          const dayName =
            idx === 0
              ? isTelugu ? 'ఈ రోజు' : 'Today'
              : idx === 1
              ? isTelugu ? 'రేపు' : 'Tomorrow'
              : dateObj.toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', { weekday: 'short' });
          const dateStr = dateObj.toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={day.date}
              onClick={() => setSelectedDayIdx(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-900/95 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-white/5 hover:bg-slate-900/90 hover:border-white/20'
              }`}
            >
              {/* Day & Icon */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 shrink-0">
                  {getWeatherIcon(day.conditionCode)}
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{dayName}</span>
                    <span className="text-xs font-normal text-slate-400 font-mono">({dateStr})</span>
                  </div>
                  <div className="text-xs text-slate-300">{day.condition}</div>
                </div>
              </div>

              {/* Rain Chance */}
              <div className="flex items-center gap-2 text-xs font-mono min-w-[110px]">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span className={day.precipitation_probability > 30 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                  {day.precipitation_probability}%
                </span>
                {day.precipitation_sum > 0 && (
                  <span className="text-[10px] text-slate-500">({day.precipitation_sum}mm)</span>
                )}
              </div>

              {/* Temperature Visual Range Bar */}
              <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 w-8 text-right">{minT}°</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white w-8">{maxT}°</span>
              </div>

              {/* Sun Times */}
              <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" />
                  {day.sunrise.slice(11, 16)}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-indigo-400" />
                  {day.sunset.slice(11, 16)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
