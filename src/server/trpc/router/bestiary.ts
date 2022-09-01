import { t, authedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  deleteCreatureSchema,
  creatureWithJoinsSchema,
  newCreatureWithJoinsSchema,
} from '../../../schema/bestiary'

export const bestiaryRouter = t.router({
  create: authedProcedure.input(newCreatureWithJoinsSchema).mutation(async ({ ctx, input }) => {
    const {
      savingThrows,
      skills,
      conditionImmunities,
      damageImmunities,
      damageResistances,
      damageVulnerabilities,
      senses,
      languages,
    } = input

    const userId = ctx.session.user.id

    const newCreature = await ctx.prisma.creatures.create({
      data: {
        ...input,
        createdById: userId,
        savingThrows: {
          createMany: { data: [...savingThrows] },
        },
        skills: {
          createMany: { data: [...skills] },
        },
        conditionImmunities: {
          createMany: { data: [...conditionImmunities] },
        },
        damageImmunities: {
          createMany: { data: [...damageImmunities] },
        },
        damageResistances: {
          createMany: { data: [...damageResistances] },
        },
        damageVulnerabilities: {
          createMany: { data: [...damageVulnerabilities] },
        },
        senses: {
          createMany: { data: [...senses] },
        },
        languages: {
          createMany: { data: [...languages] },
        },
      },
    })

    return newCreature
  }),

  update: authedProcedure.input(creatureWithJoinsSchema).mutation(async ({ ctx, input }) => {
    const {
      id,
      fromSRD,
      savingThrows,
      skills,
      conditionImmunities,
      damageImmunities,
      damageResistances,
      damageVulnerabilities,
      senses,
      languages,
    } = input

    if (fromSRD) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot edit entries from SRD' })
    }

    await Promise.all([
      ctx.prisma.creatureSavingThrows.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureSkills.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureConditionImmunities.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureDamageImmunities.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureDamageResistances.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureDamageVulnerabilities.deleteMany({ where: { creatureId: id } }),
      ctx.prisma.creatureSenses.deleteMany({ where: { creatureId: id } }),
    ])

    const updatedCreature = await ctx.prisma.creatures.update({
      where: { id },
      data: {
        ...input,
        savingThrows: {
          createMany: { data: [...savingThrows] },
        },
        skills: {
          createMany: { data: [...skills] },
        },
        conditionImmunities: {
          createMany: { data: [...conditionImmunities] },
        },
        damageImmunities: {
          createMany: { data: [...damageImmunities] },
        },
        damageResistances: {
          createMany: { data: [...damageResistances] },
        },
        damageVulnerabilities: {
          createMany: { data: [...damageVulnerabilities] },
        },
        senses: {
          createMany: { data: [...senses] },
        },
        languages: {
          createMany: { data: [...languages] },
        },
      },
    })

    return updatedCreature
  }),

  delete: authedProcedure.input(deleteCreatureSchema).mutation(async ({ ctx, input }) => {
    const { id, fromSRD } = input

    if (fromSRD) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete entries from SRD' })
    }
    await ctx.prisma.creatures.delete({ where: { id } })
  }),

  getAllPaginated: authedProcedure
    .input(
      z.object({
        fromSrd: z.boolean().optional().default(false),
        page: z.number().optional().default(0),
        limit: z.number().optional().default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentPage = Math.max(input.page * input.limit, 0)

      const count = await ctx.prisma.creatures.count({ where: { fromSRD: input.fromSrd } })

      const creatures = await ctx.prisma.creatures.findMany({
        where: { fromSRD: input.fromSrd },
        skip: currentPage,
        take: input.limit,
      })

      return {
        creatures,
        count,
        hasMore: currentPage + input.limit <= count,
      }
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

      return await ctx.prisma.creatures.findUnique({
        where: { id: `${input?.id}` },
        include: {
          conditionImmunities: true,
          damageImmunities: true,
          damageResistances: true,
          damageVulnerabilities: true,
          savingThrows: true,
          senses: true,
          skills: true,
          languages: true,
        },
      })
    }),
})
