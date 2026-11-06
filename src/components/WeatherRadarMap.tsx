import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Layers, MapPin, Eye, CloudRain, Sun, Wind, ShieldAlert } from 'lucide-react';
import { GeoLocation, DisasterAlert } from '../types/weather';

interface WeatherRadarMapProps {
  location: GeoLocation;
  temp: number;
  condition: string;
  alerts: DisasterAlert[];
}

export const WeatherRadarMap: React.FC<WeatherRadarMapProps> = ({
  location,
  temp,
  condition,
  alerts,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<'radar' | 'clouds' | 'temp' | 'wind'>('radar');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [radarTimestamps, setRadarTimestamps] = useState<number[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [radarHost, setRadarHost] = useState<string>('https://tilecache.rainviewer.com');

  // Fetch live RainViewer radar frames
  useEffect(() => {
    let isMounted = true;
    async function loadRadarFrames() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok) {
          const data = await res.json();
          if (data.radar && data.radar.past && data.radar.past.length > 0) {
            const frames = [...data.radar.past.map((f: any) => f.time), ...(data.radar.nowcast?.map((f: any) => f.time) || [])];
            if (isMounted) {
              setRadarTimestamps(frames);
              setCurrentFrameIndex(frames.length - 1);
              if (data.host) setRadarHost(data.host);
            }
          }
        }
      } catch (e) {
        console.warn('RainViewer API fallback:', e);
      }
    }
    loadRadarFrames();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lon],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // CartoDB Dark Matter base map for ultra sleek sci-fi meteorology UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.flyTo([location.lat, location.lon], 7, { duration: 1.5 });

    // Update location marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    const customIcon = L.divIcon({
      className: 'custom-weather-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-500/20 animate-ping"></div>
          <div class="w-7 h-7 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/50">
            ${temp}°
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([location.lat, location.lon], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div class="p-2 text-slate-100">
        <h4 class="font-bold text-sm text-cyan-400">${location.name}</h4>
        <p class="text-xs text-slate-300">${condition} • ${temp}°C</p>
        ${alerts.length > 0 ? `<p class="text-xs text-amber-400 mt-1 font-semibold">⚠️ ${alerts.length} Active Hazard(s)</p>` : ''}
      </div>
    `);
    markerRef.current = marker;

    // Draw hazard risk rings if alerts exist
    if (alerts.length > 0) {
      const circle = L.circle([location.lat, location.lon], {
        radius: 45000,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 8',
      }).addTo(map);

      return () => {
        circle.remove();
      };
    }
  }, [location.lat, location.lon, temp, condition, alerts]);

  // Update Weather Layer (Radar / OpenWeather / Open-Meteo tiles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarLayerRef.current) {
      radarLayerRef.current.remove();
      radarLayerRef.current = null;
    }

    if (activeLayer === 'radar' && radarTimestamps.length > 0) {
      const timestamp = radarTimestamps[currentFrameIndex] || radarTimestamps[radarTimestamps.length - 1];
      const radarUrl = `${radarHost}/v2/radar/${timestamp}/512/{z}/{x}/{y}/2/1_1.png`;
      const layer = L.tileLayer(radarUrl, {
        opacity: 0.75,
        zIndex: 10,
      }).addTo(map);
      radarLayerRef.current = layer;
    } else if (activeLayer === 'clouds') {
      // Cloud satellite layer via OpenWeather tile cache or public satellite
      const cloudLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
        { opacity: 0.6, zIndex: 10 }
      ).addTo(map);
      radarLayerRef.current = cloudLayer;
    } else if (activeLayer === 'temp') {
      const tempLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
        { opacity: 0.65, zIndex: 10 }
      ).addTo(map);
      radarLayerRef.current = tempLayer;
    } else if (activeLayer === 'wind') {
      const windLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
        { opacity: 0.65, zIndex: 10 }
      ).addTo(map);
      radarLayerRef.current = windLayer;
    }
  }, [activeLayer, currentFrameIndex, radarTimestamps, radarHost]);

  // Radar Animation Loop
  useEffect(() => {
    if (!isPlaying || activeLayer !== 'radar' || radarTimestamps.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % radarTimestamps.length);
    }, 800);

    return () => clearInterval(timer);
  }, [isPlaying, activeLayer, radarTimestamps.length]);

  const frameTime = radarTimestamps[currentFrameIndex]
    ? new Date(radarTimestamps[currentFrameIndex] * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live Now';

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 flex flex-col">
      {/* Map Header / Layer Selectors */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={() => setActiveLayer('radar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeLayer === 'radar'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          Precipitation Radar
        </button>
        <button
          onClick={() => setActiveLayer('clouds')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeLayer === 'clouds'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Satellite Clouds
        </button>
        <button
          onClick={() => setActiveLayer('temp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeLayer === 'temp'
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          Thermal Heatmap
        </button>
        <button
          onClick={() => setActiveLayer('wind')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeLayer === 'wind'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          Wind Velocity
        </button>
      </div>

      {/* Live Indicator & Hazard Alert chip */}
      <div className="absolute top-4 right-14 z-20 flex items-center gap-2">
        {alerts.length > 0 && (
          <div className="bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-red-500/30 animate-pulse backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5" />
            {alerts.length} Active Hazard Zone
          </div>
        )}
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>RADAR FEED: {frameTime}</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[440px]" />

      {/* Radar Timeline Player Controls */}
      {activeLayer === 'radar' && radarTimestamps.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/30"
              title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentFrameIndex(0)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Rewind to start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-slate-300 ml-1 whitespace-nowrap">
              {frameTime}
            </span>
          </div>

          <div className="flex-1 w-full flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">Past</span>
            <input
              type="range"
              min={0}
              max={radarTimestamps.length - 1}
              value={currentFrameIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrameIndex(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Nowcast</span>
          </div>

          {/* Color Scale legend */}
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10 text-[10px] text-slate-400">
            <span>Light</span>
            <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-600"></div>
            <span>Severe</span>
          </div>
        </div>
      )}
    </div>
  );
};
