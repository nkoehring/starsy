export interface Star {
  designation: string
  radius: number
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
