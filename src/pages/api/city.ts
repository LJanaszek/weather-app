import { NextApiRequest, NextApiResponse } from 'next';
import getEuropeanCapitals from '@/data/europeanCapitals'; // Importujemy funkcję

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sprawdzamy metodę zapytania (GET)
  if (req.method === 'GET') {
    const { city } = req.query;  // Pobieramy nazwę miasta z parametrów zapytania

    // Sprawdzamy, czy miasto zostało podane
    if (!city || Array.isArray(city)) {
      return res.status(400).json({ error: 'City name is required.' });
    }

    // Pobieramy listę stolic Europy z osobnego pliku
    const capitals = getEuropeanCapitals();

    // Szukamy miasta wśród stolic Europy
    const cityData = capitals.find(
      (capital) => capital.name.toLowerCase() === (city as string).toLowerCase()
    );

    // Jeśli miasto nie zostało znalezione, zwracamy błąd
    if (!cityData) {
      return res.status(404).json({ error: 'City not found in European capitals.' });
    }

    // Zwracamy dane miasta i kraju
    return res.status(200).json({
      city: cityData.name,
      country: cityData.country
    });
  }
  else {
    // Obsługujemy tylko metodę GET
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
