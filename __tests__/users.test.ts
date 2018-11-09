import { prisma } from '../src/generated/prisma-client'

test('Resolve users', async () => {
    const users = await prisma.users()
    expect(users.length).toBeGreaterThanOrEqual(1)
})