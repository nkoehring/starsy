import {
  OldPreset,
  StarSystem,
  IntermediaryPlanet,
  IntermediarySatellite,
  Planet,
  Satellite,
} from "./types"

/* This function returns a steep curve from [minX,0] to [infinity,maxY]
 *
 * inc is tuned for x-values between minX and minX+100 describing a gentle curve
 * towards maxY that flattens very quickly afterwards.
 * Thank you Ingo for your tremendous help with this one.
 */
export function steepCurve(x: number, minX: number, maxY: number, inc=0.01): number {
  // f(x) = maxY * (1 - e^(-(inc*x)+minX*inc))
  return maxY * (1 - Math.E ** (-(inc*x) + minX*inc))
}

/* throttle function calls */
export function throttle(func: (...args: any[]) => void, duration: number): (...args: any[]) => void {
  let waiting = false
  return (...args) => {
    if (!waiting) {
      func.apply({}, args)
      waiting = true
      setTimeout(() => {
        waiting = false
      }, duration)
    }
  }
}

// this is mainly to convince Typescript, because it doesn't work directly
// see https://www.totaltypescript.com/iterate-over-object-keys-in-typescript#solution-3-generic-functions
export function copyProperties<T extends object>(source: T, target: T) {
  for (const key in source) target[key] = source[key]
}

export function hasOldPresetFormat(preset: StarSystem | OldPreset): preset is OldPreset {
  return ('objects' in preset)
}

export function updateOldPreset(preset: OldPreset): StarSystem {
  return {
    star: preset.star,
    primaryBodies: preset.objects.map(planet => {
      const newPlanet: IntermediaryPlanet = {
        ...planet,
        label: planet.name,
        satellites: planet.satellites.map(satellite => {
          const newSatellite: IntermediarySatellite = {
            ...satellite,
            label: satellite.name
          }
          delete newSatellite.name
          return newSatellite as Satellite
        })
      }
      delete newPlanet.name
      return newPlanet as Planet
    })
  }
}
