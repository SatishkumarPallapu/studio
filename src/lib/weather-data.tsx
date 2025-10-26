import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from 'lucide-react';
import { format } from 'date-fns';

// --- TYPE DEFINITIONS (Unchanged) ---
export type WeatherCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';

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
  hourly: HourlyForecast[]; // This will now contain 3-hour blocks
};

export type WeatherData = {
  daily: DailyForecast[];
  minTemp: number;
  maxTemp: number;
};

// --- ICON HELPER (Unchanged) ---
export const getIconForCondition = (condition: WeatherCondition, className: string) => {
    switch (condition) {
        case 'Sunny':
            return <Sun className={className} />;
        case 'Partly Cloudy':
            return <CloudSun className={className} />;
        case 'Cloudy':
            return <Cloud className={className} />;
        case 'Rain':
            return <CloudRain className={className} />;
        case 'Thunderstorm':
            return <CloudLightning className={className} />;
        default:
            return <Sun className={className} />;
    }
};

// --- OWM CONDITION MAPPER (Unchanged) ---
const mapOwmCondition = (owmCondition: string): WeatherCondition => {
  const main = owmCondition.toLowerCase();
  if (main.includes('thunderstorm')) return 'Thunderstorm';
  if (main.includes('rain') || main.includes('drizzle')) return 'Rain';
  if (main.includes('clouds')) {
      if (main.includes('few') || main.includes('scattered')) return 'Partly Cloudy';
      return 'Cloudy';
  }
  if (main.includes('clear')) return 'Sunny';
  return 'Cloudy'; // Fallback for mist, snow, haze etc.
};

// --- NEW: Data Transformation Function for 5-Day/3-Hour API ---
export const transformOpenWeatherData = (owmData: any): WeatherData => {
  if (!owmData.list || owmData.list.length === 0) {
    throw new Error("Invalid weather data format from OWM.");
  }

  let minTempOverall = 100;
  let maxTempOverall = 0;

  // Get sunrise/sunset from the 'city' object (it's consistent for the 5 days)
  const sunrise = format(new Date(owmData.city.sunrise * 1000), 'p');
  const sunset = format(new Date(owmData.city.sunset * 1000), 'p');

  // Group all 3-hour forecast blocks by day
  const dailyDataMap = new Map<string, any[]>();
  owmData.list.forEach((item: any) => {
    const dateKey = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
    if (!dailyDataMap.has(dateKey)) {
      dailyDataMap.set(dateKey, []);
    }
    dailyDataMap.get(dateKey)!.push(item);
  });

  const daily: DailyForecast[] = [];

  // Process each day's 3-hour blocks
  dailyDataMap.forEach((dayItems, date) => {
    let minTemp = 100;
    let maxTemp = -100;

    // Find min/max temp for this day
    dayItems.forEach(item => {
      if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
    });

    minTemp = Math.round(minTemp);
    maxTemp = Math.round(maxTemp);

    if (minTemp < minTempOverall) minTempOverall = minTemp;
    if (maxTemp > maxTempOverall) maxTempOverall = maxTemp;

    // Use the item around 2 PM (or midday) for the day's "main" condition
    const mainDayItem = dayItems[Math.floor(dayItems.length / 2)];

    // Create the hourly (3-hour block) forecast for this day
    const hourly: HourlyForecast[] = dayItems.map(item => ({
      time: new Date(item.dt * 1000).toISOString(),
      temp: Math.round(item.main.temp),
      precipitation: Math.round(item.pop * 100), // Convert 0.0-1.0 to 0-100%
      condition: mapOwmCondition(item.weather[0].main),
    }));

    daily.push({
      date: new Date(date).toISOString(),
      temp: { max: maxTemp, min: minTemp },
      condition: mapOwmCondition(mainDayItem.weather[0].main),
      precipitation: Math.round(mainDayItem.pop * 100),
      humidity: mainDayItem.main.humidity,
      wind: Math.round(mainDayItem.wind.speed * 3.6), // Convert m/s to km/h
      sunrise: sunrise,
      sunset: sunset,
      hourly: hourly,
    });
  });

  // The UI chart expects 24h of data. We'll give it the first 8 3-hour blocks.
  // We need to re-map the hourly data for the chart to be simpler.
  // The WeatherPage `flatMap` logic will now grab the first 24 *hourly points*
  // which will be the 8 3-hour blocks from day 1, day 2, and day 3. This is fine.

  return {
    daily: daily,
    minTemp: minTempOverall,
    maxTemp: maxTempOverall,
  };
};