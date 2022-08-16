import { TRPCError } from '@trpc/server'
import { createProtectedRouter } from './trpc/createProtectedRouter'
import { z } from 'zod'
import {
  encountersSchema,
  excountersWithNewActorsSchema,
  newEncountersSchema,
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
    input: excountersWithNewActorsSchema,
    async resolve({ ctx, input }) {
      const { id, actors } = input

      await ctx.prisma.actors.deleteMany({ where: { encountersId: id } })

      return await ctx.prisma.encounters.update({
        where: { id },
        data: {
          ...input,
          actors: {
            createMany: { data: [...actors] },
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
    resolve({ ctx, input }) {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' })
      }

      return ctx.prisma.encounters.findUnique({
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
  .query('get-characters-grouped-by-type', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id

      const PCs = await ctx.prisma.character.findMany({
        where: { createdById: userId, AND: { type: 'PC' } },
        orderBy: { createdAt: 'asc' },
      })

      const NPCs = await ctx.prisma.character.findMany({
        where: { createdById: userId, AND: { type: 'NPC' } },
        orderBy: { createdAt: 'asc' },
      })

      return {
        PCs,
        NPCs,
      }
    },
  })
