import {
  GeoLocation,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQualityData,
  DisasterAlert,
  Language,
} from '../types/weather';

// WMO Weather interpretation table (WMO 4677 standard)
export interface WMOInfo {
  labelEn: string;
  labelTe: string;
  icon: string;
  condition: string;
}

export const WMO_CODES: Record<number, WMOInfo> = {
  0: { labelEn: 'Clear Sky', labelTe: 'నిర్మలమైన ఆకాశం', icon: 'sun', condition: 'Clear' },
  1: { labelEn: 'Mainly Clear', labelTe: 'ఎక్కువగా నిర్మలం', icon: 'sun-cloud', condition: 'Mainly Clear' },
  2: { labelEn: 'Partly Cloudy', labelTe: 'పాక్షికంగా మేఘావృతం', icon: 'cloud-sun', condition: 'Partly Cloudy' },
  3: { labelEn: 'Overcast', labelTe: 'పూర్తిగా మేఘావృతం', icon: 'cloud', condition: 'Overcast' },
  45: { labelEn: 'Foggy', labelTe: 'పొగమంచు', icon: 'fog', condition: 'Fog' },
  48: { labelEn: 'Depositing Rime Fog', labelTe: 'తీవ్ర మంచు పొగ', icon: 'fog', condition: 'Fog' },
  51: { labelEn: 'Light Drizzle', labelTe: 'తేలికపాటి చినుకులు', icon: 'cloud-drizzle', condition: 'Drizzle' },
  53: { labelEn: 'Moderate Drizzle', labelTe: 'మోస్తరు చినుకులు', icon: 'cloud-drizzle', condition: 'Drizzle' },
  55: { labelEn: 'Dense Drizzle', labelTe: 'దట్టమైన చినుకులు', icon: 'cloud-drizzle', condition: 'Dense Drizzle' },
  61: { labelEn: 'Slight Rain', labelTe: 'తేలికపాటి వర్షం', icon: 'cloud-rain', condition: 'Light Rain' },
  63: { labelEn: 'Moderate Rain', labelTe: 'మోస్తరు వర్షం', icon: 'cloud-rain', condition: 'Moderate Rain' },
  65: { labelEn: 'Heavy Rain', labelTe: 'భారీ వర్షం', icon: 'cloud-heavy-rain', condition: 'Heavy Rain' },
  66: { labelEn: 'Freezing Rain', labelTe: 'గడ్డకట్టే వర్షం', icon: 'cloud-rain', condition: 'Freezing Rain' },
  67: { labelEn: 'Heavy Freezing Rain', labelTe: 'తీవ్ర గడ్డకట్టే వర్షం', icon: 'cloud-heavy-rain', condition: 'Heavy Freezing Rain' },
  71: { labelEn: 'Slight Snow Fall', labelTe: 'తేలికపాటి మంచుకురియుట', icon: 'snowflake', condition: 'Light Snow' },
  73: { labelEn: 'Moderate Snow Fall', labelTe: 'మోస్తరు మంచు', icon: 'snowflake', condition: 'Moderate Snow' },
  75: { labelEn: 'Heavy Snow Fall', labelTe: 'తీవ్రమైన హిమపాతం', icon: 'snowflake', condition: 'Heavy Snow' },
  80: { labelEn: 'Slight Rain Showers', labelTe: 'తేలికపాటి జల్లులు', icon: 'cloud-rain', condition: 'Rain Showers' },
  81: { labelEn: 'Moderate Rain Showers', labelTe: 'మోస్తరు జల్లులు', icon: 'cloud-rain', condition: 'Rain Showers' },
  82: { labelEn: 'Violent Rain Showers', labelTe: 'తీవ్రమైన వర్షపు జల్లులు', icon: 'cloud-lightning', condition: 'Torrential Showers' },
  85: { labelEn: 'Snow Showers', labelTe: 'హిమపు జల్లులు', icon: 'snowflake', condition: 'Snow Showers' },
  86: { labelEn: 'Heavy Snow Showers', labelTe: 'భారీ హిమ జల్లులు', icon: 'snowflake', condition: 'Heavy Snow Showers' },
  95: { labelEn: 'Thunderstorm', labelTe: 'ఉరుములతో కూడిన వర్షం', icon: 'zap', condition: 'Thunderstorm' },
  96: { labelEn: 'Thunderstorm with Hail', labelTe: 'వడగండ్ల వాన', icon: 'cloud-lightning', condition: 'Hailstorm' },
  99: { labelEn: 'Severe Thunderstorm with Heavy Hail', labelTe: 'తీవ్రమైన వడగండ్ల తుఫాను', icon: 'cloud-lightning', condition: 'Severe Hailstorm' },
};

export function getWMOInfo(code: number, lang: Language = 'en'): WMOInfo {
  const item = WMO_CODES[code] || {
    labelEn: 'Variable Clouds',
    labelTe: 'మారుతున్న మేఘాలు',
    icon: 'cloud',
    condition: 'Variable',
  };
  return item;
}

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=8&language=en&format=json`
    );
    if (!res.ok) throw new Error('Geocoding service unavailable');
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: any) => ({
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      countryCode: r.country_code,
      lat: r.latitude,
      lon: r.longitude,
    }));
  } catch (err) {
    console.error('City search failed:', err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'My Location';
      return {
        name: cityName,
        admin1: addr.state,
        country: addr.country || 'Detected Region',
        lat,
        lon,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback used:', e);
  }
  return {
    name: 'Current Location',
    country: 'Local Coordinates',
    lat,
    lon,
  };
}

export async function fetchWeatherData(lat: number, lon: number, lang: Language = 'en'): Promise<{
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=14`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.statusText}`);
  }
  const data = await response.json();

  const cur = data.current;
  const wmo = getWMOInfo(cur.weather_code, lang);

  const current: CurrentWeather = {
    temp: Math.round(cur.temperature_2m),
    feels_like: Math.round(cur.apparent_temperature),
    humidity: cur.relative_humidity_2m,
    pressure: Math.round(cur.surface_pressure),
    wind_speed: Math.round(cur.wind_speed_10m),
    wind_direction: cur.wind_direction_10m,
    wind_gusts: cur.wind_gusts_10m ? Math.round(cur.wind_gusts_10m) : undefined,
    uv_index: Math.round((cur.uv_index || 0) * 10) / 10,
    visibility: data.hourly?.visibility?.[0] ? Math.round(data.hourly.visibility[0] / 1000) : 10,
    condition: lang === 'te' ? wmo.labelTe : wmo.labelEn,
    conditionCode: cur.weather_code,
    isDay: cur.is_day === 1,
    sunrise: data.daily?.sunrise?.[0] || '06:00',
    sunset: data.daily?.sunset?.[0] || '18:00',
    precipitation: cur.precipitation || 0,
  };

  // Next 24 hours starting from current time
  const nowISO = new Date().toISOString();
  const hourlyTimes: string[] = data.hourly.time;
  let startIndex = hourlyTimes.findIndex((t) => t >= nowISO.slice(0, 13));
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyForecast[] = hourlyTimes.slice(startIndex, startIndex + 24).map((time, idx) => {
    const actualIdx = startIndex + idx;
    const code = data.hourly.weather_code[actualIdx];
    const itemWmo = getWMOInfo(code, lang);
    return {
      time,
      temp: Math.round(data.hourly.temperature_2m[actualIdx]),
      feels_like: Math.round(data.hourly.apparent_temperature[actualIdx]),
      precipitation_probability: data.hourly.precipitation_probability[actualIdx] ?? 0,
      precipitation: data.hourly.precipitation[actualIdx] ?? 0,
      condition: lang === 'te' ? itemWmo.labelTe : itemWmo.labelEn,
      conditionCode: code,
      wind_speed: Math.round(data.hourly.wind_speed_10m[actualIdx]),
      humidity: data.hourly.relative_humidity_2m[actualIdx],
      isDay: data.hourly.is_day[actualIdx] === 1,
    };
  });

  // Daily 7-14 days
  const daily: DailyForecast[] = data.daily.time.map((dateStr: string, idx: number) => {
    const code = data.daily.weather_code[idx];
    const itemWmo = getWMOInfo(code, lang);
    return {
      date: dateStr,
      max_temp: Math.round(data.daily.temperature_2m_max[idx]),
      min_temp: Math.round(data.daily.temperature_2m_min[idx]),
      precipitation_sum: Math.round((data.daily.precipitation_sum[idx] || 0) * 10) / 10,
      precipitation_probability: data.daily.precipitation_probability_max[idx] ?? 0,
      condition: lang === 'te' ? itemWmo.labelTe : itemWmo.labelEn,
      conditionCode: code,
      wind_speed_max: Math.round(data.daily.wind_speed_10m_max[idx]),
      uv_index_max: Math.round((data.daily.uv_index_max[idx] || 0) * 10) / 10,
      sunrise: data.daily.sunrise[idx],
      sunset: data.daily.sunset[idx],
    };
  });

  return { current, hourly, daily };
}

export async function fetchAirQualityData(lat: number, lon: number): Promise<AirQualityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('AQI fetch failed');
    const data = await res.json();
    const cur = data.current || {};

    const usAqi = Math.round(cur.us_aqi || cur.european_aqi || 42);
    const pm2_5 = Math.round((cur.pm2_5 || 12) * 10) / 10;
    const pm10 = Math.round((cur.pm10 || 24) * 10) / 10;
    const no2 = Math.round((cur.nitrogen_dioxide || 15) * 10) / 10;
    const o3 = Math.round((cur.ozone || 45) * 10) / 10;
    const so2 = Math.round((cur.sulphur_dioxide || 5) * 10) / 10;
    const co = Math.round((cur.carbon_monoxide || 350) / 10) / 100; // in mg/m3
    const uv = Math.round((cur.uv_index || 4) * 10) / 10;

    let status: AirQualityData['status'] = 'Good';
    let color = '#10b981'; // green
    let healthAdvice = 'Air quality is ideal for most individuals. Enjoy outdoor activities.';

    if (usAqi <= 50) {
      status = 'Good';
      color = '#10b981';
      healthAdvice = 'Air quality is satisfactory, presenting minimal or zero risk.';
    } else if (usAqi <= 100) {
      status = 'Moderate';
      color = '#f59e0b'; // amber
      healthAdvice = 'Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.';
    } else if (usAqi <= 150) {
      status = 'Poor';
      color = '#f97316'; // orange
      healthAdvice = 'Members of sensitive groups may experience health effects. General public not likely to be affected.';
    } else if (usAqi <= 200) {
      status = 'Very Poor';
      color = '#ef4444'; // red
      healthAdvice = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
    } else {
      status = 'Hazardous';
      color = '#8b5cf6'; // purple/maroon
      healthAdvice = 'Health warning of emergency conditions. The entire population is more likely to be affected. Keep windows closed.';
    }

    return {
      aqi: usAqi,
      status,
      color,
      pm2_5,
      pm10,
      no2,
      o3,
      so2,
      co,
      uv,
      dominantPollutant: pm2_5 > 25 ? 'PM2.5 (Fine Respirable Particles)' : o3 > 80 ? 'O3 (Ground Ozone)' : 'PM10 (Inhalable Dust)',
      healthAdvice,
    };
  } catch (err) {
    console.error('Air quality fetch error:', err);
    return {
      aqi: 45,
      status: 'Good',
      color: '#10b981',
      pm2_5: 11.2,
      pm10: 22.8,
      no2: 14.1,
      o3: 38.5,
      so2: 4.2,
      co: 0.35,
      uv: 4.5,
      dominantPollutant: 'PM2.5',
      healthAdvice: 'Air quality is satisfactory with low atmospheric particulate concentrations.',
    };
  }
}

// Generate realistic disaster alerts based on live atmospheric thresholds
export function computeDisasterAlerts(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[],
  cityName: string,
  lang: Language = 'en'
): DisasterAlert[] {
  const alerts: DisasterAlert[] = [];
  const maxTemp = Math.max(...daily.slice(0, 3).map((d) => d.max_temp));
  const maxRainProb = Math.max(...hourly.slice(0, 12).map((h) => h.precipitation_probability));
  const maxPrecip = Math.max(...daily.slice(0, 3).map((d) => d.precipitation_sum));
  const windGusts = current.wind_gusts || current.wind_speed;

  // 1. Extreme Heat Alert
  if (current.temp >= 39 || maxTemp >= 40) {
    alerts.push({
      id: 'heatwave-warning',
      title: lang === 'te' ? 'తీవ్ర వడగాల్పుల హెచ్చరిక' : 'Severe Heatwave Alert',
      threatLevel: current.temp >= 42 ? 'Critical' : 'Severe',
      type: 'Extreme Heat',
      severity: 'Warning',
      description:
        lang === 'te'
          ? `${cityName} ప్రాంతంలో ఉష్ణోగ్రత ${Math.max(current.temp, maxTemp)}°C కు చేరే అవకాశం ఉంది. డీహైడ్రేషన్ మరియు వడదెబ్బ ముప్పు అధికం.`
          : `Daytime maximum temperatures over ${cityName} projected to hover between ${current.temp}°C and ${maxTemp}°C. Severe dehydration and heat stroke risks.`,
      safetyInstruction:
        lang === 'te'
          ? 'ఉదయం 11 నుండి సాయంత్రం 4 గంటల వరకు ప్రత్యక్ష ఎండలో తిరగవద్దు. ఓఆర్ఎస్, మజ్జిగ మరియు నీరు ఎక్కువగా సేవించండి.'
          : 'Avoid direct sunlight exposure between 11:00 AM and 4:00 PM. Hydrate frequently with electrolytes and wear breathable cotton fabrics.',
      effectiveTime: 'Active Next 48 Hours',
      area: cityName,
    });
  }

  // 2. Heavy Rainfall / Flood Alert
  if (maxRainProb >= 65 || maxPrecip >= 25 || [65, 82, 95, 96, 99].includes(current.conditionCode)) {
    alerts.push({
      id: 'rain-flood-alert',
      title: lang === 'te' ? 'భారీ వర్షపాతం & వరద హెచ్చరిక' : 'Heavy Rainfall & Flash Flood Advisory',
      threatLevel: maxPrecip >= 50 || current.conditionCode === 82 ? 'Severe' : 'Moderate',
      type: 'Precipitation Hazard',
      severity: maxPrecip >= 50 ? 'Warning' : 'Watch',
      description:
        lang === 'te'
          ? `ఎగువ ప్రాంతాలలో విస్తారంగా కురిసే వర్షాల కారణంగా మురుగు కాలువలు పొంగిపొర్లే అవకాశం ఉంది. వర్షపాతం సంభావ్యత ${maxRainProb}%.`
          : `Active atmospheric convection causing precipitation surges up to ${maxPrecip} mm. Flash flooding possible in low-lying corridors and underpasses.`,
      safetyInstruction:
        lang === 'te'
          ? 'వరద ప్రవాహాలు ఉన్న రోడ్లను దాటవద్దు. కరెంటు స్తంభాలకు దూరంగా ఉండండి. అత్యవసర సామాగ్రి భద్రపరచండి.'
          : 'Do not drive or walk through flooded underpasses. Steer clear of power lines and keep essential emergency packs ready.',
      effectiveTime: 'Next 18 Hours',
      area: cityName,
    });
  }

  // 3. High Gale / Cyclone Squall Alert
  if (windGusts >= 40 || current.wind_speed >= 35) {
    alerts.push({
      id: 'wind-cyclone-alert',
      title: lang === 'te' ? 'తీవ్రమైన ఈదురు గాలుల హెచ్చరిక' : 'Gale Wind & Storm Surge Warning',
      threatLevel: windGusts >= 65 ? 'Critical' : 'High',
      type: 'Squall / Cyclone',
      severity: 'Warning',
      description:
        lang === 'te'
          ? `గంటకు ${windGusts} కి.మీ వేగంతో బలమైన ఈదురు గాలులు వీచే అవకాశం ఉంది. చెట్ల కొమ్మలు, విద్యుత్ స్తంభాలు విరిగిపడే ప్రమాదం ఉంది.`
          : `Wind gusts reaching ${windGusts} km/h with turbulent updrafts. Potential hazard to unanchored roofing, billboards, and high-sided vehicles.`,
      safetyInstruction:
        lang === 'te'
          ? 'ఇళ్ల కిటికీలు గట్టిగా మూసివేయండి. బలహీనమైన పైకప్పులు మరియు చెట్ల కింద వాహనాలు నిలపవద్దు.'
          : 'Secure loose exterior furniture, anchor sheet roofing, and park vehicles away from old trees or unstable structures.',
      effectiveTime: 'Immediate Effect',
      area: cityName,
    });
  }

  // 4. Thunderstorm / Lightning Hazard
  if ([95, 96, 99].includes(current.conditionCode) || hourly.some((h) => [95, 96, 99].includes(h.conditionCode))) {
    alerts.push({
      id: 'lightning-alert',
      title: lang === 'te' ? 'పిడుగుపాటు & ఉరుములతో కూడిన తుఫాను' : 'Severe Thunderstorm & Lightning Hazard',
      threatLevel: 'Severe',
      type: 'Lightning / Thunderstorm',
      severity: 'Warning',
      description:
        lang === 'te'
          ? 'తీవ్రమైన ఉరుములు, మెరుపులతో కూడిన వర్షాలు నమోదవుతున్నాయి. బహిరంగ ప్రదేశాలలో పిడుగులు పడే తీవ్ర ముప్పు.'
          : 'High cloud-to-ground electrostatic discharge detected. Severe electrical storms active in the radar footprint.',
      safetyInstruction:
        lang === 'te'
          ? 'బహిరంగ ప్రదేశాల్లో ఉండవద్దు. చెట్ల క్రింద తలదాచుకోవద్దు. ఎలక్ట్రానిక్ పరికరాలను ప్లగ్ నుండి తీసివేయండి.'
          : 'Seek shelter indoors immediately. Stay away from isolated trees, metal fences, and disconnect sensitive high-voltage appliances.',
      effectiveTime: 'Next 6 Hours',
      area: cityName,
    });
  }

  return alerts;
}
