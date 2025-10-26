import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from 'lucide-react';
import { format } from 'date-fns';

// --- TYPE DEFINITIONS ---
export type WeatherCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';
export type IconCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';

export type HourlyForecast = {
  time: string;
  temp: number;
  precipitation: number;
  condition: WeatherCondition;
};

export type DailyForecast = {
  date: string;
  temp: { max: number; min: number };
  condition: WeatherCondition;
  precipitation: number;
  humidity: number;
  wind: number; // Expecting km/h
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
};

export type WeatherData = {
  daily: DailyForecast[];
  minTemp: number;
  maxTemp: number;
};

// --- HELPER: Map OpenWeatherMap conditions to our types ---
const mapOwmCondition = (owmCondition: string): WeatherCondition => {
  const main = owmCondition.toLowerCase();
  if (main.includes('thunderstorm')) return 'Thunderstorm';
  if (main.includes('rain') || main.includes('drizzle')) return 'Rain';
  if (main.includes('clouds')) {
      if (main.includes('few') || main.includes('scattered')) return 'Partly Cloudy';
      return 'Cloudy';
  }
  if (main.includes('clear')) return 'Sunny';
  
  return 'Cloudy';
};

// --- HELPER: Returns a string identifier for an icon ---
export const getIconStringForCondition = (condition: WeatherCondition): IconCondition => {
    switch (condition) {
        case 'Sunny':
            return 'Sunny';
        case 'Partly Cloudy':
            return 'Partly Cloudy';
        case 'Cloudy':
            return 'Cloudy';
        case 'Rain':
            return 'Rain';
        case 'Thunderstorm':
            return 'Thunderstorm';
        default:
            return 'Sunny';
    }
};


// --- Data Transformation Function ---
export const transformOpenWeatherData = (owmData: any): WeatherData => {
  let minTempOverall = 100;
  let maxTempOverall = 0;

  const allHourlyData: HourlyForecast[] = owmData.hourly.map((hour: any) => ({
    time: new Date(hour.dt * 1000).toISOString(),
    temp: Math.round(hour.temp),
    precipitation: Math.round(hour.pop * 100),
    condition: mapOwmCondition(hour.weather[0].main),
  }));

  const dailyData: DailyForecast[] = owmData.daily.map((day: any, index: number) => {
    const minTemp = Math.round(day.temp.min);
    const maxTemp = Math.round(day.temp.max);
    
    if (minTemp < minTempOverall) minTempOverall = minTemp;
    if (maxTemp > maxTempOverall) maxTempOverall = maxTemp;

    return {
      date: new Date(day.dt * 1000).toISOString(),
      temp: { max: maxTemp, min: minTemp },
      condition: mapOwmCondition(day.weather[0].main),
      precipitation: Math.round(day.pop * 100),
      humidity: day.humidity,
      wind: Math.round(day.wind_speed * 3.6), // Convert m/s to km/h
      sunrise: format(new Date(day.sunrise * 1000), 'p'),
      sunset: format(new Date(day.sunset * 1000), 'p'),
      hourly: index === 0 ? allHourlyData.slice(0, 24) : [],
    };
  });

  return {
    daily: dailyData,
    minTemp: minTempOverall,
    maxTemp: maxTempOverall,
  };
};
