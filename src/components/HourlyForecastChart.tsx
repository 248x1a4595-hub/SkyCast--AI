import React, { useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Zap, Snowflake, Droplets, Wind, ArrowDown, ArrowUp } from 'lucide-react';
import { HourlyForecast, UnitSystem } from '../types/weather';

interface HourlyForecastChartProps {
  hourly: HourlyForecast[];
  unit: UnitSystem;
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, unit }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!hourly || hourly.length === 0) return null;

  const displayHours = hourly.slice(0, 24);
  const temps = displayHours.map((h) => (unit === 'imperial' ? Math.round((h.temp * 9) / 5 + 32) : h.temp));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  // SVG dimensions
  const svgHeight = 140;
  const paddingX = 24;
  const graphWidth = 920; // virtual canvas width for smooth scroll
  const step = (graphWidth - paddingX * 2) / (displayHours.length - 1);

  // Compute curve points
  const points = temps.map((t, idx) => {
    const x = paddingX + idx * step;
    // higher temp = lower y
    const normalized = (t - minTemp) / tempRange;
    const y = svgHeight - 40 - normalized * (svgHeight - 70);
    return { x, y, temp: t, hour: displayHours[idx] };
  });

  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cX = (prev.x + p.x) / 2;
    return `${acc} C ${cX} ${prev.y}, ${cX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  // Fill area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - 10} L ${points[0].x} ${svgHeight - 10} Z`;

  const getWeatherIcon = (code: number, isDay: boolean) => {
    if ([95, 96, 99].includes(code)) return <Zap className="w-4 h-4 text-amber-400" />;
    if ([71, 73, 75, 85, 86].includes(code)) return <Snowflake className="w-4 h-4 text-cyan-200" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-4 h-4 text-cyan-400" />;
    if ([1, 2].includes(code)) return <CloudSun className="w-4 h-4 text-amber-300" />;
    if (code === 3) return <Cloud className="w-4 h-4 text-slate-400" />;
    return isDay ? <Sun className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-indigo-300" />;
  };

  const hoveredData = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            24-Hour Hourly Atmospheric Curve
          </h3>
          <p className="text-xs text-slate-400">Interactive thermal gradients and rainfall probabilities</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>High: {maxTemp}°{unit === 'imperial' ? 'F' : 'C'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Low: {minTemp}°{unit === 'imperial' ? 'F' : 'C'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-400"></span>
            <span>Rain Probability</span>
          </div>
        </div>
      </div>

      {/* Hover Information Banner */}
      {hoveredData && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between text-xs transition-all">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-cyan-300">
              {new Date(hoveredData.hour.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}:
            </span>
            <span className="text-slate-200">{hoveredData.hour.condition}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="font-bold text-white">
              {hoveredData.temp}°{unit === 'imperial' ? 'F' : 'C'}
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {hoveredData.hour.precipitation_probability}% Rain
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {hoveredData.hour.wind_speed} km/h
            </span>
          </div>
        </div>
      )}

      {/* Scrollable Timeline Chart */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[880px] relative">
          <svg
            viewBox={`0 0 ${graphWidth} ${svgHeight}`}
            className="w-full h-36 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Precipitation probability vertical bars in the background */}
            {points.map((p, idx) => {
              const barHeight = (p.hour.precipitation_probability / 100) * 55;
              return (
                <rect
                  key={`rain-bar-${idx}`}
                  x={p.x - 7}
                  y={svgHeight - 10 - barHeight}
                  width="14"
                  height={barHeight}
                  rx="3"
                  className={`${
                    p.hour.precipitation_probability > 50
                      ? 'fill-cyan-400/30 stroke-cyan-400/40'
                      : 'fill-slate-800/40'
                  } transition-all`}
                />
              );
            })}

            {/* Temperature Area & Stroke */}
            <path d={areaD} fill="url(#tempGradient)" />
            <path d={pathD} fill="none" stroke="url(#strokeGradient)" strokeWidth="3" strokeLinecap="round" />

            {/* Interactive Points */}
            {points.map((p, idx) => (
              <g
                key={`point-${idx}`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === idx ? 6 : 4}
                  className="fill-slate-950 stroke-cyan-400 stroke-2 transition-all group-hover:scale-125"
                />
                {/* Temperature label directly above point */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold ${
                    hoveredIdx === idx ? 'fill-cyan-300' : 'fill-slate-300'
                  }`}
                >
                  {p.temp}°
                </text>
              </g>
            ))}
          </svg>

          {/* Time & Weather Icon Rows beneath SVG */}
          <div className="flex justify-between px-6 pt-2 border-t border-white/5">
            {points.map((p, idx) => {
              const timeObj = new Date(p.hour.time);
              const hourLabel = timeObj.toLocaleTimeString([], { hour: 'numeric' });
              const isSelected = hoveredIdx === idx;

              return (
                <div
                  key={`footer-${idx}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer py-1 px-1 rounded-lg transition-all ${
                    isSelected ? 'bg-cyan-500/10 scale-105' : 'hover:bg-slate-800/50'
                  }`}
                  style={{ width: `${100 / displayHours.length}%` }}
                >
                  <div className="my-0.5">{getWeatherIcon(p.hour.conditionCode, p.hour.isDay)}</div>
                  <span className="text-[10px] font-mono text-slate-400">{hourLabel}</span>
                  {p.hour.precipitation_probability > 0 ? (
                    <span className="text-[9px] font-mono text-cyan-400 font-semibold">
                      {p.hour.precipitation_probability}%
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-600">-</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
