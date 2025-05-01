# Główne założenia projektu

_Aplikacja do sprawdzania pogody w miastach oraz zapisywania notatek do poszczególnych stolic, aby w każdym momencie móc powspominać historie i wydarzenia ze swoich wyjazdów międzykrajowych, albo móc zaplanować czas na moment przybycia do stolicy docelowej bazując na aktualnej pogodzie_

## API użyte do stworzenia projektu:

### zewnętrzne:
| nazwa API | do czego jest używane |
|:----------|:----------------------|
|[OpenWeather&nbsp;API](https://openweathermap.org/api)  | API użyte do wydobywania danych a propos pogody z konkretnych miast
|[Pixabay API](https://pixabay.com/api/docs/)       | API służące do generowania obrazów poprzez zadane zapytanie (w przypadku projektu, do wyciągania thumbnaili stolic)

### wewnętrzne:
| nazwa&nbsp;API | do czego jest używane |
|:----------|:-----------------------|
|[api/auth](./src/pages/api/auth/user.ts) | API służące do tworzenia nowych i autentykacji istniejących użytkowników, na podstawie bazy danych

# użyte technologie:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Next.js](http://nextjs.org)
- [React.js](https://react.dev/)
- [JWT (JSON Web Token)](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org/en)
- [Material MUI Icons](https://mui.com/material-ui/material-icons/)
- [Material UI](https://mui.com/material-ui/)
- [JEST](https://jestjs.io/docs/getting-started)

# Pierwsze odpalenie projektu

# Wymagania do wersji deweloperskiej:

 zainstalowany Node.js w wersji 22.14.*
 xampp jako lokalny serwer baz danych

### stworzony plik .env zawierający:
 - NEXT_PUBLIC_OPENWEATHER_API_KEY= 'your_api_key'
 - NEXT_PUBLIC_PIXABAY_API_KEY = 'your_api_key'
 - DATABASE_URL="mysql://root:@localhost:3306/your_db_name"

### stworzony plik .env.local zawierający:
 - JWT_SECRET=your_secret_key
```bash
yarn
npx prisma generate dev
yarn dev
```

[local server :3000](http://localhost:3000) - defaultowy link do wyświetlenia strony lokalnie
[local server :3001](http://localhost:3001) - serwer lokalny na porcie 3001, zapasowy, gdy port 3000 jest zajęty przez inny proces

# użyte endpointy
|nazwa endpointu|co robi|
|:---------------|:-------|
|[api/auth/user.ts](./src/pages/api/auth/user.ts)               |służący do obsługi użytkowników (autentykacji)                                                                                                                                                  |
|[api/auth/logout.ts](./src/pages/api/auth/logout.ts)           | służący do przekierowania użytkownika na stronę logowania w momencie wygaśnięcia cookie                                                                                                        |
|[api/notes/[id.ts]](./src/pages/api/notes/[id].ts)             |służący do obsługi notatek stworzonych przez użytkownika                                                                                                                                        |
| [api/notes/index.ts](./src/pages/api/notes/index.ts)          | służący do tworzenia nowej notatki                                                                                                                                                             |
| [api/authenticateUser](./src/pages/api/authenticateUser.ts)   |służący do sprawdzania czy użytkownik jest zalogowany (stworzone do obsługi cookie)                                                                                                             |
| [api/city](./src/pages/api/city.ts)                           | stworzone do obsługi danych z pliku [europeanCapitals.ts](./src/data/europeanCapitals.ts). Wyszukuje miasta zgodnie z zapytaniem użytkownika. Przekazuje także dane do obsługi API zewnętrznych|

# obsługa błędów w projekcie:
- tworzenie notatek (POST):
    - `201` (created)
    - `404` (bad request)
- usuwanie notatek (DELETE):
    - `200` (deleted)
    - `500` (internal server error _możliwe do usunięcia_)
- wyciąganie notatek (GET):
    - `200` (success)
    - `500` (internal server error _możliwe do usunięcia_)
- edycja notatek (PUT):
    - `200` (edited)
    - `500` (internal server error _możliwe do usunięcia_)
- sprawdzanie czy użytkownik jest zalogowany:
    - `401` (not authenticated)
    - `401` (invalid token)
    - `401` (invalid user)
- obsługa danych o miastach (GET):
    - `400` (city name is required)
    - `404` (city not found in European Capitals)
    - `200` (success)
    - `405` (method not allowed)
- obsługa wylogowywania użytkownika:
    - `200` (logged out)
- obsługa użytkowników:
    - obsługa logowania (POST):
        - `400` (Username and password are required)
        - `401` (Invalid credentials)
        - `200` (login success)
    - obsługa rejestrowania użytkownika (PUT):
        - `400` (Username and password are required)
        - `409` (Username is already taken)
        - `400` (Passwords are not matching)
        - `400` (Passwords does not meet requirements)
        - `200` (User created)
    - obsługa autentykacji użytkownika (GET):
        - `401` (Not authenticated)
        - `200` (ok)
        - `401` (invalid token)
- obsługa API Pixabay:
    - `200` (success)
    - `401` (something wrong with api key or with your subscription)
    - `404` (city not found)
    - `429` (too many requests)
    - `500` | `501` | `502` | `503` (internal server error, contact support)
- obsługa API openweathermap:
    - `200` (success)
    - `400` (Bad request)
    - `401` (something wrong with api key or with your subscription)
    - `403` (access denied)
    - `404` (city not found)
    - `429` (too many requests)
    - `500` | `501` | `502` | `503` (internal server error, contact support)

# testy jednostkowe w jest
| nazwa testu  | działanie testu|
|:-------------|:----------------|
|[tests directory](./src/pages/tests/)                          |  folder z plikami testującymi logikę back-endu poprzez bibliotekę JEST|
|[tests/mocks](./src/pages/tests/__mocks__/prisma.test.ts)      |  test mockujący cały ORM Prisma|
|[tests/auth](./src/pages/tests/auth/authenticateUser.test.ts)  |  test sprawdzający działanie backend logic dla authenticateUser|
|[tests/notes](./src/pages/tests/notes/id.test.ts)              |  test sprawdzający logikę tworzenia nowej notatki|
|[tests/notes](./src/pages/tests/notes/notes.test.ts)           |  test sprawdzający usuwanie, edytowanie i wyciąganie notatek|
|[tests/city](./src/pages/tests/city.test.ts)                   |  test sprawdzający logikę rozprowadzania danych o miastach i ich fetchowania|
