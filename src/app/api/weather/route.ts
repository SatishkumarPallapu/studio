import { NextResponse, NextRequest } from 'next/server';
import { transformOpenWeatherData } from '@/lib/weather-data';

// We removed the hard-coded LAT/LON from here.
// The base URL for the free tier API
const API_BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?units=metric`;

export async function GET(request: NextRequest) {
  // Get the lat/lon from the query parameters
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Add error handling if coordinates are missing
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude query parameters are required' }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
  }

  // Build the final API URL dynamically
  const API_URL = `${API_BASE_URL}&lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 } // Cache data for 1 hour
    });

    if (!res.ok) {
      console.error('Failed to fetch weather data:', await res.text());
      throw new Error(`Failed to fetch weather data. Status: ${res.status}`);
    }

    const rawData = await res.json();
    
    // The rest of your logic stays the same!
    const formattedData = transformOpenWeatherData(rawData);

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Weather API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch or process weather data' }, { status: 500 });
  }
}