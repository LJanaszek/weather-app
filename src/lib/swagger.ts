import { OpenAPIObject } from 'openapi3-ts/oas30';

export const swaggerDocument: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
        title: 'Moje API',
        version: '1.0.0',
    },
    paths: {
        '/auth/logout': {
            post: {
                summary: 'Logout user',
                description: 'Log out the user by removing the auth_token cookie.',
                responses: {
                    200: {
                        description: 'Logged out successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Logged out' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'User not authenticated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Not authenticated' },
                                    },
                                },
                            },
                        },
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
        '/auth/login': {
            post: {
                summary: 'Logowanie użytkownika',
                description: 'Zaloguj użytkownika za pomocą nazwy użytkownika i hasła. Jeśli dane są poprawne, zwróci token JWT.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                },
                                required: ['username', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Login successful' },
                                        token: { type: 'string', description: 'JWT Token' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Nieprawidłowe dane logowania',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Username and password are required' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Niepoprawne dane logowania',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Invalid credentials' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/register': {
            put: {
                summary: 'Rejestracja użytkownika',
                description: 'Rejestracja nowego użytkownika, weryfikacja danych, generowanie tokenu JWT.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                    secPassword: { type: 'string' },
                                },
                                required: ['username', 'password', 'secPassword'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Użytkownik został pomyślnie zarejestrowany',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'User created' },
                                        id: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Błąd walidacji danych',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Passwords are not matching' },
                                    },
                                },
                            },
                        },
                    },
                    409: {
                        description: 'Nazwa użytkownika jest już zajęta',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Username is already taken' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/me': {
            get: {
                summary: 'Sprawdzenie stanu autoryzacji',
                description: 'Weryfikacja tokenu JWT w ciasteczku i zwrócenie danych użytkownika.',
                responses: {
                    200: {
                        description: 'Token jest prawidłowy, zwrócono dane użytkownika',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                username: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Nieprawidłowy lub brakujący token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Not authenticated' },
                                    },
                                },
                            },
                        },
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
        '/protected-resource': {
            get: {
                summary: 'Zabezpieczony zasób',
                description: 'Endpoint dostępny tylko dla użytkowników z ważnym tokenem JWT.',
                responses: {
                    200: {
                        description: 'Zasób został zwrócony pomyślnie',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Protected resource' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Brak autoryzacji',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
        '/notes': {
            post: {
                summary: 'Tworzenie nowej notatki',
                description: 'Utwórz nową notatkę dla użytkownika.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    description: { type: 'string' },
                                    city: { type: 'string' },
                                },
                                required: ['description', 'city'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Notatka utworzona',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        description: { type: 'string' },
                                        city: { type: 'string' },
                                        userId: { type: 'string' },
                                        createdAt: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Brakujące dane',
                    },
                    405: {
                        description: 'Metoda niedozwolona',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
            get: {
                summary: 'Pobieranie notatek użytkownika',
                description: 'Pobierz wszystkie notatki użytkownika.',
                responses: {
                    200: {
                        description: 'Notatki pobrane',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            description: { type: 'string' },
                                            city: { type: 'string' },
                                            userId: { type: 'string' },
                                            createdAt: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Błąd serwera',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
            delete: {
                summary: 'Usuwanie notatki',
                description: 'Usuń notatkę użytkownika po ID.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                },
                                required: ['id'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Notatka usunięta',
                    },
                    400: {
                        description: 'Błąd danych',
                    },
                    500: {
                        description: 'Błąd serwera',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
        '/notes/{id}': {
            get: {
                summary: 'Pobierz notatki dla miasta',
                description: 'Zwraca notatki użytkownika dla podanego miasta.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Notatki pobrane',
                    },
                    500: {
                        description: 'Błąd serwera',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
            delete: {
                summary: 'Usuń notatki dla ID',
                description: 'Usuwa notatki związane z podanym ID.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Notatki usunięte',
                    },
                    500: {
                        description: 'Błąd serwera',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
            put: {
                summary: 'Zaktualizuj notatkę',
                description: 'Aktualizuje opis notatki.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    description: { type: 'string' },
                                },
                                required: ['description'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Notatka zaktualizowana',
                    },
                    500: {
                        description: 'Błąd serwera',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
        '/api/city': {
            get: {
                summary: 'Sprawdź informacje o mieście',
                description: 'Weryfikuje czy miasto jest europejską stolicą.',
                parameters: [
                    {
                        name: 'city',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Miasto znalezione',
                    },
                    400: {
                        description: 'Brak nazwy miasta',
                    },
                    404: {
                        description: 'Miasto nie znalezione',
                    },
                    405: {
                        description: 'Metoda niedozwolona',
                    },
                },
                security: [
                    {
                        "bearerAuth": [],
                    },
                ],
            },
        },
    },
    components:{
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    }
};
