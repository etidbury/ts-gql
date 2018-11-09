import { Prisma as PrismaClient } from './generated/prisma-client'
import { Prisma as PrismaBinding } from 'prisma-binding'

export interface Context {
  db: PrismaClient,
  prisma: PrismaBinding
}
// export {Context} from ''

export interface HelloPayload {
  name: string | null
}
