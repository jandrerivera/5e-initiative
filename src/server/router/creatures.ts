import { TRPCError } from '@trpc/server';
import { createProtectedRouter } from './trpc/createProtectedRouter';
import { z } from 'zod';
import {
  creatureSchema,
  deleteCreatureSchema,
  creatureSchemaWithJoinsSchema,
} from '../../schema/creatures';
import { InferQueryInput } from '../../utils/trpc';

export const creaturesRouter = createProtectedRouter()
  .mutation('update', {
    input: creatureSchemaWithJoinsSchema,

    async resolve({ ctx, input }) {
      const { id, conditionImmunities } = input;

      await ctx.prisma.creatureConditionImmunities.deleteMany({ where: { creatureId: id } });

      const updatedCharacter = await ctx.prisma.creatures.update({
        where: { id },
        data: {
          ...input,
          conditionImmunities: {
            createMany: {
              data: [...conditionImmunities],
            },
          },
        },
      });

      return updatedCharacter;
    },
  })
  // .mutation('delete', {
  //   input: deleteCreatureSchema,
  //   async resolve({ ctx, input }) {
  //     const { id } = input;
  //     await ctx.prisma.creatures.delete({ where: { id } });
  //   },
  // })

  .query('get-all', {
    resolve({ ctx }) {
      return ctx.prisma.creatures.findMany({ include: { conditionImmunities: true } });
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
        include: { conditionImmunities: true },
      });
    },
  });
