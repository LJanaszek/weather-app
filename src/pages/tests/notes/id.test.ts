import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '../../../pages/api/authenticateUser';
import handler from '../../../pages/api/notes/[id]';
import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';

// Mockowanie Prisma Client
jest.mock('@prisma/client');
const prisma = new PrismaClient();

// Mockowanie funkcji authenticateUser
jest.mock('../../../pages/api/authenticateUser', () => ({
  authenticateUser: jest.fn(),
}));

describe('API notes handler', () => {
  
  // Test dla GET: Zwrócenie notatek użytkownika z danego miasta
  it('GET - powinien zwrócić notatki użytkownika z danego miasta', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'Warszawa' },  // Przekazujemy miasto
      headers: {
        cookie: 'auth_token=fake.jwt.token',  // Przykładowy token
      },
    });

    // Zamockowanie authenticateUser, zwróci obiekt użytkownika z id jako string
 
    authenticateUser.mockReturnValueOnce({ id: '1' });

    // Mockowanie odpowiedzi z Prisma
    (prisma.notes.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: 'note-id',
        userId: '1',
        description: 'test desc',
        createdAt: new Date(),
        city: 'Warszawa',
      },
    ]);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].city).toBe('Warszawa');
  });

  // Test dla DELETE: Usunięcie notatki
  it('DELETE - powinien usunąć notatkę o podanym ID', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: 'note-id' },
      headers: {
        cookie: 'auth_token=fake.jwt.token',  // Przykładowy token
      },
    });

    // Zamockowanie authenticateUser, zwróci obiekt użytkownika z id jako string

    authenticateUser.mockReturnValueOnce({ id: '1' });

    // Mockowanie odpowiedzi z Prisma (delete)
    (prisma.notes.deleteMany as jest.Mock).mockResolvedValueOnce({});

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Notes deleted' });
  });

  // Test dla PUT: Zaktualizowanie opisu notatki
  it('PUT - powinien zaktualizować opis notatki', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: 'note-id' },
      body: { description: 'Updated description' },
      headers: {
        cookie: 'auth_token=fake.jwt.token',  // Przykładowy token
      },
    });

    // Zamockowanie authenticateUser, zwróci obiekt użytkownika z id jako string
  
    authenticateUser.mockReturnValueOnce({ id: '1' });

    // Mockowanie odpowiedzi z Prisma (update)
    (prisma.notes.update as jest.Mock).mockResolvedValueOnce({
      id: 'note-id',
      userId: '1',
      description: 'Updated description',
      city: 'Warszawa',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Notes updated' });
  });

  // Test 401: Jeśli użytkownik nie jest uwierzytelniony
  it('powinien zwrócić 401, jeśli użytkownik nie jest uwierzytelniony', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'Warszawa' },
      headers: {},
    });

    // Zamockowanie authenticateUser, zwróci null (brak użytkownika)
    
    authenticateUser.mockReturnValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Not authenticated' });
  });
});
