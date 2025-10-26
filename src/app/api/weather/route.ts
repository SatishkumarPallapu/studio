import { NextResponse } from 'next/server';
import { transformOpenWeatherData } from '@/lib/weather-data';

// TODO: Replace with your farm's coordinates
const LAT = '17.3850'; // Hyderabad latitude
const LON = '78.4867'; // Hyderabad longitude

const API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&exclude=minutely,alerts&units=metric`;

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_URL}&appid=${apiKey}`, {
      next: { revalidate: 3600 } // Cache data for 1 hour
    });

    if (!res.ok) {
      console.error('Failed to fetch weather data:', await res.text());
      throw new Error(`Failed to fetch weather data. Status: ${res.status}`);
    }

    const rawData = await res.json();
    
    // Transform the data into the format our UI expects
    const formattedData = transformOpenWeatherData(rawData);

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Weather API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch or process weather data' }, { status: 500 });
  }
}
