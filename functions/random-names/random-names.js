const dicts = require('./dicts.js')
const randomGenerators = require('./generators.js')

const {
  //genStar,
  genNamedStar,
  genPlanet,
  genStation,
  genStarship
} = randomGenerators(dicts)

const generators = {
  'random-star-name': genNamedStar,
  'random-planet-name': genPlanet,
  'random-station-name': genStation,
  'random-starship-name': genStarship,
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    // path looks like this: /.netlify/functions/random-names/foo
    const generatorKey = event.path.slice(33) // cheapo path segmentation
    const generator = generators[generatorKey]

    if (!generator) return {
      statusCode: 404,
      body: JSON.stringify({ statusCode: 404, body: `Unkown generator "${generatorKey}".` }),
    }

    const name = generator()

    return {
      statusCode: 200,
      body: JSON.stringify({ name }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
