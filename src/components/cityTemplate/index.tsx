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
        console.log("Pixabay Access Key:", accessKey);

        const fetchPhotos = async () => {
            try {
                // Debugging: Log the API URL
                console.log(`Fetching: https://pixabay.com/api/?key=${accessKey}&q=${city}&image_type=photo&orientation=horizontal`);

                const response = await fetch(
                    `https://pixabay.com/api/?key=${accessKey}&q=${city}&image_type=photo&orientation=horizontal`,
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
    }, [city]); // Re-fetch when city changes

    // Error state display
    if (error) {
        return <p>⚠️ Błąd: {error}</p>;
    }

    // Render the photos
    const firstPhoto = photos[0]; // Get the first photo in the array

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
                        backgroundImage: `url(${firstPhoto.webformatURL})`, // Use small image for fast loading
                      
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
