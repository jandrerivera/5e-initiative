import z from 'zod'

export const creatureSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),

  fromSRD: z.boolean(),

  createdById: z.string().cuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),

  avatar: z.string().nullable(),

  creatureSize: z.string().nullable(),
  creatureType: z.string().nullable(),
  alignment: z.string().nullable(),
  challengeRating: z.string().nullable(),
  source: z.string().nullable(),

  hpMax: z.number().int(),
  ac: z.number().int(),
  hitDice: z.string().nullable(),

  // conditions:
  // currentHp: z.number().int().nullable(),
  // tempHp: z.number().int().nullable(),
  // currentAc: z.number().int().nullable(),

  speedWalking: z.number().int(),
  speedClimbing: z.number().int().nullable(),
  speedFlying: z.number().int().nullable(),
  speedSwimming: z.number().int().nullable(),
  speedBurrowing: z.number().int().nullable(),

  str: z.number().int(),
  dex: z.number().int(),
  con: z.number().int(),
  int: z.number().int(),
  wis: z.number().int(),
  cha: z.number().int(),
})

export type CreatureSchemaType = z.TypeOf<typeof creatureSchema>

// CREATURE RELATED TABLES
export const creatureSavingThrowsSchema = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  value: z.string(),
  // creatureId: z.string().nullable(),
})
export const creatureSkillsSchema = creatureSavingThrowsSchema
export const creatureSensesSchema = creatureSavingThrowsSchema

export const creatureConditionImmunitiesSchema = creatureSavingThrowsSchema.omit({ value: true })
export const creatureDamageImmunitiesSchema = creatureSavingThrowsSchema.omit({ value: true })
export const creatureDamageResistancesSchema = creatureSavingThrowsSchema.omit({ value: true })
export const creatureDamageVulnerabilitiesSchema = creatureSavingThrowsSchema.omit({ value: true })

export const creatureLanguagesSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  level: z.enum(['speaks', 'understands']),
  exception: z.string().nullable(),
  // creatureId: z.string().nullable(),
})

// CREATURE JOINS
export const creatureJoinsSchema = z.object({
  savingThrows: z.array(creatureSavingThrowsSchema),
  skills: z.array(creatureSkillsSchema),
  conditionImmunities: z.array(creatureConditionImmunitiesSchema),
  damageImmunities: z.array(creatureDamageImmunitiesSchema),
  damageResistances: z.array(creatureDamageResistancesSchema),
  damageVulnerabilities: z.array(creatureDamageVulnerabilitiesSchema),
  senses: z.array(creatureSensesSchema),
  languages: z.array(creatureLanguagesSchema),
})

export type CreatureJoinsSchemaType = z.TypeOf<typeof creatureJoinsSchema>

export const creatureWithJoinsSchema = creatureSchema.merge(creatureJoinsSchema)
export type CreatureWithJoinsSchemaType = CreatureSchemaType & CreatureJoinsSchemaType

// NEW CREATURE
export const newCreatureSchema = creatureSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
})
export const newCreatureWithJoinsSchema = newCreatureSchema.merge(creatureJoinsSchema)
export type NewCreatureSchemaType = z.TypeOf<typeof newCreatureSchema>
export type NewCreatureWithJoinsSchemaType = NewCreatureSchemaType & CreatureJoinsSchemaType

// DELETE CREATURE
export const deleteCreatureSchema = creatureSchema.pick({ id: true, fromSRD: true })
export type DeleteCreatureSchemaType = z.TypeOf<typeof deleteCreatureSchema>
