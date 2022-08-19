import { TRPCError } from '@trpc/server'
import { createProtectedRouter } from './trpc/createProtectedRouter'
import { z } from 'zod'
import { newCharacterSchema, characterSchema, deleteCharacterSchema } from '../../schema/characters'

export const characterRouter = createProtectedRouter()
  .mutation('create', {
    input: newCharacterSchema,
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id

      return await ctx.prisma.character.create({
        data: { ...input, createdById: userId },
      })
    },
  })
  .mutation('update', {
    input: characterSchema,
    async resolve({ ctx, input }) {
      const { id } = input

      return await ctx.prisma.character.update({
        where: { id },
        data: { ...input },
      })
    },
  })
  .mutation('delete', {
    input: deleteCharacterSchema,
    async resolve({ ctx, input }) {
      const { id } = input
      await ctx.prisma.character.delete({ where: { id } })
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
      return ctx.prisma.character.findUnique({
        where: { id: `${input?.id}` },
      })
    },
  })
  .query('get-all-grouped-by-type', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id

      const PCs = await ctx.prisma.character.findMany({
        where: { createdById: userId, AND: { type: 'pc' } },
        orderBy: { createdAt: 'asc' },
      })

      const NPCs = await ctx.prisma.character.findMany({
        where: { createdById: userId, AND: { type: 'npc' } },
        orderBy: { createdAt: 'asc' },
      })

      return {
        PCs,
        NPCs,
      }
    },
  })
