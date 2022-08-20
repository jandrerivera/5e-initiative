import z from 'zod'

export const characterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  playerName: z.string().nullable(),

  createdById: z.string().cuid(), //.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),

  type: z.enum(['pc', 'npc']).default('pc'),
  isFriendly: z.boolean().default(true),
  isDead: z.boolean().default(false),

  avatar: z.string().nullable(),
  race: z.string().nullable(),
  characterClass: z.string().nullable(),
  subclass: z.string().nullable(),

  advancementType: z.enum(['xp', 'milestone']).default('xp'),
  level: z.number().int().default(0),
  experiencePoints: z.number().int().default(0),

  hpMax: z.number().int().default(0),
  ac: z.number().int().default(0),
  spellSave: z.number().int().default(0),
  hitDice: z.string().nullable(),

  // conditions:
  // currentHp: z.number().int().nullable(),
  // tempHp: z.number().int().nullable(),
  // currentAc: z.number().int().nullable(),
  // deathSavesSuccess: z.number().int().nullable(),
  // deathSavesFailed: z.number().int().nullable(),

  initiative: z.number().int().default(0),
  inspiration: z.boolean().default(false),

  speedWalking: z.number().int().default(30),
  speedClimbing: z.number().int().default(0),
  speedFlying: z.number().int().default(0),
  speedSwimming: z.number().int().default(0),
  speedBurrowing: z.number().int().default(0),

  creatureSize: z.string().nullable(),
  creatureType: z.string().nullable(),
  alignment: z.string().nullable(),
  challengeRating: z.string().nullable(),
  source: z.string().nullable(),

  str: z.number().int().default(10),
  strBonus: z.boolean().default(false),
  dex: z.number().int().default(10),
  dexBonus: z.boolean().default(false),
  con: z.number().int().default(10),
  conBonus: z.boolean().default(false),
  int: z.number().int().default(10),
  intBonus: z.boolean().default(false),
  wis: z.number().int().default(10),
  wisBonus: z.boolean().default(false),
  cha: z.number().int().default(10),
  chaBonus: z.boolean().default(false),

  skillAcrobaticsProficient: z.boolean().default(false),
  skillAcrobaticsExpertise: z.boolean().default(false),
  skillAnimalHandlingProficient: z.boolean().default(false),
  skillAnimalHandlingExpertise: z.boolean().default(false),
  skillArcanaProficient: z.boolean().default(false),
  skillArcanaExpertise: z.boolean().default(false),
  skillAthleticsProficient: z.boolean().default(false),
  skillAthleticsExpertise: z.boolean().default(false),
  skillDeceptionProficient: z.boolean().default(false),
  skillDeceptionExpertise: z.boolean().default(false),
  skillHistoryProficient: z.boolean().default(false),
  skillHistoryExpertise: z.boolean().default(false),
  skillInsightProficient: z.boolean().default(false),
  skillInsightExpertise: z.boolean().default(false),
  skillIntimidationProficient: z.boolean().default(false),
  skillIntimidationExpertise: z.boolean().default(false),
  skillInvestigationProficient: z.boolean().default(false),
  skillInvestigationExpertise: z.boolean().default(false),
  skillMedicineProficient: z.boolean().default(false),
  skillMedicineExpertise: z.boolean().default(false),
  skillNatureProficient: z.boolean().default(false),
  skillNatureExpertise: z.boolean().default(false),
  skillPerceptionProficient: z.boolean().default(false),
  skillPerceptionExpertise: z.boolean().default(false),
  skillPerformanceProficient: z.boolean().default(false),
  skillPerformanceExpertise: z.boolean().default(false),
  skillPersuasionProficient: z.boolean().default(false),
  skillPersuasionExpertise: z.boolean().default(false),
  skillReligionProficient: z.boolean().default(false),
  skillReligionExpertise: z.boolean().default(false),
  skillSleightOfHandProficient: z.boolean().default(false),
  skillSleightOfHandExpertise: z.boolean().default(false),
  skillStealthProficient: z.boolean().default(false),
  skillStealthExpertise: z.boolean().default(false),
  skillSurvivalProficient: z.boolean().default(false),
  skillSurvivalExpertise: z.boolean().default(false),
})

export const newCharacterSchema = characterSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
})

export const deleteCharacterSchema = characterSchema.pick({ id: true })

export type CharacterSchemaType = z.TypeOf<typeof characterSchema>
export type NewCharacterSchemaType = z.TypeOf<typeof newCharacterSchema>
export type DeleteCharacterSchemaType = z.TypeOf<typeof deleteCharacterSchema>
