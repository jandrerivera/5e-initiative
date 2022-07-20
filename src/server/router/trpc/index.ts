// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { characterRouter } from '../characters';
import { bestiaryRouter } from '../bestiary';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('character.', characterRouter)
  .merge('bestiary.', bestiaryRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
