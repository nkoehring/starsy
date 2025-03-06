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

/** The star data, initialized with example data */
const star = reactive(exampleData.star)
/** Array of primary celestial bodies, initialized with example data */
const primaryBodies = reactive(exampleData.primaryBodies)
/** Currently selected primary celestial body, or null when nothing is selected */
const selectedObject = ref<null | Planet>(null)
/** Most recently deleted object with original index, used for undo functionality */
const deletedObject = ref<null | { index: number, object: Planet}>(null)

/** Computed property that calculates the x-coord center offset for the star,
  * using a steep curve function to scale the offset based on radius, so that
  * the overall width of the visible part stays roughly the same.
  */
const starCX = computed(() => {
  const r = star.radius
  return -1 * r * steepCurve(r, 50, 0.955)
})

/**
 * Composable for managing celestial objects in a star system
 * 
 * @returns Object containing:
 *  - star: Reactive reference to the central star
 *  - starCX: Computed x-coordinate center of the star
 *  - primaryBodies: Reactive array of primary celestial bodies
 *  - selectedObject: Reference to the currently selected object
 *  - deletedObject: Reference to the most recently deleted object for undo
 *  - addObject: Function to add a new primary celestial body
 *  - deleteObject: Function to remove a celestial body
 *  - updateSelectedObject: Function to update properties of the selected object
 *  - restoreDeleted: Function to restore the most recently deleted object
 *  - randomizeObject: Function to randomize an object's properties
 *  - autoLabel: Function to generate a designation based on position
 *  - replaceCurrent: Function to replace the current system with a new one
 */
export default function useObjects() {

  /**
   * Adds a new primary celestial body to the system
   * Places it at a reasonable distance from the last body if any exist
   */
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

  /**
   * Updates properties of the selected object with validation
   * @param payload - Object containing the properties to update
   */
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

  /**
   * Deletes a celestial body from the system
   * Prompts for confirmation if a previously deleted object exists
   * @param object - Optional planet to delete; uses selectedObject if not provided
   */
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

  /**
   * Restores the most recently deleted object to its original position
   * Does nothing if no object has been marked for deletion
   */
  function restoreDeleted() {
    if (deletedObject.value === null) return

    const { index, object } = deletedObject.value
    console.debug('restoring deleted object', index)

    primaryBodies.splice(index, 0, object)
    deletedObject.value = null
  }

  /**
   * Generates an automatic label for a planet based on its position in the system
   * @param object - The planet to generate a label for
   * @returns A designation string combining star designation and planet index
   */
  function autoLabel(object: Planet) {
    const index = primaryBodies.indexOf(object)
    return `${star.designation}-${index}`
  }

  /**
   * Randomizes the properties of a celestial body
   * (implementation placeholder)
   * @param object - The planet to randomize
   */
  function randomizeObject(object: Planet) {
    console.log('randomize', object)
  }

  /**
   * Replaces the current star system with a new one
   * @param preset - The star system data to use as replacement
   */
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
