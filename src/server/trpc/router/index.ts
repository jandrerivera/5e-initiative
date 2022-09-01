import { t } from '../trpc'

import { characterRouter } from './characters'
import { bestiaryRouter } from './bestiary'
import { encountersRouter } from './encounters'

export const appRouter = t.router({
  character: characterRouter,
  bestiary: bestiaryRouter,
  encounters: encountersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
