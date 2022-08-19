import { string } from 'zod'
import { data } from './monsters'
import { characters } from './characters'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const srdMonsterData = data.map((monster) => {
  const parseString = (val: string | undefined): number => {
    if (!val || val === undefined) return 0
    return parseInt(val.split(' ')[0] as string)
  }

  const parseSenses = (senses: Record<string, string | number | undefined>) => {
    let sensesArr = []
    for (let key in senses) {
      if (!senses[key]) return
      let value = senses[key] as string
      sensesArr.push({ type: key.replace('_', ' '), value: `${value}` })
    }

    return sensesArr
  }

  const parseLanguages = (lang: string) => {
    type TLang = { name: string; level: 'speaks' | 'understands'; exception: string }
    let langArr: TLang[] = []

    let cleanLang = lang.replace(' and ', ', ').replace(',,', ',')

    const [speaks, understands] = cleanLang.split('understands ')

    if (speaks) {
      const speaksArr = speaks.split(',')

      speaksArr.forEach((v) => {
        langArr.push({ name: v.trim(), level: 'speaks', exception: '' })
      })
    }

    if (understands) {
      let butCantIt = understands.trim().indexOf("but can't speak it")
      let exception = butCantIt ? `but can't speak it` : `but can't speak`

      const understandsArr = understands.split(',')
      understandsArr.forEach((v) => {
        let name = v
          .trim()
          .replace("but can't speak it", '')
          .replace("but doesn't speak it", '')
          .replace("but can't speak", '')
          .trim()

        langArr.push({ name, level: 'understands', exception })
      })
    }

    return langArr
  }

  const prof = monster.proficiencies.map(({ proficiency, value }) => ({
    type: proficiency.name,
    value: `${value}`,
  }))

  const saving = prof.filter((skill) => skill.type.split('Saving Throw: ')[1])
  const skills = prof.filter((skill) => skill.type.split('Skill: ')[1])

  return {
    // id: monster.index,
    fromSRD: true,
    name: monster.name,
    creatureSize: monster.size,
    creatureType: monster.type,
    alignment: monster.alignment,
    challengeRating: `${monster.challenge_rating}`,
    source: 'System Reference Document 5.1 (SRD5)',
    hpMax: monster.hit_points,
    ac: monster.armor_class,
    hitDice: monster.hit_dice,
    speedWalking: parseString(monster.speed.walk),
    speedClimbing: parseString(monster.speed?.climb),
    speedFlying: parseString(monster.speed?.fly),
    speedSwimming: parseString(monster.speed?.swim),
    speedBurrowing: parseString(monster.speed?.burrow),
    str: monster.strength,
    dex: monster.dexterity,
    con: monster.constitution,
    int: monster.intelligence,
    wis: monster.wisdom,
    cha: monster.charisma,
    conditionImmunities: monster.condition_immunities.map((v) => ({ type: v.name })),
    damageImmunities: monster.damage_immunities.map((v) => ({ type: v })),
    damageResistances: monster.damage_resistances.map((v) => ({ type: v })),
    damageVulnerabilities: monster.damage_vulnerabilities.map((v) => ({ type: v })),
    senses: parseSenses(monster.senses) || [],
    savingThrows: saving.map(({ type, value }) => ({
      value,
      type: type.split('Saving Throw: ')[1]?.toLocaleLowerCase() || '',
    })),
    skills: skills.map(({ type, value }) => ({ value, type: type.split('Skill: ')[1] || '' })),
    languages: parseLanguages(monster.languages),
  }
})

async function main() {
  srdMonsterData.forEach(async (creature) => {
    const {
      savingThrows,
      skills,
      conditionImmunities,
      damageImmunities,
      damageResistances,
      damageVulnerabilities,
      senses,
      languages,
    } = creature

    await prisma.creatures.create({
      data: {
        ...creature,
        savingThrows: {
          createMany: { data: [...savingThrows] },
        },
        skills: {
          createMany: { data: [...skills] },
        },
        conditionImmunities: {
          createMany: { data: [...conditionImmunities] },
        },
        damageImmunities: {
          createMany: { data: [...damageImmunities] },
        },
        damageResistances: {
          createMany: { data: [...damageResistances] },
        },
        damageVulnerabilities: {
          createMany: { data: [...damageVulnerabilities] },
        },
        senses: {
          createMany: { data: [...senses] },
        },
        languages: {
          createMany: { data: [...languages] },
        },
      },
    })
  })

  characters.forEach(async (character) => {
    await prisma.character.create({
      data: character,
    })
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
