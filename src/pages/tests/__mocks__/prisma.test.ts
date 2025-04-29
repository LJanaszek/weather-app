import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';


// Step 1: zagnieżdżone mockowanie prisma client
const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

// Step 2: symulowanie w wersji testowej wyciągania użytkownika po id (zamiast prisma.findUnique)
const getUserById = async (id: string): Promise<User | null> => {
  return prismaMock.user.findUnique({ where: { id } });
};

// Step 3: Testowanie logiki funkcji getUserById
describe('getUserById', () => {
  it('zwracanie użytkownika po id', async () => {
    const mockUser: User = { id: 'abc123', username: 'Alice', password: 'secret' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await getUserById('abc123');

    expect(user).toEqual(mockUser);
    console.log(user);
    console.log(mockUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'abc123' } });
  });
});
