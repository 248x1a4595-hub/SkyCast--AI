import React from 'react';
import { Star, MapPin, Trash2, ArrowRight, Plus, CloudSun, Compass, Shield } from 'lucide-react';
import { GeoLocation, UnitSystem, Language } from '../types/weather';

interface FavoritesViewProps {
  favorites: GeoLocation[];
  onSelectCity: (loc: GeoLocation) => void;
  onRemoveFavorite: (loc: GeoLocation) => void;
  onAddQuickCity: (loc: GeoLocation) => void;
  unit: UnitSystem;
  lang?: Language;
}

export const POPULAR_CITIES: GeoLocation[] = [
  { name: 'Guntur', admin1: 'Andhra Pradesh', country: 'India', lat: 16.3067, lon: 80.4365 },
  { name: 'Hyderabad', admin1: 'Telangana', country: 'India', lat: 17.385, lon: 78.4867 },
  { name: 'Vijayawada', admin1: 'Andhra Pradesh', country: 'India', lat: 16.5062, lon: 80.648 },
  { name: 'Bengaluru', admin1: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
  { name: 'New Delhi', admin1: 'Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'London', admin1: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', admin1: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
];

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onAddQuickCity,
  lang = 'en',
}) => {
  const isTelugu = lang === 'te';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{isTelugu ? 'ఇష్టమైన నగరాల జాబితా' : 'Bookmarked Meteorological Stations'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isTelugu ? 'మీ ఇష్టమైన నగరాలు' : 'Saved Locations & Regional Telemetry'}
          </h2>
          <p className="text-xs text-slate-300">
            Instant 1-click access to multiple microclimates and disaster watch stations.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-300">
          {favorites.length} Locations Saved
        </div>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto border border-white/10">
            <Star className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isTelugu ? 'ఇంకా ఎటువంటి నగరాలు సేవ్ చేయలేదు' : 'No Favorite Cities Bookmarked Yet'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isTelugu
              ? 'శోధన బార్ ద్వారా నగరాన్ని వెతికి స్టార్ గుర్తుపై క్లిక్ చేయడం ద్వారా లేదా క్రింది ప్రముఖ నగరాల నుండి జోడించండి.'
              : 'Bookmark any city using the star icon in the header or choose from the suggested metropolitan regions below.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((loc) => (
            <div
              key={`${loc.name}-${loc.lat}`}
              className="glass-card-interactive rounded-2xl p-5 border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{loc.country}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(loc);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                  {loc.name}
                </h3>
                {loc.admin1 && <p className="text-xs text-slate-400">{loc.admin1}</p>}
                <div className="text-[11px] font-mono text-slate-500 mt-2">
                  Coordinates: {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Tap to load full dashboard</span>
                <button
                  onClick={() => onSelectCity(loc)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Quick Add Cities */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>{isTelugu ? 'త్వరిత నగరాలు జోడించండి' : 'Quick Explore Recommended Regions'}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_CITIES.map((city) => {
            const isAlreadyFav = favorites.some((f) => f.name.toLowerCase() === city.name.toLowerCase());
            return (
              <div
                key={city.name}
                onClick={() => onSelectCity(city)}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {city.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{city.country}</div>
                </div>

                {!isAlreadyFav && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddQuickCity(city);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                    title="Bookmark city"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
