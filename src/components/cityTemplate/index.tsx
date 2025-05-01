import React, { useEffect, useState } from 'react';
import style from "@/styles/cities.module.scss"
type PixabayPhoto = {
    id: string;
    alt_description: string;
    webformatURL: string;  // Small image URL for faster loading
    largeImageURL: string; // Large image URL
    user: string;          // Photographer's name
};

interface CityGalleryProps {
    city: string;
    children?: React.ReactNode;
    onMouseUp: () => void,
    onMouseDown: () => void
}

const accessKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY; // Your Pixabay Access Key from .env.local

const CityGallery: React.FC<CityGalleryProps> = ({ city, children, onMouseDown, onMouseUp }) => {
    const [photos, setPhotos] = useState<PixabayPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Debugging: Log the access key to see if it's loaded properly

        const fetchPhotos = async () => {
            try {

                const res = await fetch(
                    `https://pixabay.com/api/?key=${accessKey}&q=${city}&image_type=photo&orientation=horizontal`,
                );

                if (res.status === 200) {
                    console.log('success');
                }
                else if (res.status === 400) {
                    console.log('Bad request');
                }
                else if (res.status === 401) {
                    console.log('something wrong with api key or with your subscription');
                }
                else if (res.status === 403) {
                    console.log('access denied');
                }
                else if (res.status === 404) {
                    console.log('city not found');
                }
                else if (res.status === 429) {
                    console.log('too many requests');
                }
                else if (res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
                    console.log('server error');
                }


                const data = await res.json();
                setPhotos(data.hits); // "hits" contains the photo results in Pixabay API response
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                // Handle errors and log them to the console
                console.error("Fetching error:", err);
                setError(err.message || "Coś poszło nie tak");
            }
        };

        fetchPhotos();
    }, [city]);

    if (error) {
        return <p> Wystąpił Błąd: {error}</p>;
    }


    const firstPhoto = photos[0]; 

    return (
        <div
            style={{
                width: "100%",
            }}
        >
            {firstPhoto ? (
                <div
                    onMouseUp={onMouseUp} onMouseDown={onMouseDown}
                    className={style.cityTemplate}
                    style={{
                        backgroundImage: `url(${firstPhoto.webformatURL})`, 
                    }}
                >
                    {children}
                </div>
            ) : (
                <p>No photos available for this city.</p>
            )}
        </div>
    );
};

export default CityGallery;
