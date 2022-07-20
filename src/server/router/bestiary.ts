import { TRPCError } from '@trpc/server';
import { createProtectedRouter } from './trpc/createProtectedRouter';
import { z } from 'zod';
import {
  deleteCreatureSchema,
  creatureWithJoinsSchema,
  newCreatureWithJoinsSchema,
} from '../../schema/bestiary';

export const bestiaryRouter = createProtectedRouter()
  .mutation('create', {
    input: newCreatureWithJoinsSchema,
    async resolve({ ctx, input }) {
      const {
        savingThrows,
        skills,
        conditionImmunities,
        damageImmunities,
        damageResistances,
        damageVulnerabilities,
        senses,
        languages,
      } = input;

      const userId = ctx.session.user.id;

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
      });

      return newCreature;
    },
  })
  .mutation('update', {
    input: creatureWithJoinsSchema,

    async resolve({ ctx, input }) {
      const {
        id,
        savingThrows,
        skills,
        conditionImmunities,
        damageImmunities,
        damageResistances,
        damageVulnerabilities,
        senses,
        languages,
      } = input;

      await ctx.prisma.creatureSavingThrows.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureSkills.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureConditionImmunities.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureDamageImmunities.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureDamageResistances.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureDamageVulnerabilities.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureSenses.deleteMany({ where: { creatureId: id } });
      await ctx.prisma.creatureLanguages.deleteMany({ where: { creatureId: id } });

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
      });

      return updatedCreature;
    },
  })
  .mutation('delete', {
    input: deleteCreatureSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.creatures.delete({ where: { id } });
    },
  })

  .query('get-all', {
    resolve({ ctx }) {
      return ctx.prisma.creatures.findMany({
        include: {
          conditionImmunities: true,
          damageImmunities: true,
          damageResistances: true,
          damageVulnerabilities: true,
          languages: true,
          savingThrows: true,
          senses: true,
          skills: true,
        },
      });
    },
  })
  .query('get-unique-by-id', {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' });
      }

      return ctx.prisma.creatures.findUnique({
        where: { id: `${input?.id}` },
        include: {
          conditionImmunities: true,
          damageImmunities: true,
          damageResistances: true,
          damageVulnerabilities: true,
          languages: true,
          savingThrows: true,
          senses: true,
          skills: true,
        },
      });
    },
  });
