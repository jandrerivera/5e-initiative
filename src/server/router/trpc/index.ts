// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { characterRouter } from '../characters';

export const appRouter = createRouter().transformer(superjson).merge('character.', characterRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
