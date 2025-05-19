jest.mock('../../src/pages/api/authenticateUser', () => ({
    authenticateUser: jest.fn(),
  }));
  
  import { authenticateUser } from '../../src/pages/api/authenticateUser';
  import handler from '../../src/pages/api/notes/index';
  import { createMocks } from 'node-mocks-http';
  import { PrismaClient } from '@prisma/client';
  
  // mock Prisma
  jest.mock('@prisma/client', () => {
    const mockCreate = jest.fn();
    return {
      PrismaClient: jest.fn(() => ({
        notes: { create: mockCreate },
      })),
    };
  });
  
  describe('notes API', () => {
    it('returns 401 if user not authenticated', async () => {
      (authenticateUser as jest.Mock).mockImplementation((_req, res) => {
        res.status(401).json({ message: 'Not authenticated' });
        return null;
      });
  
      const { req, res } = createMocks({
        method: 'POST',
        body: { description: 'test', city: 'test' },
        headers: {},
      });
  
      await handler(req, res);
  
      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ message: 'Not authenticated' });
    });
  
    it('creates a note successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (authenticateUser as jest.Mock).mockImplementation((_req, _res) => {
        return { id: 1 };
      });
  
      const { req, res } = createMocks({
        method: 'POST',
        body: { description: 'Test note', city: 'Warszawa' },
      });
  
      const mockPrisma = new PrismaClient();
      (mockPrisma.notes.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        description: 'Test note',
        city: 'Warszawa',
      });
  
      await handler(req, res);
  
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        id: 1,
        userId: 1,
        description: 'Test note',
        city: 'Warszawa',
      });
    });
  });
  