import getEuropeanCapitals from "@/data/europeanCapitals";
import { ChangeEvent, useState } from "react";

export default function SelectCity() {
    const [city, setCity] = useState("");
    const [cityData, setCityData] = useState({city: '', country: ''});
    const [error, setError] = useState('');
    const cities: { name: string; country: string }[] = getEuropeanCapitals();

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }
    const fetchCity = async () => {
        try {
            const res = await fetch(`/api/city?city=${city}`);
            if (!res.ok) throw new Error('Cos poszlo nie tak');
            const data = await res.json();
            setCityData(data);
            setError('');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (err: any) {
            setError(err.message);
            setCityData({ city: '', country: ''});
        }
    }

    return <div>
        <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Wpisz nazwę miasta"
        />
        <button onClick={fetchCity}>
            Szukaj
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {cityData && (
            <div>
                <h2>Dane miasta: {cityData.city}</h2>
                <p>Kraj: {cityData.country}</p>
                {/* <p>Populacja: {cityData.population}</p>
                <p>Opis: {cityData.description}</p> */}
            </div>
        )}
        <select>
            {cities.map((city) => (
                <option key={city.name}
                    onChange={async () => {

                    }}
                >{city.name}</option>
            ))}
        </select>
    </div>
}