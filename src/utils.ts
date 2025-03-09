import {
  OldPreset,
  StarSystem,
  IntermediaryPlanet,
  IntermediarySatellite,
  Planet,
  Satellite,
} from "./types"
import { MIN_SIZE_STAR, MAX_SIZE_STAR } from './constants'

/** Function to return a steep curve from [minX,0] to [infinity,maxY]
 *
 * inc is tuned for x-values between minX and minX+100 describing a gentle curve
 * towards maxY that flattens very quickly afterwards.
 * Thank you Ingo for your tremendous help with this one.
 */
export function steepCurve(x: number, minX: number, maxY: number, inc=0.01): number {
  // f(x) = maxY * (1 - e^(-(inc*x)+minX*inc))
  return maxY * (1 - Math.E ** (-(inc*x) + minX*inc))
}

/* throttle function calls by duration */
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
/** copy all properties from one object to a new one */
export function copyProperties<T extends object>(source: T, target: T) {
  for (const key in source) target[key] = source[key]
}

/** Check if a preset is in the old format */
export function hasOldPresetFormat(preset: StarSystem | OldPreset): preset is OldPreset {
  return ('objects' in preset)
}

/** update an old preset to the new preset format */
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

const sizeDelta = MAX_SIZE_STAR - MIN_SIZE_STAR

const starColorStops = [
  { size: MIN_SIZE_STAR, rgb: [136, 85, 0] },
  { size: MIN_SIZE_STAR + sizeDelta * 0.1, rgb: [255, 140, 0] },
  { size: MIN_SIZE_STAR + sizeDelta * 0.25, rgb: [255, 255, 136] },
  { size: MIN_SIZE_STAR + sizeDelta * 0.45, rgb: [248, 248, 255] },
  { size: MAX_SIZE_STAR, rgb: [102, 153, 238] },
]

/**
 * Calculate the star's colour based on its size
 * from small dark red to huge bright blue stars
 */
export function getStarColor(size: number) {
  let factor = 1
  let rgb1 = starColorStops[0].rgb
  let rgb2 = starColorStops[0].rgb

  for (let i = 0; i < starColorStops.length; i++) {
    const s1 = starColorStops[i].size
    const s2 = starColorStops[i+1].size
    if (size >= s1 && size <= s2) {
      factor = (size - s1) / (s2 - s1)
      rgb1 = starColorStops[i].rgb
      rgb2 = starColorStops[i+1].rgb
      break
    }
  }

  const [r1, g1, b1] = rgb1
  const [r2, g2, b2] = rgb2
  const r = Math.round(r1 + factor * (r2 - r1)).toString(16).padStart(2, '0')
  const g = Math.round(g1 + factor * (g2 - g1)).toString(16).padStart(2, '0')
  const b = Math.round(b1 + factor * (b2 - b1)).toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}
