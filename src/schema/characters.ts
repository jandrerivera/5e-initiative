import z from 'zod'

export const characterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  playerName: z.string().nullable(),

  type: z.enum(['PC', 'NPC']),
  isFriendly: z.boolean(),
  isDead: z.boolean(),

  createdById: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),

  avatar: z.string().nullable(),
  race: z.string().nullable(),
  characterClass: z.string().nullable(),
  subclass: z.string().nullable(),

  level: z.number().int(),
  experiencePoints: z.number().int(),
  hpMax: z.number().int(),
  ac: z.number().int(),
  spellSave: z.number().int(),

  inspiration: z.boolean(),
  initiative: z.number().int(),

  // conditions:
  // currentHp: z.number().int().nullable(),
  // tempHp: z.number().int().nullable(),
  // currentAc: z.number().int().nullable(),
  // deathSavesSuccess: z.number().int().nullable(),
  // deathSavesFailed: z.number().int().nullable(),

  speedWalking: z.number().int(),
  speedClimbing: z.number().int().nullable(),
  speedFlying: z.number().int().nullable(),
  speedSwimming: z.number().int().nullable(),
  speedBurrowing: z.number().int().nullable(),

  creatureSize: z.string().nullable(),
  creatureType: z.string().nullable(),
  alignment: z.string().nullable(),
  challengeRating: z.string().nullable(),
  source: z.string().nullable(),

  str: z.number().int(),
  strBonus: z.boolean(),
  dex: z.number().int(),
  dexBonus: z.boolean(),
  con: z.number().int(),
  conBonus: z.boolean(),
  int: z.number().int(),
  intBonus: z.boolean(),
  wis: z.number().int(),
  wisBonus: z.boolean(),
  cha: z.number().int(),
  chaBonus: z.boolean(),

  skillAcrobaticsProficient: z.boolean(),
  skillAcrobaticsExpertise: z.boolean(),
  skillAnimalHandlingProficient: z.boolean(),
  skillAnimalHandlingExpertise: z.boolean(),
  skillArcanaProficient: z.boolean(),
  skillArcanaExpertise: z.boolean(),
  skillAthleticsProficient: z.boolean(),
  skillAthleticsExpertise: z.boolean(),
  skillDeceptionProficient: z.boolean(),
  skillDeceptionExpertise: z.boolean(),
  skillHistoryProficient: z.boolean(),
  skillHistoryExpertise: z.boolean(),
  skillInsightProficient: z.boolean(),
  skillInsightExpertise: z.boolean(),
  skillIntimidationProficient: z.boolean(),
  skillIntimidationExpertise: z.boolean(),
  skillInvestigationProficient: z.boolean(),
  skillInvestigationExpertise: z.boolean(),
  skillMedicineProficient: z.boolean(),
  skillMedicineExpertise: z.boolean(),
  skillNatureProficient: z.boolean(),
  skillNatureExpertise: z.boolean(),
  skillPerceptionProficient: z.boolean(),
  skillPerceptionExpertise: z.boolean(),
  skillPerformanceProficient: z.boolean(),
  skillPerformanceExpertise: z.boolean(),
  skillPersuasionProficient: z.boolean(),
  skillPersuasionExpertise: z.boolean(),
  skillReligionProficient: z.boolean(),
  skillReligionExpertise: z.boolean(),
  skillSleightOfHandProficient: z.boolean(),
  skillSleightOfHandExpertise: z.boolean(),
  skillStealthProficient: z.boolean(),
  skillStealthExpertise: z.boolean(),
  skillSurvivalProficient: z.boolean(),
  skillSurvivalExpertise: z.boolean(),
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
