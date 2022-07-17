import { TRPCError } from '@trpc/server';
import { resolve } from 'path';
import { z } from 'zod';
import { createRouter } from './context';
import {
  newCharacterSchema,
  characterSchema,
  deleteCharacterSchema,
} from '../../schema/characters';

export const characterRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .mutation('createNew', {
    input: newCharacterSchema,
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please log in' });
      }

      const updatedCharacter = await ctx.prisma.character.create({
        data: { ...input, createdById: userId },
      });

      return updatedCharacter;
    },
  })
  .mutation('update', {
    input: characterSchema,
    async resolve({ ctx, input }) {
      const { id } = input;

      const updatedCharacter = await ctx.prisma.character.update({
        where: { id },
        data: { ...input },
      });

      return updatedCharacter;
    },
  })
  .mutation('delete', {
    input: deleteCharacterSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.character.delete({ where: { id } });
    },
  })
  .query('getAll', {
    resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.character.findMany();
    },
  })
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      if (!input) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad Request' });
      }
      return ctx.prisma.character.findUnique({
        where: { id: `${input?.id}` },
      });
    },
  })
  .query('getAllByUserId', {
    resolve({ ctx }) {
      const userId = ctx.session.user.id;

      if (!userId) return null;
      return ctx.prisma.character.findMany({ where: { createdById: userId } });
    },
  })
  .query('getCountByUserId', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      if (!userId) return null;
      return ctx.prisma.character.count({ where: { createdById: userId } });
    },
  });
