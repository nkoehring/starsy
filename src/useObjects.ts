import type { Planet, Satellite, StarSystem } from './types'
import { reactive, ref, computed } from 'vue'
import {
  MIN_SIZE_PLANET,
  MAX_SIZE_PLANET,
  MIN_DISTANCE_PLANET,
  MAX_DISTANCE_PLANET,
  MIN_AMOUNT_RINGS,
  MAX_AMOUNT_RINGS,
} from './constants'
import { steepCurve, copyProperties } from './utils'
import exampleData from './example-data/sol'

const star = reactive(exampleData.star)
const primaryBodies = reactive(exampleData.primaryBodies)
const selectedObject = ref<null | Planet>(null)
const deletedObject = ref<null | { index: number, object: Planet}>(null)

const starCX = computed(() => {
  const r = star.radius
  return -1 * r * steepCurve(r, 50, 0.955)
})

export default function useObjects() {

  function addObject() {
    const amount = primaryBodies.length
    let distance = 100

    if (amount) {
      const lastObject = primaryBodies[amount - 1]
      distance = Math.min(MAX_DISTANCE_PLANET, lastObject.distance + 2*lastObject.radius + 10)
    }

    const designation = `${star.designation}-${amount + 1}`

    primaryBodies.push({
      type: 'planet',
      label: designation,
      designation,
      radius: 1,
      distance,
      satellites: [] as Satellite[],
      rings: 0,
    })
  }

  function updateSelectedObject(payload: Partial<Planet>) {
    if (payload.label && !payload.label.trim().length && selectedObject.value) {
      payload.label = selectedObject.value.designation
    }
    if (payload.distance) {
      payload.distance = Math.max(MIN_DISTANCE_PLANET, payload.distance)
      payload.distance = Math.min(MAX_DISTANCE_PLANET, payload.distance)
    }
    if (payload.radius) {
      payload.radius = Math.max(MIN_SIZE_PLANET, payload.radius)
      payload.radius = Math.min(MAX_SIZE_PLANET, payload.radius)
    }
    if (payload.rings) {
      payload.rings = Math.max(MIN_AMOUNT_RINGS, payload.rings)
      payload.rings = Math.min(MAX_AMOUNT_RINGS, payload.rings)
    }

    if (selectedObject.value) copyProperties(payload, selectedObject.value)
  }

  function deleteObject(object?: Planet) {
    if (!object && !selectedObject.value) return

    if (deletedObject.value !== null) {
      const lost = deletedObject.value.object.label
      const confirmed = confirm(`
        Attention! Only the LAST deleted object can be restored.
        ${lost} will be lost forever! Proceed anyway?`
      )
      if (!confirmed) return
    }

    const selection = object ?? selectedObject.value
    if (!selection) return

    const index = primaryBodies.indexOf(selection)
    console.debug('deleting object at index', index)

    primaryBodies.splice(index, 1)
    if (selection === selectedObject.value) selectedObject.value = null

    deletedObject.value = { index, object: selection }
  }

  function restoreDeleted() {
    if (deletedObject.value === null) return

    const { index, object } = deletedObject.value
    console.debug('restoring deleted object', index)

    primaryBodies.splice(index, 0, object)
    deletedObject.value = null
  }

  function autoLabel(object: Planet) {
    const index = primaryBodies.indexOf(object)
    return `${star.designation}-${index}`
  }

  function randomizeObject(object: Planet) {
    console.log('randomize', object)
  }

  function replaceCurrent(preset: StarSystem) {
    const { star: newStar, primaryBodies: newObjects } = preset

    star.radius = newStar.radius
    star.designation = newStar.designation
    primaryBodies.length = 0
    newObjects.forEach(object => primaryBodies.push(object))
  }

  return {
    star,
    starCX,
    primaryBodies,
    selectedObject,
    deletedObject,
    addObject,
    deleteObject,
    updateSelectedObject,
    restoreDeleted,
    randomizeObject,
    autoLabel,
    replaceCurrent,
  }
}
