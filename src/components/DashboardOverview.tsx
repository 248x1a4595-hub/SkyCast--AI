import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  Zap,
  Snowflake,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Compass,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import {
  GeoLocation,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQualityData,
  DisasterAlert,
  AIPrediction,
  UnitSystem,
  Language,
} from '../types/weather';
import { HourlyForecastChart } from './HourlyForecastChart';

interface DashboardOverviewProps {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aqi: AirQualityData;
  alerts: DisasterAlert[];
  prediction: AIPrediction | null;
  unit: UnitSystem;
  lang?: Language;
  onNavigateToTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  location,
  current,
  hourly,
  daily,
  aqi,
  alerts,
  prediction,
  unit,
  lang = 'en',
  onNavigateToTab,
  onRefresh,
  isRefreshing,
}) => {
  const isTelugu = lang === 'te';

  const toUnit = (c: number) => (unit === 'imperial' ? Math.round((c * 9) / 5 + 32) : c);
  const tempUnit = unit === 'imperial' ? '°F' : '°C';
  const speedUnit = unit === 'imperial' ? 'mph' : 'km/h';
  const windSpeed = unit === 'imperial' ? Math.round(current.wind_speed * 0.621371) : current.wind_speed;

  const today = daily[0] || {
    max_temp: current.temp + 3,
    min_temp: current.temp - 4,
    precipitation_sum: 0,
    precipitation_probability: 10,
  };

  const getWindCardinal = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  const getWeatherIcon = (code: number, className = 'w-16 h-16') => {
    if ([95, 96, 99].includes(code)) return <Zap className={`${className} text-amber-400 drop-shadow-lg`} />;
    if ([71, 73, 75, 85, 86].includes(code)) return <Snowflake className={`${className} text-cyan-200 drop-shadow-lg`} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-cyan-400 drop-shadow-lg`} />;
    if ([1, 2].includes(code)) return <CloudSun className={`${className} text-amber-300 drop-shadow-lg`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-400 drop-shadow-lg`} />;
    return <Sun className={`${className} text-amber-400 drop-shadow-lg`} />;
  };

  return (
    <div className="space-y-6">
      {/* Severe Disaster Notification Banner */}
      {alerts.length > 0 && (
        <div
          onClick={() => onNavigateToTab('alerts')}
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-red-900/60 to-rose-950/80 border border-rose-500/40 shadow-xl cursor-pointer hover:border-rose-400 transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                  URGENT WARNING
                </span>
                <span className="text-xs font-bold text-white">{alerts[0].title}</span>
              </div>
              <p className="text-xs text-rose-200 line-clamp-1 mt-0.5">{alerts[0].description}</p>
            </div>
          </div>

          <span className="text-xs font-bold text-rose-300 hover:text-white shrink-0 flex items-center gap-1 font-mono">
            View Protocol →
          </span>
        </div>
      )}

      {/* Main Weather Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-white/10 shadow-2xl">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location.name}, {location.country}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°)
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-6xl sm:text-7xl font-extrabold font-mono text-white tracking-tighter drop-shadow-md">
                {toUnit(current.temp)}
                <span className="text-3xl text-cyan-400 font-normal">{tempUnit}</span>
              </span>

              <div className="space-y-0.5">
                <span className="text-lg font-bold text-slate-200 block">{current.condition}</span>
                <span className="text-xs text-slate-400 font-mono">
                  Feels like {toUnit(current.feels_like)}{tempUnit}
                </span>
              </div>
            </div>

            {/* Daily range chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
              <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                <ArrowUp className="w-3 h-3" />
                <span>Max: {toUnit(today.max_temp)}{tempUnit}</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <ArrowDown className="w-3 h-3" />
                <span>Min: {toUnit(today.min_temp)}{tempUnit}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>{today.precipitation_probability}% Precipitation</span>
              </span>
            </div>
          </div>

          {/* Right Icon & Quick Actions */}
          <div className="flex flex-col items-end justify-between self-stretch md:self-auto gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-white/10"
                title="Refresh live data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-slate-800/40 border border-white/10 backdrop-blur-md shadow-inner">
              {getWeatherIcon(current.conditionCode)}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Station Telemetry</span>
              <span className="text-xs text-slate-300 font-mono">Open-Meteo & WMO Engine</span>
            </div>
          </div>
        </div>

        {/* AI Quick Insight Banner on Dashboard */}
        {prediction && (
          <div
            onClick={() => onNavigateToTab('ai-prediction')}
            className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-xs text-slate-300 line-clamp-1">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 group-hover:rotate-12 transition-transform" />
              <strong className="text-cyan-300 font-semibold shrink-0">SkyCast AI Insight:</strong>
              <span className="text-slate-300 truncate">{prediction.summary}</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 shrink-0 group-hover:underline">
              AI Center →
            </span>
          </div>
        )}
      </div>

      {/* Atmospheric Telemetry Grid: 6 Critical Meteorological Variables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Wind & Gusts */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Wind Velocity</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white">
              {windSpeed} <span className="text-xs text-slate-400">{speedUnit}</span>
            </div>
            <div className="text-[10px] text-cyan-300 font-mono mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>{getWindCardinal(current.wind_direction)} ({current.wind_direction}°)</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">
            Gusts: {current.wind_gusts || windSpeed} {speedUnit}
          </span>
        </div>

        {/* 2. Relative Humidity */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white">
              {current.humidity}<span className="text-xs text-slate-400">%</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-0.5">
              Dew Pt: ~{Math.round(current.temp - (100 - current.humidity) / 5)}°C
            </div>
          </div>
          <span className="text-[10px] text-slate-500">
            {current.humidity > 70 ? 'High Moisture' : 'Comfortable'}
          </span>
        </div>

        {/* 3. Surface Pressure */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white">
              {current.pressure} <span className="text-xs text-slate-400">hPa</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {current.pressure >= 1013 ? 'High Pressure' : 'Low Pressure Bar'}
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Isobaric Balance</span>
        </div>

        {/* 4. UV Radiation Index */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white">
              {current.uv_index}
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
              {current.uv_index <= 2 ? 'Low Risk' : current.uv_index <= 5 ? 'Moderate' : 'Very High'}
            </div>
          </div>
          <span className="text-[10px] text-slate-500">
            {current.uv_index > 5 ? 'SPF 30+ Advised' : 'Safe Ambient'}
          </span>
        </div>

        {/* 5. Visibility Range */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Visibility</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white">
              {current.visibility} <span className="text-xs text-slate-400">km</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-0.5">
              {current.visibility >= 10 ? 'Clear Horizon' : 'Haze / Mist'}
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Aviation Standard</span>
        </div>

        {/* 6. Air Quality (US AQI) */}
        <div
          onClick={() => onNavigateToTab('air-quality')}
          className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between cursor-pointer hover:border-cyan-400/40 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Air Quality</span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: aqi.color }} />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
              {aqi.aqi} <span className="text-xs font-normal" style={{ color: aqi.color }}>{aqi.status}</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-0.5">
              PM2.5: {aqi.pm2_5} µg/m³
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono group-hover:underline">
            View AQI Gauge →
          </span>
        </div>
      </div>

      {/* 24-Hour Hourly Atmospheric Interactive Graph */}
      <HourlyForecastChart hourly={hourly} unit={unit} />

      {/* Sun Ephemeris & 7-Day Quick Horizon Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solar Ephemeris Card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Solar Ephemeris</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Diurnal Cycle</span>
            </div>

            <div className="relative py-4 flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-48 h-24 overflow-visible">
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="3"
                  strokeDasharray="4, 4"
                />
                <circle cx="100" cy="10" r="6" className="fill-amber-400 shadow-lg shadow-amber-500/50" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Sunrise</span>
                <span className="font-bold text-white">{current.sunrise.slice(11, 16) || '06:04'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block">Sunset</span>
                <span className="font-bold text-white">{current.sunset.slice(11, 16) || '18:12'}</span>
              </div>
              <Sunset className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* 7-Day Quick Horizon Glance */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">7-Day Synoptic Quick Glance</h3>
            <button
              onClick={() => onNavigateToTab('forecast')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Full Forecast →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {daily.slice(0, 7).map((d, idx) => (
              <div
                key={d.date}
                className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col items-center gap-1.5 text-center"
              >
                <span className="text-[11px] font-mono text-slate-400">
                  {idx === 0 ? 'Today' : new Date(d.date).toLocaleDateString([], { weekday: 'short' })}
                </span>
                <div className="my-1">{getWeatherIcon(d.conditionCode, 'w-6 h-6')}</div>
                <span className="text-xs font-bold text-white font-mono">
                  {toUnit(d.max_temp)}°
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{toUnit(d.min_temp)}°</span>
                <span className="text-[9px] text-cyan-400 font-mono mt-0.5">{d.precipitation_probability}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
