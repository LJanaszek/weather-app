import React, { useEffect, useState } from 'react';

type UnsplashPhoto = {
    id: string;
    alt_description: string;
    urls: {
        regular: string;
    };
    user: {
        name: string;
    };
};

interface CityGalleryProps {
    city: string;
}

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY; // <- Wstaw swój Unsplash Access Key

const CityGallery: React.FC<CityGalleryProps> = ({ city }) => {
    const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        city
                    )}&per_page=6&client_id=${accessKey}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setPhotos(data.results);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchPhotos();
    }, [city]);

    if (error) {
        return <p>⚠️ Błąd: {error} </p>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4" > Zdjęcia: {city} </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" >
                {
                    photos.map((photo) => (
                        <div key={photo.id} className="rounded overflow-hidden shadow-lg" >
                            <img src={photo.urls.regular} alt={photo.alt_description || city} className="w-full" />
                            <div className="px-2 py-1 text-sm text-gray-600" >📸 {photo.user.name} </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CityGallery;
