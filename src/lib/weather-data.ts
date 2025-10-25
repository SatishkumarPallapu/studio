
import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from 'lucide-react';
import { addDays, addHours, format, set } from 'date-fns';

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
  wind: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
};

export type WeatherData = {
  daily: DailyForecast[];
  minTemp: number;
  maxTemp: number;
};

// Function to generate realistic mock data
const generateMockData = (): WeatherData => {
  const daily: DailyForecast[] = [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  let minTempOverall = 100;
  let maxTempOverall = 0;

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(baseDate, i);
    const minTemp = 22 + Math.floor(Math.random() * 5);
    const maxTemp = 32 + Math.floor(Math.random() * 6);

    if (minTemp < minTempOverall) minTempOverall = minTemp;
    if (maxTemp > maxTempOverall) maxTempOverall = maxTemp;
    
    const conditions: WeatherCondition[] = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'];
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];

    const hourly: HourlyForecast[] = [];
    for (let j = 0; j < 24; j++) {
      const hourDate = addHours(dayDate, j);
      const tempFluctuation = Math.sin((j - 8) * (Math.PI / 16)) * ((maxTemp - minTemp) / 2);
      const temp = Math.round(minTemp + ((maxTemp - minTemp) / 2) + tempFluctuation);
      
      let hourCondition = dayCondition;
      if (j < 6 || j > 19) {
          if(hourCondition === 'Sunny') hourCondition = 'Partly Cloudy';
      }

      hourly.push({
        time: hourDate.toISOString(),
        temp: temp,
        precipitation: dayCondition === 'Rain' || dayCondition === 'Thunderstorm' ? 20 + Math.random() * 70 : Math.random() * 15,
        condition: hourCondition,
      });
    }

    daily.push({
      date: dayDate.toISOString(),
      temp: { max: maxTemp, min: minTemp },
      condition: dayCondition,
      precipitation: dayCondition === 'Rain' || dayCondition === 'Thunderstorm' ? 40 + Math.random() * 50 : Math.random() * 20,
      humidity: 50 + Math.floor(Math.random() * 30),
      wind: 5 + Math.floor(Math.random() * 15),
      sunrise: '6:05 AM',
      sunset: '6:45 PM',
      hourly: hourly,
    });
  }

  return { daily, minTemp: minTempOverall, maxTemp: maxTempOverall };
};

export const weatherData = generateMockData();


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
