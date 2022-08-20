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

      const actors = [...input.friendlyActors, ...input.enemyActors]

      //Recategorize Actors by their setting
      const friendlyActors = actors.filter((actor) => actor.type !== 'enemy')
      const enemyActors = actors.filter((actor) => actor.type === 'enemy')

      return await ctx.prisma.encounters.create({
        data: {
          ...input,
          createdById: userId,
          friendlyActors: {
            createMany: { data: [...friendlyActors] },
          },
          enemyActors: {
            createMany: { data: [...enemyActors] },
          },
        },
      })
    },
  })
  .mutation('update', {
    input: excountersWithNewActorsSchema,
    async resolve({ ctx, input }) {
      const { id } = input

      const actors = [...input.friendlyActors, ...input.enemyActors]

      //Recategorize Actors by their setting
      const friendlyActors = actors.filter((actor) => actor.type !== 'enemy')
      const enemyActors = actors.filter((actor) => actor.type === 'enemy')

      await ctx.prisma.friendlyActors.deleteMany({ where: { encountersId: id } })
      await ctx.prisma.enemyActors.deleteMany({ where: { encountersId: id } })

      return await ctx.prisma.encounters.update({
        where: { id },
        data: {
          ...input,
          friendlyActors: {
            createMany: { data: [...friendlyActors] },
          },
          enemyActors: {
            createMany: { data: [...enemyActors] },
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
          friendlyActors: {
            include: {
              character: true,
              creature: true,
            },
          },
          enemyActors: {
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
