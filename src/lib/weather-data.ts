
// import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from 'lucide-react';
// import { addDays, addHours, format, set } from 'date-fns';

// export type WeatherCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';

// export type HourlyForecast = {
//   time: string;
//   temp: number;
//   precipitation: number;
//   condition: WeatherCondition;
// };

// export type DailyForecast = {
//   date: string;
//   temp: { max: number; min: number };
//   condition: WeatherCondition;
//   precipitation: number;
//   humidity: number;
//   wind: number;
//   sunrise: string;
//   sunset: string;
//   hourly: HourlyForecast[];
// };

// export type WeatherData = {
//   daily: DailyForecast[];
//   minTemp: number;
//   maxTemp: number;
// };

// // Function to generate realistic mock data
// const generateMockData = (): WeatherData => {
//   const daily: DailyForecast[] = [];
//   const baseDate = new Date();
//   baseDate.setHours(0, 0, 0, 0);

//   let minTempOverall = 100;
//   let maxTempOverall = 0;

//   for (let i = 0; i < 7; i++) {
//     const dayDate = addDays(baseDate, i);
//     const minTemp = 22 + Math.floor(Math.random() * 5);
//     const maxTemp = 32 + Math.floor(Math.random() * 6);

//     if (minTemp < minTempOverall) minTempOverall = minTemp;
//     if (maxTemp > maxTempOverall) maxTempOverall = maxTemp;
    
//     const conditions: WeatherCondition[] = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'];
//     const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];

//     const hourly: HourlyForecast[] = [];
//     for (let j = 0; j < 24; j++) {
//       const hourDate = addHours(dayDate, j);
//       const tempFluctuation = Math.sin((j - 8) * (Math.PI / 16)) * ((maxTemp - minTemp) / 2);
//       const temp = Math.round(minTemp + ((maxTemp - minTemp) / 2) + tempFluctuation);
      
//       let hourCondition = dayCondition;
//       if (j < 6 || j > 19) {
//           if(hourCondition === 'Sunny') hourCondition = 'Partly Cloudy';
//       }

//       hourly.push({
//         time: hourDate.toISOString(),
//         temp: temp,
//         precipitation: dayCondition === 'Rain' || dayCondition === 'Thunderstorm' ? 20 + Math.random() * 70 : Math.random() * 15,
//         condition: hourCondition,
//       });
//     }

//     daily.push({
//       date: dayDate.toISOString(),
//       temp: { max: maxTemp, min: minTemp },
//       condition: dayCondition,
//       precipitation: dayCondition === 'Rain' || dayCondition === 'Thunderstorm' ? 40 + Math.random() * 50 : Math.random() * 20,
//       humidity: 50 + Math.floor(Math.random() * 30),
//       wind: 5 + Math.floor(Math.random() * 15),
//       sunrise: '6:05 AM',
//       sunset: '6:45 PM',
//       hourly: hourly,
//     });
//   }

//   return { daily, minTemp: minTempOverall, maxTemp: maxTempOverall };
// };

// export const weatherData = generateMockData();


// export const getIconForCondition = (condition: WeatherCondition, className: string) => {
//     switch (condition) {
//         case 'Sunny':
//             return <Sun className={className} />;
//         case 'Partly Cloudy':
//             return <CloudSun className={className} />;
//         case 'Cloudy':
//             return <Cloud className={className} />;
//         case 'Rain':
//             return <CloudRain className={className} />;
//         case 'Thunderstorm':
//             return <CloudLightning className={className} />;
//         default:
//             return <Sun className={className} />;
//     }
// };


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
  hourly: HourlyForecast[];
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

// --- NEW HELPER: Map OpenWeatherMap conditions to our types ---
const mapOwmCondition = (owmCondition: string): WeatherCondition => {
  const main = owmCondition.toLowerCase();
  if (main.includes('thunderstorm')) return 'Thunderstorm';
  if (main.includes('rain') || main.includes('drizzle')) return 'Rain';
  if (main.includes('clouds')) {
      // OWM uses "few clouds", "scattered clouds", "broken clouds", "overcast clouds"
      if (main.includes('few') || main.includes('scattered')) return 'Partly Cloudy';
      return 'Cloudy';
  }
  if (main.includes('clear')) return 'Sunny';
  
  // Fallback for mist, snow, haze etc.
  return 'Cloudy';
};

// --- NEW: Data Transformation Function ---
export const transformOpenWeatherData = (owmData: any): WeatherData => {
  let minTempOverall = 100;
  let maxTempOverall = 0;

  // 1. Transform all available hourly data (OWM provides 48 hours)
  const allHourlyData: HourlyForecast[] = owmData.hourly.map((hour: any) => ({
    time: new Date(hour.dt * 1000).toISOString(),
    temp: Math.round(hour.temp),
    precipitation: Math.round(hour.pop * 100), // Convert 0.0-1.0 to 0-100%
    condition: mapOwmCondition(hour.weather[0].main),
  }));

  // 2. Transform all daily data (OWM provides 8 days)
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
      sunrise: format(new Date(day.sunrise * 1000), 'p'), // '6:05 AM'
      sunset: format(new Date(day.sunset * 1000), 'p'),  // '6:45 PM'
      
      // The UI chart only needs the first 24h, which it gets from the first day.
      // We'll attach the first 24h of hourly data to the first day's forecast.
      hourly: index === 0 ? allHourlyData.slice(0, 24) : [],
    };
  });

  return {
    daily: dailyData,
    minTemp: minTempOverall,
    maxTemp: maxTempOverall,
  };
};