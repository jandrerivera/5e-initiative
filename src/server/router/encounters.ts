import { TRPCError } from '@trpc/server'
import { createProtectedRouter } from './trpc/createProtectedRouter'
import { z } from 'zod'
import {
  excountersWithNewActorsSchema,
  newExcountersWithNewActorsSchema,
  deleteEncountersSchema,
} from '../../schema/encounters'

export const encountersRouter = createProtectedRouter()
  .mutation('create', {
    input: newExcountersWithNewActorsSchema,
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id

      const { actors, ...encounter } = input

      return await ctx.prisma.encounters.create({
        data: {
          ...encounter,
          createdById: userId,
          actors: {
            createMany: { data: actors },
          },
        },
      })
    },
  })
  .mutation('update', {
    input: excountersWithNewActorsSchema,
    async resolve({ ctx, input }) {
      const { id, actors, ...encounter } = input

      await ctx.prisma.actors.deleteMany({ where: { encountersId: id } })

      return await ctx.prisma.encounters.update({
        where: { id },
        data: {
          ...encounter,
          actors: {
            createMany: { data: actors },
          },
        },
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
  .query('get-unique-by-id-with-actors', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' })
      }

      const encounter = await ctx.prisma.encounters.findUnique({
        where: { id: `${input?.id}` },
        include: {
          actors: {
            include: {
              character: true,
              creature: true,
            },
          },
        },
      })

      return encounter
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
