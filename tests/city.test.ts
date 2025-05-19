import handler from '@/pages/api/city'; // importujemy funkcję handlera API
import { createMocks } from 'node-mocks-http'; // biblioteka do tworzenia sztucznych (mockowanych) requestów i responsów
import getEuropeanCapitals from '@/data/europeanCapitals'; // funkcja do pobierania danych (będzie mockowana)

// Mockujemy moduł z danymi stolic
jest.mock('@/data/europeanCapitals');

// Określamy typ dla zmockowanej funkcji
const mockedGetEuropeanCapitals = getEuropeanCapitals as jest.MockedFunction<typeof getEuropeanCapitals>;

describe('API Handler - European Capitals', () => {
  // Czyścimy wszystkie mocki przed każdym testem
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  Test: miasto istnieje — zwracamy dane
  it('returns 200 and city data if city exists', async () => {
    // Ustawiamy dane, które będzie zwracać mock
    mockedGetEuropeanCapitals.mockReturnValue([
      { name: 'Warsaw', country: 'Poland' },
      { name: 'Berlin', country: 'Germany' },
    ]);

    // Tworzymy sztuczne zapytanie GET z parametrem "city"
    const { req, res } = createMocks({
      method: 'GET',
      query: { city: 'Berlin' },
    });

    // Wywołujemy handler
    await handler(req, res);

    // Sprawdzamy odpowiedź
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      city: 'Berlin',
      country: 'Germany',
    });
  });

  //  Test: brak parametru city — błąd 400
  it('returns 400 if city param is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'City name is required.' });
  });

  // Test: miasto nie istnieje w danych — błąd 404
  it('returns 404 if city not found', async () => {
    mockedGetEuropeanCapitals.mockReturnValue([
      { name: 'Warsaw', country: 'Poland' },
    ]);

    const { req, res } = createMocks({
      method: 'GET',
      query: { city: 'London' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'City not found in European capitals.' });
  });

  //  Test: metoda inna niż GET — błąd 405
  it('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: 'Method Not Allowed' });
  });
});
