// components/Weather.tsx
'use client';
import style from "@/styles/weather.module.scss"
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';


type PixabayPhoto = {
  id: string;
  alt_description: string;
  webformatURL: string;  // Small image URL for faster loading
  largeImageURL: string; // Large image URL
  user: string;          // Photographer's name
};


export default function Weather() {

  const router = useRouter();
  const notes = [{ id: 1, text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit', date: '2023-05-01' }, { id: 2, text: 'Note 2', date: '2023-05-02' }];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [photos, setPhotos] = useState<PixabayPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const accessKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
  const { index } = router.query;

  useEffect(() => {
    if (index) {
      sessionStorage.setItem('index', index as string);
    }
  }, [index]);

  console.log("index:", index);


  useEffect(() => {
    if (index) {

      const fetchWeather = async () => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${index}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather(data);
      };
      const fetchPhotos = async () => {
        try {
          // Debugging: Log the API URL
          console.log(`Fetching: https://pixabay.com/api/?key=${accessKey}&q=${index}&image_type=photo&orientation=horizontal`);

          const response = await fetch(
            `https://pixabay.com/api/?key=${accessKey}&q=${index}&image_type=photo&orientation=horizontal`,
          );

          // Check if the response is OK
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          // Get the data from the response
          const data = await response.json();
          setPhotos(data.hits); // "hits" contains the photo results in Pixabay API response
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          // Handle errors and log them to the console
          console.error("Fetching error:", err);
          setError(err.message || "Coś poszło nie tak");
        }
      };

      fetchPhotos();
      fetchWeather();
    }
  }, [API_KEY, index]);

  if (!weather) return <p>Ładowanie pogody...</p>;

  return (
    <div className={style.weather}>
      <h1>{index}</h1>
      {!weather.main.temp && <p>Ładowanie pogody...</p>}
      {weather.main.temp && !error &&
        <div
          style={{
            backgroundImage: `url(${photos[0].webformatURL})`,
          }}
          className={style.weatherContainer}
        >
          <div className={style.weatherInfo}>
            <p>Date: {new Date().toISOString().split('T')[0]+" "+ new Date().getHours()+":"+new Date().getMinutes()}</p>
            <p className={style.temp}>Temperatura: {weather.main.temp}°C</p>
            <p className={style.description}>Opis: {weather.weather[0].description}</p>
            <p className={style.wind}>Wiatr: {weather.wind.speed} m/s</p>
          </div>
        </div>
      }
      {error && <p>{error}</p>}
      <div className={style.notes}>
        <nav>
          <h2>Notatki</h2>
          <button className={style.add} onClick={() => setIsNotesOpen(true)}>
            <AddIcon />
          </button>
        </nav>
        {notes.map((note) => (
          <div key={note.id} className={style.note}>
            <p className={style.date}>{note.date}</p>
            <p className={style.text}>{note.text}</p>
          </div>
        ))}
        {isNotesOpen &&
          <div className={style.notes}>

            <textarea name="" id="">
            </textarea>
          </div>

        }

      </div>
    </div >
  );
}
