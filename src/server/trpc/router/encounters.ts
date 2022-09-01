import { TRPCError } from '@trpc/server'
import { t, authedProcedure } from '../trpc'
import { z } from 'zod'
import {
  excountersWithNewActorsSchema,
  newExcountersWithNewActorsSchema,
  deleteEncountersSchema,
} from '../../../schema/encounters'

export const encountersRouter = t.router({
  create: authedProcedure
    .input(newExcountersWithNewActorsSchema)
    .mutation(async ({ ctx, input }) => {
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
    }),
  update: authedProcedure.input(excountersWithNewActorsSchema).mutation(async ({ ctx, input }) => {
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
  }),
  delete: authedProcedure.input(deleteEncountersSchema).mutation(async ({ ctx, input }) => {
    const { id } = input
    await ctx.prisma.encounters.delete({ where: { id } })
  }),
  getUniqueByIdWithActors: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
    }),

  getAllFromUser: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    return await ctx.prisma.encounters.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'asc' },
    })
  }),
})
