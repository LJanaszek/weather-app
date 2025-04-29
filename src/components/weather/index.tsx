// components/Weather.tsx
'use client';
import style from "@/styles/weather.module.scss"
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import { Button, TextField } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import Popup from "../Popup";

type PixabayPhoto = {
  id: string;
  alt_description: string;
  webformatURL: string;  // Small image URL for faster loading
  largeImageURL: string; // Large image URL
  user: string;          // Photographer's name
};

interface Notes {
  id: string;
  description: string;
  createdAt: string;
}

export default function Weather() {

  const router = useRouter();
  const [notes, setNotes] = useState<Notes[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [photos, setPhotos] = useState<PixabayPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const accessKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
  const { index } = router.query;
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [editedNote, setEditedNote] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState("");

  useEffect(() => {
    if (index) {
      sessionStorage.setItem('index', index as string);
    }
  }, [index]);


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

  const fetchAllNotes = async () => {
    if(!index) return
    const res = await fetch(`/api/notes/${index}`, {
      method: 'GET',
    })
    if (res.status === 200) {
      let data = await res.json();
      if (search) {
        data = data.filter((note: Notes) => note.description.toLowerCase().includes(search.toLowerCase()));
      }
      setNotes(data);
    }

    if (res.status === 404) {
      console.log('Brak notatek');
    }
  };

  useEffect(() => {
    fetchAllNotes();
    
  }, [isNotesOpen, search, index]);
  async function addNotes() {
    const res = await fetch(`/api/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: inputValue,
        city: index
      }),
    });
    if (res.status === 201) {
      console.log('Dodano notatke');
    }
    if (res.status === 409) {
      console.log('Notatka juz istnieje');
    }
    setIsNotesOpen(!isNotesOpen);
    setInputValue('');
    fetchAllNotes();
  }

  async function deleteNotes(id: string) {
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    setIsNotesOpen(!isNotesOpen);
  }
  async function updateNotes(id: string) {
    await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: editedNote
      }),
    });
    setIsNotesOpen(!isNotesOpen);
  }

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
            <p>Date: {new Date().toISOString().split('T')[0] + " " + new Date().getHours() + ":" + new Date().getMinutes()}</p>
            <p className={style.temp}>Temperatura: {weather.main.temp}°C</p>
            <p className={style.description}>Opis: {weather.weather[0].description}</p>
            <p className={style.wind}>Wiatr: {weather.wind.speed} m/s</p>
          </div>
        </div>
      }
      {error && <p>{error}</p>}
      <div className={style.notes}>
        <nav className={style.notesNav}>

          <h2>Notatki</h2>

          <TextField
            id="outlined-basic"
            label="wyszukaj notatki"
            variant="outlined"
            sx={{
              width: '30vw',
              position: 'absolute',
              right: 'calc(50% - 15vw)',
            }}
            onChange={(e: { target: { value: string; }; }) => {
              setSearch(e.target.value);
              setNotes(notes.filter((note) =>
                note.description.toLowerCase().includes(e.target.value)

              ))
             
            }}

          >
          </TextField>
        </nav>
        <div className={style.notesAdd}>

          <Textarea
            minRows={3}
            placeholder="Dodaj notatke"
            sx={{
              width: '100%',
            }}
            name=""
            value={inputValue}
            id="addNote"
            
            onChange={(e) => setInputValue(e.target.value)}>
          </Textarea>

        </div>
        <Button
          className={style.addButton}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsNotesOpen(!isNotesOpen)
            addNotes();
          }}>Dodaj</Button>



        <div className={style.notesContainer}>
          {notes.length>0 &&notes.map((note) => {
            console.log(notes);
            return <div key={note.id as string} className={style.note}>
              <div>
                <p className={style.date}>{note.createdAt.split('T')[0]}</p>
                <p className={style.text}>{note.description as string}</p>
              </div>
              <nav className={style.buttons}>
                <button className={style.delete}
                  onClick={() => deleteNotes(note.id as string)}
                >Usun</button>
                <button className={style.edit}
                  onClick={() => {
                    setCurrentNoteId(note.id as string);
                    setEditedNote(note.description as string)
                    setOpenPopup(true);
                  }}
                >Edytuj</button>
              </nav>
            </div>
          })}
        </div>
        {openPopup &&
          <Popup>
            <div className={style.popup}>
              <h2>Edytuj notatke</h2>
              <Textarea
                minRows={3}
                onChange={(e: { target: { value: string; }; }) => setEditedNote(e.target.value)}
                placeholder={editedNote}
                value={editedNote}
              ></Textarea>
              <nav>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenPopup(false);
                    updateNotes(currentNoteId as string)
                  }}>
                  Zapisz
                </Button>
                <Button
                  variant="text"
                  color="warning"
                  onClick={() => setOpenPopup(false)}>
                  Anuluj
                </Button>
              </nav>
            </div>
          </Popup>
        }
        {/* {isNotesOpen && */}


        {/* } */}

      </div>
    </div >
  );
}
