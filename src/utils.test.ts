import { describe, it, expect } from 'vitest'
import { hasOldPresetFormat, updateOldPreset } from './utils'
import type { OldPreset, StarSystem } from './types'

const oldPresetWithoutPlanets: OldPreset = {
  star: {
    designation: 'Test Star',
    radius: 400,
  },
  objects: [],
}
const oldPreset: OldPreset = {
  star: {
    designation: 'Test Star',
    radius: 400,
  },
  objects: [{
    type: 'planet',
    rings: 0,
    designation: 'test-star-1',
    distance: 100,
    name: 'Test Planet A',
    radius: 23,
    satellites: [],
  },{
    type: 'planet',
    rings: 1,
    designation: 'test-star-2',
    distance: 200,
    name: 'Test Planet B',
    radius: 42,
    satellites: [{
      type: 'moon',
      name: 'Moon',
      radius: 3,
    }, {
      type: 'station',
      name: 'Station',
      radius: 1,
    }],
  }],
}

const newPreset: StarSystem = {
  star: {
    designation: 'Test Star',
    radius: 400,
  },
  primaryBodies: [{
    type: 'planet',
    rings: 0,
    designation: 'test-star-1',
    distance: 100,
    label: 'Test Planet A',
    radius: 23,
    satellites: [],
  },{
    type: 'planet',
    rings: 1,
    designation: 'test-star-2',
    distance: 200,
    label: 'Test Planet B',
    radius: 42,
    satellites: [{
      type: 'moon',
      label: 'Moon',
      radius: 3,
    }, {
      type: 'station',
      label: 'Station',
      radius: 1,
    }],
  }],
}

describe('hasOldPresetFormat', () => {
  it('recognizes old preset format', () => {
    const output = hasOldPresetFormat(oldPreset)
    expect(output).toBe(true)
  })
  it('recognizes new preset format', () => {
    const output = hasOldPresetFormat(newPreset)
    expect(output).toBe(false)
  })
})

describe('updateOldPreset', () => {
  it('does not change object in place', () => {
    const _result = updateOldPreset(oldPreset)
    expect(oldPreset).toHaveProperty('objects')
    expect(oldPreset).not.toHaveProperty('primaryBodies')
  })
  it('transforms from old to new format', () => {
    const result = updateOldPreset(oldPreset)
    expect(result).not.toHaveProperty('objects')
    expect(result).toHaveProperty('primaryBodies')
    expect(result.primaryBodies[0]).toHaveProperty('label')
    expect(result.primaryBodies[0]).not.toHaveProperty('name')
    expect(result.primaryBodies[1]).toHaveProperty('label')
    expect(result.primaryBodies[1]).not.toHaveProperty('name')
    expect(result.primaryBodies[1].satellites[0]).toHaveProperty('label')
    expect(result.primaryBodies[1].satellites[0]).not.toHaveProperty('name')
    expect(result.primaryBodies[1].satellites[1]).toHaveProperty('label')
    expect(result.primaryBodies[1].satellites[1]).not.toHaveProperty('name')
  })
})
