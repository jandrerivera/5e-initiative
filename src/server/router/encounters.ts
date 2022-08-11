import { TRPCError } from '@trpc/server'
import { createProtectedRouter } from './trpc/createProtectedRouter'
import { z } from 'zod'
import {
  newEncountersSchema,
  encountersSchema,
  deleteEncountersSchema,
} from '../../schema/encounters'

export const encountersRouter = createProtectedRouter()
  .mutation('create', {
    input: newEncountersSchema,
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id

      return await ctx.prisma.encounters.create({
        data: { ...input, createdById: userId },
      })
    },
  })
  .mutation('update', {
    input: encountersSchema,
    async resolve({ ctx, input }) {
      const { id } = input

      return await ctx.prisma.encounters.update({
        where: { id },
        data: { ...input },
      })
    },
  })
  .mutation('delete', {
    input: deleteEncountersSchema,
    async resolve({ ctx, input }) {
      const { id } = input
      await ctx.prisma.encounters.delete({ where: { id } })
    },
  })
  .query('get-unique-by-id', {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' })
      }
      return ctx.prisma.encounters.findUnique({
        where: { id: `${input?.id}` },
      })
    },
  })
  .query('get-all-from-user', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id

      return await ctx.prisma.encounters.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'asc' },
      })
    },
  })
