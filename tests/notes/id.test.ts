import * as auth from '../../src/pages/api/authenticateUser';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, Notes } from '@prisma/client';


// Step 1: zagnieżdżone mockowanie prisma client
const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

const getNotesById = async (id: string): Promise<Notes[] | null> => {
  return prismaMock.notes.findMany({ where: { id } });
};

const deleteNotesById = async (id: string) => {
  return prismaMock.notes.deleteMany({ where: { id } });
};

const updateNotesById = async (id: string) => {
  return prismaMock.notes.updateMany({ where: { id } });
};

const mockNotes = [
  { 
    id: '1', 
    userId: 'user-123', 
    city: 'Warsaw', 
    description: 'note 1', 
    createdAt: new Date() 
  },
  {
    id: '2',
    userId: 'user-123',
    city: 'Warsaw',
    description: 'note 2',
    createdAt: new Date()
  }
];


describe('testing notes', () => {
  const user = { id: 'user-123' };

  beforeEach(() => {
    jest.spyOn(auth, 'authenticateUser').mockReturnValue(user);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Wyciąganie notatki po id', async () => {
    prismaMock.notes.findMany.mockResolvedValue(mockNotes);

    const notes = await getNotesById('1');

    expect(notes).toEqual(mockNotes);
    expect(prismaMock.notes.findMany).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('testowanie usuwania notatki', async () => {
    prismaMock.notes.deleteMany.mockResolvedValue({ count: 1 });

    const notes = await deleteNotesById('1');

    expect(notes).toEqual({ count: 1 });
    expect(prismaMock.notes.deleteMany).toHaveBeenCalledWith({ where: { id: '1' } });
  
  });

  it('PUT updates note', async () => {
    prismaMock.notes.updateMany.mockResolvedValue({ count: 1 });

    const notes = await updateNotesById('1');

    expect(notes).toEqual({ count: 1 });
    expect(prismaMock.notes.updateMany).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  
});
