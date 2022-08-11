import z from 'zod'

export const encountersSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
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
  type: z.enum(['player', 'friendly', 'monster']),
  initiative: z.number().nullable(),
  concentration: z.boolean().default(false),
  transformed: z.boolean().default(true),
  visible: z.boolean().default(true),
  notes: z.string().nullable(),
})

export const excountersWithActorsSchema = encountersSchema.merge(
  z.object({ actors: z.array(actorsSchema) })
)

export const newActorsSchema = encountersSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
})

export const deleteActorsSchema = encountersSchema.pick({ id: true })

export type ActorsSchemaType = z.TypeOf<typeof actorsSchema>
export type NewActorsSchemaType = z.TypeOf<typeof newEncountersSchema>
export type DeleteActorsSchemaType = z.TypeOf<typeof deleteEncountersSchema>
