import getEuropeanCapitals from "@/data/europeanCapitals";
import { ChangeEvent, useState } from "react";
import style from "@/styles/cities.module.scss"
import Link from "next/link";
import { TextField } from "@mui/material";
import React from "react";
const CityGallery = React.lazy(() => import('@/components/cityTemplate'));


export default function SelectCity() {
    const [city, setCity] = useState("");
    const [error, setError] = useState('');
    const [cities, setCities] = useState(getEuropeanCapitals());
    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        sessionStorage.setItem('city', event.target.value);
    }
    const fetchCity = async () => {
        try {
            const res = await fetch(`/api/city?city=${city}`);
            if (!res.ok) throw new Error('Cos poszlo nie tak');
            setError('');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (err: any) {
            setError(err.message);

        }

    }

    return <div>
        <form
            onSubmit={(e) => e.preventDefault()}
            className={style.searchBar}
        >
            <TextField
                id="outlined-basic"
                type="text"

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => {
                    setCities(getEuropeanCapitals().filter((city) => city.name.toLowerCase().includes(e.currentTarget.value.toLowerCase())))
                }}
                label="Wyszukaj miasto"
                variant="outlined"
                size="medium"
                sx={{ width: '50vw' }}
                translate="yes"
            />
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className={style.cities}>
            {cities.map((city) => (
                <Link
                    href={`/city/${city.name}`}
                    key={city.name}
                    className={style.city}
                    onMouseDown={() => {
                        handleCityChange({ target: { value: city.name } } as ChangeEvent<HTMLInputElement>);
                    }}
                    onMouseUp={() => {
                        fetchCity();
                    }}
                >
                    <CityGallery
                        city={city.name}
                        key={city.name}
                        onMouseDown={() => {
                            handleCityChange({ target: { value: city.name } } as ChangeEvent<HTMLInputElement>)
                        }}
                        onMouseUp={() => {
                            fetchCity();
                        }}
                    >
                        <div className={style.cityName}>
                            {city.name}
                        </div>
                    </CityGallery>
                </Link>
            ))}
        </div>
    </div>
}