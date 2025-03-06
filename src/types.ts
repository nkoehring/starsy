type HexColor = `#${string}`

export interface StarsyTheme {
  label: string
  font: string // name (...or URL to font file?)
  bgApp: HexColor
  fgApp: HexColor
  bgGraphic: HexColor // system diagram background
  fgGraphic: HexColor // system diagram foreground
  hlGraphic: HexColor // system diagram highlight
  fillStar: 'auto' | HexColor
  fgDanger: HexColor
  isBright: boolean
  system: boolean
}

export interface StarsySettings {
  storedThemes: StarsyTheme[]
  currentTheme: StarsyTheme
}

export interface Star {
  designation: string
  radius: number
  // for future use
  color?: 'auto' | HexColor
}

export interface Satellite {
  type: 'station' | 'moon'
  label: string
  radius: number
}

export interface Planet {
  type: 'planet'
  satellites: Satellite[]
  rings: number
  designation: string
  distance: number
  label: string
  radius: number
}

export interface StarSystem {
  star: Star
  primaryBodies: Planet[]
}

export interface OldSatellite extends Omit<Satellite, 'label'> {
  name: string
}
export interface IntermediarySatellite extends Satellite {
  name?: string
}
export interface OldPlanet extends Omit<Planet, 'label' | 'satellites'> {
  name: string
  satellites: OldSatellite[]
}
export interface IntermediaryPlanet extends Planet {
  name?: string
}

export interface OldPreset {
  star: Star
  objects: OldPlanet[]
}

export interface LabeledValue<T = string> {
  label: string
  value: T
}
