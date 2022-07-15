import { TRPCError } from '@trpc/server';
import { createRouter } from './context';

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
  .query('getAll', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.character.findMany();
    },
  })
  .query('getAllbyUserId', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      if (!userId) return null;
      return ctx.prisma.character.findMany({ where: { userId } });
    },
  });
