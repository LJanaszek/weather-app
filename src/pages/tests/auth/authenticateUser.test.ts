import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '../../../pages/api/authenticateUser';
import { createMocks, MockResponse } from 'node-mocks-http';
import jwt from 'jsonwebtoken'; 

describe('authenticateUser', () => {

  it('should return 401 if no token is present', async () => {
    // Tworzymy mocka dla req i res bez tokenu w ciasteczkach
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: {},  // brak ciasteczek
    });

    // Wywołujemy funkcję authenticateUser
    await authenticateUser(req, res);

    // Sprawdzamy, czy status odpowiedzi to 401
    expect(res.statusCode).toBe(401);

    // Sprawdzamy, czy odpowiedź zawiera właściwą wiadomość
    expect(res._getJSONData()).toEqual({ message: 'Not authenticated' });
  });

  it('should return 401 if no token is present', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: {}, // brak ciasteczek
    });
    const mockRes = res as MockResponse<NextApiResponse>;
  
    authenticateUser(req, mockRes);
  
    expect(mockRes._getStatusCode()).toBe(401);
    expect(mockRes._getData()).toEqual(JSON.stringify({ message: 'Not authenticated' }));
  });

  it('should return user data if token is valid', async () => {
    // Tworzymy mocka dla req i res z poprawnym tokenem
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: { cookie: 'auth_token=valid_token' }, // poprawny token
    });

    // Mockowanie JWT.verify, aby zwróciło prawdziwego użytkownika
    const mockUser = { id: 1, name: 'John Doe' };
    jest.spyOn(jwt, 'verify').mockReturnValue(mockUser);

    // Wywołujemy funkcję authenticateUser
    await authenticateUser(req, res);

    // Sprawdzamy, czy status odpowiedzi jest poprawny (np. 200)
    expect(res.statusCode).toBe(200);

    const user = await authenticateUser(req, res);

    // Sprawdzamy, czy odpowiedź zawiera dane użytkownika
    expect(user).toEqual(mockUser);
  });

});
