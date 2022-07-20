// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { characterRouter } from '../characters';
import { creaturesRouter } from '../creatures';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('character.', characterRouter)
  .merge('creatures.', creaturesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
