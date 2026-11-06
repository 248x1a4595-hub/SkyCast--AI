import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Brain,
  Calendar,
  Layers,
  ShieldAlert,
  Wind,
  Bot,
  Star,
  Settings,
  Search,
  MapPin,
  Compass,
  FileText,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  Bell,
  Globe,
  Radio,
  User,
  LogIn,
} from 'lucide-react';

import {
  GeoLocation,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQualityData,
  DisasterAlert,
  AIPrediction,
  DisasterAssessment,
  UnitSystem,
  Language,
} from './types/weather';

import {
  fetchWeatherData,
  fetchAirQualityData,
  searchCities,
  reverseGeocode,
  computeDisasterAlerts,
} from './services/weatherService';

import { DashboardOverview } from './components/DashboardOverview';
import { AIPredictionCard } from './components/AIPredictionCard';
import { ExtendedForecastView } from './components/ExtendedForecastView';
import { WeatherRadarMap } from './components/WeatherRadarMap';
import { DisasterAlertsView } from './components/DisasterAlertsView';
import { AQIGauge } from './components/AQIGauge';
import { AIChatbot } from './components/AIChatbot';
import { FavoritesView, POPULAR_CITIES } from './components/FavoritesView';
import { SettingsView } from './components/SettingsView';
import { WeatherReportModal } from './components/WeatherReportModal';
import { LoginModal, UserProfileData } from './components/LoginModal';
import { UserProfileView } from './components/UserProfileView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // User Profile State (Default to Mekala Dhanush / 248x1a4595)
  const [currentUser, setCurrentUser] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('skycast_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Mekala Dhanush',
      rollNo: '248x1a4595',
      email: '248x1a4595@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      role: 'AI & Backend Integration Lead',
      isLoggedIn: true,
      avatarSeed: 'Dhanush',
    };
  });

  // User Settings State
  const [unit, setUnit] = useState<UnitSystem>(() => {
    return (localStorage.getItem('skycast_unit') as UnitSystem) || 'metric';
  });
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('skycast_lang') as Language) || 'en';
  });
  const [openWeatherKey, setOpenWeatherKey] = useState<string>(() => {
    return localStorage.getItem('skycast_owm_key') || '';
  });

  // Location State (Default to Guntur / Andhra Pradesh, matching user's college email context)
  const [location, setLocation] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem('skycast_active_loc');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Guntur',
      admin1: 'Andhra Pradesh',
      country: 'India',
      countryCode: 'IN',
      lat: 16.3067,
      lon: 80.4365,
    };
  });

  // Favorites & Search History State
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    const saved = localStorage.getItem('skycast_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { name: 'Guntur', admin1: 'Andhra Pradesh', country: 'India', lat: 16.3067, lon: 80.4365 },
      { name: 'Hyderabad', admin1: 'Telangana', country: 'India', lat: 17.385, lon: 78.4867 },
      { name: 'Vijayawada', admin1: 'Andhra Pradesh', country: 'India', lat: 16.5062, lon: 80.648 },
    ];
  });

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Weather & Telemetry Data State
  const [weatherData, setWeatherData] = useState<{
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  } | null>(null);
  const [aqiData, setAqiData] = useState<AirQualityData | null>(null);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [assessment, setAssessment] = useState<DisasterAssessment | null>(null);

  // UI status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [predictionLoading, setPredictionLoading] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Persist Settings
  const handleUnitChange = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    localStorage.setItem('skycast_unit', newUnit);
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('skycast_lang', newLang);
  };

  const handleSaveOpenWeatherKey = (key: string) => {
    setOpenWeatherKey(key);
    localStorage.setItem('skycast_owm_key', key);
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced City Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setSearchLoading(false);
      setSearchOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Main Data Fetcher
  const loadWeatherData = async (loc: GeoLocation, showFullLoader = true) => {
    if (showFullLoader) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch live meteorological physics from Open-Meteo
      const weather = await fetchWeatherData(loc.lat, loc.lon, lang);
      setWeatherData(weather);

      // 2. Fetch live Air Quality & Atmospheric Gases
      const aqi = await fetchAirQualityData(loc.lat, loc.lon);
      setAqiData(aqi);

      // 3. Compute live severe weather disaster hazard alerts
      const currentAlerts = computeDisasterAlerts(weather.current, weather.hourly, weather.daily, loc.name, lang);
      setAlerts(currentAlerts);

      // 4. Fetch Gemini 3.8 AI Deep Forecast Insights
      fetchAIPrediction(loc, weather.current, weather, aqi);

      // 5. Fetch Disaster Risk Assessment from AI
      fetchDisasterRisk(loc, weather.current, weather);
    } catch (err) {
      console.error('Failed to load weather telemetry:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch AI Prediction
  const fetchAIPrediction = async (
    loc: GeoLocation,
    current: CurrentWeather,
    forecast: { hourly: HourlyForecast[]; daily: DailyForecast[] },
    aqi: AirQualityData
  ) => {
    setPredictionLoading(true);
    try {
      const res = await fetch('/api/gemini/forecast-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: loc,
          currentWeather: current,
          forecast,
          aqi,
          language: lang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      }
    } catch (e) {
      console.warn('AI analysis call error:', e);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Fetch Disaster Risk
  const fetchDisasterRisk = async (
    loc: GeoLocation,
    current: CurrentWeather,
    forecast: { hourly: HourlyForecast[]; daily: DailyForecast[] }
  ) => {
    try {
      const res = await fetch('/api/gemini/disaster-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: loc,
          currentWeather: current,
          forecast,
          language: lang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
      }
    } catch (e) {
      console.warn('Disaster risk call error:', e);
    }
  };

  // Trigger load on location or language change
  useEffect(() => {
    loadWeatherData(location);
    localStorage.setItem('skycast_active_loc', JSON.stringify(location));
  }, [location.lat, location.lon, lang]);

  // Handle Location Selection
  const handleSelectLocation = (loc: GeoLocation) => {
    setLocation(loc);
    setSearchQuery('');
    setSearchOpen(false);
  };

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsRefreshing(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        setLocation(resolved);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setIsRefreshing(false);
      },
      { timeout: 10000 }
    );
  };

  // Toggle Favorite
  const isFavorite = favorites.some((f) => f.name.toLowerCase() === location.name.toLowerCase());
  const toggleFavorite = () => {
    let updated: GeoLocation[];
    if (isFavorite) {
      updated = favorites.filter((f) => f.name.toLowerCase() !== location.name.toLowerCase());
    } else {
      updated = [location, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem('skycast_favorites', JSON.stringify(updated));
  };

  const removeFavorite = (loc: GeoLocation) => {
    const updated = favorites.filter((f) => f.name.toLowerCase() !== loc.name.toLowerCase());
    setFavorites(updated);
    localStorage.setItem('skycast_favorites', JSON.stringify(updated));
  };

  const addQuickCity = (loc: GeoLocation) => {
    if (!favorites.some((f) => f.name.toLowerCase() === loc.name.toLowerCase())) {
      const updated = [loc, ...favorites];
      setFavorites(updated);
      localStorage.setItem('skycast_favorites', JSON.stringify(updated));
    }
  };

  // Nav Items definition
  const navItems = [
    { id: 'dashboard', label: lang === 'te' ? 'డ్యాష్‌బోర్డ్' : 'Smart Dashboard', icon: LayoutDashboard },
    { id: 'ai-prediction', label: lang === 'te' ? 'AI అంచనా కేంద్రం' : 'AI Prediction Center', icon: Brain },
    { id: 'forecast', label: lang === 'te' ? '7-రోజుల సూచన' : '7-Day Forecast', icon: Calendar },
    { id: 'radar', label: lang === 'te' ? 'వాతావరణ రాడార్' : 'Live Weather Radar', icon: Layers },
    {
      id: 'alerts',
      label: lang === 'te' ? 'విపత్తు హెచ్చరికలు' : 'Disaster Alerts',
      icon: ShieldAlert,
      badge: alerts.length > 0 ? alerts.length : null,
    },
    { id: 'air-quality', label: lang === 'te' ? 'గాలి నాణ్యత (AQI)' : 'Air Quality (AQI)', icon: Wind },
    { id: 'chatbot', label: lang === 'te' ? 'AI అసిస్టెంట్' : 'AI Meteorologist', icon: Bot },
    { id: 'favorites', label: lang === 'te' ? 'ఇష్టమైన నగరాలు' : 'Saved Stations', icon: Star },
    { id: 'profile', label: lang === 'te' ? 'స్టూడెంట్ ప్రొఫైల్ & టీమ్' : 'Profile & Flutter Team', icon: User },
    { id: 'settings', label: lang === 'te' ? 'సెట్టింగ్స్ & స్పెక్స్' : 'Settings & Specs', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Status Beacon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
                  SkyCast <span className="text-cyan-400 font-mono">AI</span>
                </span>
                <span className="text-[9px] font-mono font-semibold uppercase text-cyan-400/80 tracking-wider block">
                  Meteorological Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Global City Search Bar */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden sm:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                placeholder={
                  lang === 'te'
                    ? 'నగరాన్ని వెతకండి (ఉదా: Guntur, Hyderabad, London)...'
                    : 'Search global cities (e.g. Guntur, London, Tokyo)...'
                }
                className="w-full bg-slate-900/90 text-slate-200 text-xs pl-10 pr-10 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 font-sans shadow-inner"
              />
              {searchLoading && (
                <RefreshCw className="absolute right-3.5 w-4 h-4 animate-spin text-cyan-400" />
              )}
            </div>

            {/* Dropdown Suggestions */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5 max-h-72 overflow-y-auto">
                {searchResults.map((res) => (
                  <button
                    key={`${res.name}-${res.lat}-${res.lon}`}
                    onClick={() => handleSelectLocation(res)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{res.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 ml-5">
                        {res.admin1 ? `${res.admin1}, ` : ''}{res.country}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {res.lat.toFixed(2)}°, {res.lon.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Action Utilities */}
          <div className="flex items-center gap-2">
            {/* Current GPS Location trigger */}
            <button
              onClick={handleUseMyLocation}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-all text-xs flex items-center gap-1.5 shadow-sm"
              title="Detect my GPS location"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline font-mono">My GPS</span>
            </button>

            {/* Favorite active city bookmark star */}
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-400/50'
                  : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Bookmark city'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Unit Toggle °C / °F */}
            <button
              onClick={() => handleUnitChange(unit === 'metric' ? 'imperial' : 'metric')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-cyan-300 hover:bg-slate-800 transition-all"
              title="Toggle Temperature Units"
            >
              {unit === 'metric' ? '°C' : '°F'}
            </button>

            {/* Language Toggle EN / TE */}
            <button
              onClick={() => handleLangChange(lang === 'en' ? 'te' : 'en')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-1"
              title="Toggle Telugu / English"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'EN' : 'తెలుగు'}</span>
            </button>

            {/* Download Printable Dossier Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dossier</span>
            </button>

            {/* Login / Student Profile Button (Top Right Header) */}
            <button
              onClick={() => {
                if (currentUser.isLoggedIn) {
                  setActiveTab('profile');
                } else {
                  setLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all group"
              title={currentUser.isLoggedIn ? `Profile: ${currentUser.name} (${currentUser.rollNo})` : 'Student Login'}
            >
              <div className="w-5 h-5 rounded-lg bg-slate-950 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline whitespace-nowrap">
                {currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
              <LogIn className="w-3.5 h-3.5 sm:hidden" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-2">
          <div className="glass-panel rounded-2xl p-3 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 px-3 py-1 block">
              SYSTEM MODULES
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Active Station Card on Sidebar */}
          <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Active Node
              </span>
              <span>Online</span>
            </div>
            <div className="text-sm font-bold text-white">{location.name}</div>
            <div className="text-[11px] text-slate-400">{location.country}</div>
            {weatherData && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <span className="text-white font-bold">{weatherData.current.temp}°C</span>
                <span className="text-cyan-300">{weatherData.current.condition}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-md flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white">SkyCast Navigation</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {isLoading || !weatherData || !aqiData ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="absolute inset-0 rounded-3xl bg-cyan-400/10 blur-xl"></span>
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'te'
                  ? 'వాతావరణ ఉపగ్రహ సమాచారాన్ని పొందుతోంది...'
                  : 'Synthesizing atmospheric satellite telemetry for ' + location.name + '...'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Calibrating ECMWF, GFS & WMO Physics Model</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  location={location}
                  current={weatherData.current}
                  hourly={weatherData.hourly}
                  daily={weatherData.daily}
                  aqi={aqiData}
                  alerts={alerts}
                  prediction={prediction}
                  unit={unit}
                  lang={lang}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  onRefresh={() => loadWeatherData(location, false)}
                  isRefreshing={isRefreshing}
                />
              )}

              {activeTab === 'ai-prediction' && (
                <AIPredictionCard
                  prediction={prediction}
                  loading={predictionLoading}
                  onRefresh={() => fetchAIPrediction(location, weatherData.current, weatherData, aqiData)}
                  location={location}
                  current={weatherData.current}
                  lang={lang}
                />
              )}

              {activeTab === 'forecast' && (
                <ExtendedForecastView daily={weatherData.daily} unit={unit} lang={lang} />
              )}

              {activeTab === 'radar' && (
                <div className="space-y-4 h-[720px] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {lang === 'te' ? 'ప్రత్యక్ష వాతావరణ రాడార్ మ్యాప్' : 'Interactive Weather Radar & Atmospheric Map'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        High-resolution radar loops, cloud reflectance, thermal gradients, and severe disaster hazard zones.
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <WeatherRadarMap
                      location={location}
                      temp={weatherData.current.temp}
                      condition={weatherData.current.condition}
                      alerts={alerts}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <DisasterAlertsView
                  alerts={alerts}
                  assessment={assessment}
                  location={location}
                  lang={lang}
                />
              )}

              {activeTab === 'air-quality' && (
                <AQIGauge aqiData={aqiData} cityName={location.name} lang={lang} />
              )}

              {activeTab === 'chatbot' && (
                <AIChatbot
                  location={location}
                  current={weatherData.current}
                  aqi={aqiData}
                  lang={lang}
                />
              )}

              {activeTab === 'favorites' && (
                <FavoritesView
                  favorites={favorites}
                  onSelectCity={(loc) => {
                    handleSelectLocation(loc);
                    setActiveTab('dashboard');
                  }}
                  onRemoveFavorite={removeFavorite}
                  onAddQuickCity={addQuickCity}
                  unit={unit}
                  lang={lang}
                />
              )}

              {activeTab === 'profile' && (
                <UserProfileView
                  user={currentUser}
                  onOpenLogin={() => setLoginModalOpen(true)}
                  onUpdateUser={(updatedUser) => {
                    setCurrentUser(updatedUser);
                    localStorage.setItem('skycast_user', JSON.stringify(updatedUser));
                  }}
                  lang={lang}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  unit={unit}
                  onUnitChange={handleUnitChange}
                  lang={lang}
                  onLangChange={handleLangChange}
                  openWeatherKey={openWeatherKey}
                  onSaveOpenWeatherKey={handleSaveOpenWeatherKey}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Printable / Downloadable Official Dossier Modal */}
      {weatherData && aqiData && (
        <WeatherReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          location={location}
          current={weatherData.current}
          aqi={aqiData}
          prediction={prediction}
          daily={weatherData.daily}
          alerts={alerts}
        />
      )}

      {/* Student / Contributor Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={(updatedUser) => {
          setCurrentUser(updatedUser);
          localStorage.setItem('skycast_user', JSON.stringify(updatedUser));
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden sticky bottom-0 z-40 w-full glass-panel border-t border-white/10 bg-slate-950/90 backdrop-blur-xl px-2 py-1.5 flex justify-around items-center">
        {[navItems[0], navItems[3], navItems[4], navItems[6], navItems[8]].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all relative ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
