// components/Weather.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Weather({ city }: { city: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    };

    fetchWeather();
  }, [API_KEY, city]);

  if (!weather) return <p>Ładowanie pogody...</p>;
  console.log(weather);
  return (
    <div>
      <h2>Pogoda w {weather.name}</h2>
      <p>🌡️ Temperatura: {weather.main.temp}°C</p>
      <p>🌥️ Opis: {weather.weather[0].description}</p>
      <p>💨 Wiatr: {weather.wind.speed} m/s</p>
    </div>
  );
}
