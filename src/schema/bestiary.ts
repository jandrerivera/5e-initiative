import z from 'zod';

export const creatureSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),

  createdById: z.string().cuid(),
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
});

export type CreatureSchemaType = z.TypeOf<typeof creatureSchema>;

// CREATURE RELATED TABLES
export const creatureSavingThrowsSchema = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  // creatureId: z.string().nullable(),
});

export const creatureConditionImmunitiesSchema = creatureSavingThrowsSchema;
export const creatureDamageImmunitiesSchema = creatureSavingThrowsSchema;
export const creatureDamageResistancesSchema = creatureSavingThrowsSchema;
export const creatureDamageVulnerabilitiesSchema = creatureSavingThrowsSchema;

export const creatureSkillsSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
  proficient: z.boolean(),
  expertise: z.boolean(),
  // creatureId: z.string().nullable(),
});

export const creatureSensesSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
  distance: z.number(),
  // creatureId: z.string().nullable(),
});

export const creatureLanguagesSchema = z.object({
  id: z.string().cuid(),
  languageName: z.string(),
  speaks: z.boolean(),
  understands: z.boolean(),
  exception: z.string().nullable(),
  distance: z.number().nullable(),
  // creatureId: z.string().nullable(),
});

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
});
export type CreatureJoinsSchemaType = z.TypeOf<typeof creatureJoinsSchema>;

export const creatureWithJoinsSchema = creatureSchema.merge(creatureJoinsSchema);
export type CreatureWithJoinsSchemaType = CreatureSchemaType & CreatureJoinsSchemaType;

// NEW CREATURE
export const newCreatureSchema = creatureSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
});
export const newCreatureWithJoinsSchema = newCreatureSchema.merge(creatureJoinsSchema);
export type NewCreatureSchemaType = z.TypeOf<typeof newCreatureSchema>;
export type NewCreatureWithJoinsSchemaType = NewCreatureSchemaType & CreatureJoinsSchemaType;

// DELETE CREATURE
export const deleteCreatureSchema = creatureSchema.pick({ id: true });
export type DeleteCreatureSchemaType = z.TypeOf<typeof deleteCreatureSchema>;
