import { t, authedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  newCharacterSchema,
  characterSchema,
  deleteCharacterSchema,
} from '../../../schema/characters'

export const characterRouter = t.router({
  create: authedProcedure.input(newCharacterSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    return await ctx.prisma.character.create({
      data: { ...input, createdById: userId },
    })
  }),
  update: authedProcedure.input(characterSchema).mutation(async ({ ctx, input }) => {
    const { id } = input

    return await ctx.prisma.character.update({
      where: { id },
      data: { ...input },
    })
  }),
  delete: authedProcedure.input(deleteCharacterSchema).mutation(async ({ ctx, input }) => {
    const { id } = input
    await ctx.prisma.character.delete({ where: { id } })
  }),
  getUniqueById: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' })
      }
      return await ctx.prisma.character.findUnique({
        where: { id: `${input?.id}` },
      })
    }),
  getAll: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    return await ctx.prisma.character.findMany()
  }),
  getAllGroupedByType: authedProcedure.query(async ({ ctx }) => {
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
  }),
})
