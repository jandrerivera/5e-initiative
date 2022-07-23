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
        fromSRD,
        savingThrows,
        skills,
        conditionImmunities,
        damageImmunities,
        damageResistances,
        damageVulnerabilities,
        senses,
        languages,
      } = input;

      if (fromSRD) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot edit entries from SRD' });
      }

      await Promise.all([
        ctx.prisma.creatureSavingThrows.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureSkills.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureConditionImmunities.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureDamageImmunities.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureDamageResistances.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureDamageVulnerabilities.deleteMany({ where: { creatureId: id } }),
        ctx.prisma.creatureSenses.deleteMany({ where: { creatureId: id } }),
      ]);

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
      const { id, fromSRD } = input;

      if (fromSRD) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete entries from SRD' });
      }
      await ctx.prisma.creatures.delete({ where: { id } });
    },
  })

  .query('get-all', {
    async resolve({ ctx }) {
      return await ctx.prisma.creatures.findMany({
        where: { fromSRD: false },
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
      });
    },
  })
  .query('get-all-from-srd', {
    async resolve({ ctx }) {
      return await ctx.prisma.creatures.findMany({
        where: { fromSRD: true },
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
      });
    },
  })
  .query('get-all-grouped-by-srd', {
    async resolve({ ctx }) {
      const fromSRD = await ctx.prisma.creatures.findMany({
        where: { fromSRD: true },
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
      });

      const customCreatures = await ctx.prisma.creatures.findMany({
        where: { fromSRD: false },
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
      });

      return {
        fromSRD,
        customCreatures,
      };
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
          savingThrows: true,
          senses: true,
          skills: true,
          languages: true,
        },
      });
    },
  });
