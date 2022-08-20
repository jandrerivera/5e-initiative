import z from 'zod'
import { characterSchema } from './characters'
import { creatureSchema } from './bestiary'

export const encountersSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  status: z.enum(['ready', 'paused', 'completed']),
  currentRound: z.number().int(),
  currentTurn: z.number().int(),

  createdById: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const newEncountersSchema = encountersSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
})

export const deleteEncountersSchema = encountersSchema.pick({ id: true })

export type EncountersSchemaType = z.TypeOf<typeof encountersSchema>
export type NewEncountersSchemaType = z.TypeOf<typeof newEncountersSchema>
export type DeleteEncountersSchemaType = z.TypeOf<typeof deleteEncountersSchema>

export const actorsSchema = z.object({
  id: z.string().cuid(),
  type: z.enum(['friendly', 'enemy']),
  alias: z.string().nullable(),

  initiative: z.number().nullable(),
  concentration: z.boolean().default(false),
  transformed: z.boolean().default(true),
  visible: z.boolean().default(true),
  notes: z.string().nullable(),

  characterId: z.string().nullable(),
  creatureId: z.string().nullable(),
})

export const newActorsSchema = actorsSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
})

export const deleteActorsSchema = actorsSchema.pick({ id: true })

export type ActorsSchemaType = z.TypeOf<typeof actorsSchema>
export type NewActorsSchemaType = z.TypeOf<typeof newEncountersSchema>
export type DeleteActorsSchemaType = z.TypeOf<typeof deleteEncountersSchema>

export const excountersWithActorsSchema = encountersSchema.merge(
  z.object({
    friendlyActors: z.array(
      actorsSchema
        .merge(z.object({ character: characterSchema.nullable() }))
        .merge(z.object({ creature: creatureSchema.nullable() }))
    ),
    enemyActors: z.array(
      actorsSchema
        .merge(z.object({ character: characterSchema.nullable() }))
        .merge(z.object({ creature: creatureSchema.nullable() }))
    ),
  })
)

export const excountersWithNewActorsSchema = encountersSchema.merge(
  z.object({
    friendlyActors: z.array(newActorsSchema),
    enemyActors: z.array(newActorsSchema),
  })
)

export const newExcountersWithNewActorsSchema = newEncountersSchema.merge(
  z.object({
    friendlyActors: z.array(newActorsSchema),
    enemyActors: z.array(newActorsSchema),
  })
)

export type EncountersWithActorsSchemaType = z.TypeOf<typeof excountersWithActorsSchema>
export type NewExcountersWithNewActorsSchemaType = z.TypeOf<typeof newExcountersWithNewActorsSchema>
