// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { characterRouter } from '../characters'
import { bestiaryRouter } from '../bestiary'
import { encountersRouter } from '../encounters'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('character.', characterRouter)
  .merge('bestiary.', bestiaryRouter)
  .merge('encounters.', encountersRouter)

// export type definition of API
export type AppRouter = typeof appRouter
