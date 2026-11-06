export interface GeoLocation {
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  wind_gusts?: number;
  uv_index: number;
  visibility: number;
  condition: string;
  conditionCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  precipitation: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feels_like: number;
  precipitation_probability: number;
  precipitation: number;
  condition: string;
  conditionCode: number;
  wind_speed: number;
  humidity: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  max_temp: number;
  min_temp: number;
  precipitation_sum: number;
  precipitation_probability: number;
  condition: string;
  conditionCode: number;
  wind_speed_max: number;
  uv_index_max: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  aqi: number;
  status: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor' | 'Hazardous';
  color: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  uv: number;
  dominantPollutant: string;
  healthAdvice: string;
}

export interface AIPrediction {
  summary: string;
  temperatureTrend: string;
  anomalies: string;
  confidenceScore: number;
  confidenceRationale: string;
  impacts: {
    agriculture: string;
    travel: string;
    health: string;
  };
  aiModel?: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  type: string;
  severity: 'Watch' | 'Advisory' | 'Warning';
  description: string;
  safetyInstruction: string;
  effectiveTime: string;
  area: string;
}

export interface DisasterAssessment {
  threatLevel: string;
  overallRiskScore: number;
  risks: {
    type: string;
    level: string;
    description: string;
    safetyInstruction: string;
  }[];
  emergencyChecklist: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  source?: string;
}

export type UnitSystem = 'metric' | 'imperial';
export type Language = 'en' | 'te';
