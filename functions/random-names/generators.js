function chance (fraction) {
  return Math.random() < fraction
}

function randInt (max) {
  // simplified because it will always be min=0
  return Math.round(Math.random() * max)
}

function randElement (list) {
  const max = list.length - 1
  const index = randInt(max)
  return list[index]
}

module.exports = function RandomGenerators (dicts) {
  const adjectives = dicts['adjectives']
  const adverbs = dicts['adverbs']
  const palindromes = dicts['palindrome-sentences']
  const housingNouns = dicts['nouns-housing']
  const transportNouns = dicts['nouns-transportations']
  const alliterations = dicts['alliterations']
  const people = dicts['given-names']
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  // TODO: prepositions? number words?

  function randomLetterCombination () {
    let output = ''
    for (let idx = 1 + randInt(3); idx; idx--) output += randElement(letters)
    return output
  }

  function randomSuffixedName (suffix) {
    let person = randElement(people)
    if (person.endsWith('s') || person.endsWith('x') || person.endsWith('z')) {
      person += `' ${suffix}`
    } else {
      person += `'s ${suffix}`
    }
    return person
  }

  // This version always returns a named star
  function genNamedStar () {
    return randomSuffixedName('Star')
  }

  function genStar () {
    if (chance(0.1)) { // 10% chance for a personalized name
      return randomSuffixedName('Star')
    }

    const rndN = randInt(99999)
    const rndL = randomLetterCombination()
    const lettersFirst = chance(0.5)
    const output = lettersFirst ? `${rndL}-${rndN}` : `${rndN}-${rndL}`

    return output
  }

  function genPlanet () {
    if (chance(0.1)) { // 10% chance for Palindromes!
      return randElement(palindromes)
    }

    let output = ''
    const includeAdjective = chance(0.8)

    if (includeAdjective) {
      const includeAdverb = chance(0.2)
      if (includeAdverb) output += randElement(adverbs) + ' '
      output += randElement(adjectives) + ' '
    }
    output += randElement(housingNouns)
    return output
  }

  function genStation () {
    if (chance(0.1)) { // 10% chance for an alliteration!
      return randElement(alliterations)
    }

    if (chance(0.5)) { // 50% chance for something like Amal's hut
      const designation = randElement(housingNouns)
      return randomSuffixedName(designation)
    }

    let output = ''
    const includeAdjective = chance(0.8)

    if (includeAdjective) {
      const includeAdverb = chance(0.2)
      if (includeAdverb) output += randElement(adverbs) + ' '
      output += randElement(adjectives) + ' '
    }
    output += randElement(housingNouns)
    return output
  }

  function genStarship () {
    if (chance(0.1)) { // 10% chance for an alliteration!
      return randElement(alliterations)
    }

    if (chance(0.5)) { // 50% chance for something like Mel's steamship
      const designation = randElement(transportNouns)
      return randomSuffixedName(designation)
    }

    let output = ''
    const includeAdjective = chance(0.8)

    if (includeAdjective) {
      const includeAdverb = chance(0.2)
      if (includeAdverb) output += randElement(adverbs) + ' '
      output += randElement(adjectives) + ' '
    }
    output += randElement(transportNouns)
    return output
  }

  return { genStar, genNamedStar, genPlanet, genStation, genStarship }
}
