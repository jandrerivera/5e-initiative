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

  // savingThrows          CreatureSavingThrows[]
  // skills                CreatureSkills[]
  // conditionImmunities   CreatureConditionImmunities[]
  // damageImmunities      CreatureDamageImmunities[]
  // damageResistances     CreatureDamageResistances[]
  // damageVulnerabilities CreatureDamageVulnerabilities[]
  // senses                CreatureSenses[]
  // languages             CreatureLanguages[]
});
export type CreatureSchemaType = z.TypeOf<typeof creatureSchema>;

export const creatureSavingThrowsSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
  creatureId: z.string().nullable(),
});
export type CreatureSavingThrowsSchemaType = z.TypeOf<typeof creatureSavingThrowsSchema>;

export const creatureSkillsSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
  proficient: z.boolean(),
  expertise: z.boolean(),
  creatureId: z.string().nullable(),
});
export type CreatureSkillsSchemaType = z.TypeOf<typeof creatureSkillsSchema>;

export const creatureConditionImmunitiesSchema = creatureSavingThrowsSchema;
export type CreatureConditionImmunitiesSchemaType = z.TypeOf<
  typeof creatureConditionImmunitiesSchema
>;

export const creatureDamageImmunitiesSchema = creatureSavingThrowsSchema;
export type CreatureDamageImmunitiesSchemaType = z.TypeOf<typeof creatureDamageImmunitiesSchema>;

export const creatureDamageResistancesSchema = creatureSavingThrowsSchema;
export type CreatureDamageResistancesSchemaType = z.TypeOf<typeof creatureDamageResistancesSchema>;

export const creatureDamageVulnerabilitiesSchema = creatureSavingThrowsSchema;
export type CreatureDamageVulnerabilitiesSchemaType = z.TypeOf<
  typeof creatureDamageVulnerabilitiesSchema
>;

export const creatureSensesSchema = z.object({
  id: z.string().cuid(),
  type: z.string(),
  distance: z.number(),
  creatureId: z.string().nullable(),
});

export const creatureLanguagesSchema = z.object({
  id: z.string().cuid(),
  languageName: z.string(),
  speaks: z.boolean(),
  understands: z.boolean(),
  exception: z.string().nullable(),
  distance: z.number().nullable(),
  creatureId: z.string().nullable(),
});

export const creatureJoinsSchema = z.object({
  // savingThrows
  // skills
  conditionImmunities: z.array(creatureConditionImmunitiesSchema),
  // damageImmunities
  // damageResistances
  // damageVulnerabilities
  // senses
  // languages
});

export const creatureSchemaWithJoinsSchema = creatureSchema.merge(creatureJoinsSchema);
export type CreatureSchemaWithJoinsType = CreatureSchemaType & {
  // savingThrows
  // skills
  conditionImmunities: CreatureConditionImmunitiesSchemaType[];
  // damageImmunities
  // damageResistances
  // damageVulnerabilities
  // senses
  // languages
};

export const newCreatureSchema = creatureSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
});
export type NewCreatureSchemaType = z.TypeOf<typeof newCreatureSchema>;

export const deleteCreatureSchema = creatureSchema.pick({ id: true });
export type DeleteCreatureSchemaType = z.TypeOf<typeof deleteCreatureSchema>;
