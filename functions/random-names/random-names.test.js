const { handler } = require('./random-names.js')

function generateEvent (path) {
  // see https://docs.netlify.com/functions/build-with-javascript/#format
  return {
    path: `/.netlify/functions/random-names/${path}`,
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: {},
    body: null,
    isBase64Encoded: false,
  }
}

(function test () {
  const events = {
    randomStarName: generateEvent('random-star-name'),
    randomPlanetName: generateEvent('random-planet-name'),
    randomStationName: generateEvent('random-station-name'),
    randomStarshipName: generateEvent('random-starship-name'),
  }

  Object.keys(events).map(async (key) => {
    const event = events[key]
    const result = await handler(event)
    console.log(key, result.statusCode, result.body)
  })
}())
