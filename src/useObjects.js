import { reactive, ref, computed } from 'vue'
import {
  MIN_SIZE_STAR,
  MAX_SIZE_STAR,
  MIN_SIZE_PLANET,
  MAX_SIZE_PLANET,
  MIN_DISTANCE_PLANET,
  MAX_DISTANCE_PLANET,
  MIN_AMOUNT_RINGS,
  MAX_AMOUNT_RINGS,
} from './constants'
import { steepCurve } from './utils'
import exampleData from './example-data/sol'

const star = reactive(exampleData.star)
const objects = reactive(exampleData.objects)
const selectedObject = ref(null)
const deletedObject = ref(null) // { index: Number, object: Object }

const starCX = computed(() => {
  const r = star.radius
  return -1 * r * steepCurve(r, 50, 0.955)
})

export default function useObjects () {

  function addObject() {
    const amount = objects.length
    let distance = 100

    if (amount) {
      const lastObject = objects[amount - 1]
      distance = Math.min(MAX_DISTANCE_PLANET, lastObject.distance + 2*lastObject.radius + 10)
    }

    objects.push({
      type: 'planet',
      name: `${star.designation}-${amount + 1}`,
      radius: 1,
      distance,
      satellites: [],
      rings: 0,
    })
  }

  function updateSelectedObject (payload) {
    if (payload.name && !payload.name.trim().length) {
      payload.name = selectedObject.value.designation
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
    for (const key in payload) {
      selectedObject.value[key] = payload[key]
    }
  }

  function deleteObject (object) {
    if (deletedObject.value) {
      const lost = deletedObject.value.object.name
      const confirmed = confirm(`
        Attention! Only the LAST deleted object can be restored.
        ${lost} will be lost forever! Proceed anyway?`
      )
      if (!confirmed) return
    }

    if (!object) object = selectedObject.value
    const index = objects.indexOf(object)

    console.debug('deleting object at index', index)

    if (index >= 0) objects.splice(index, 1)
    if (object === selectedObject.value) selectedObject.value = null

    deletedObject.value = { index, object }
  }

  function restoreDeleted () {
    const { index, object } = deletedObject.value
    console.debug('restoring deleted object', index)
    objects.splice(index, 0, object)
    deletedObject.value = null
  }

  function autoName (object) {
    const index = objects.indexOf(object)
    return `${star.designation}-${index}`
  }

  function randomizeObject (object) {
    console.log('randomize', object)
  }

  function replaceCurrent (preset) {
    const { star: newStar, objects: newObjects } = preset

    Object.keys(star).forEach(key => {
      star[key] = newStar[key]
    })

    objects.length = 0
    newObjects.forEach(object => objects.push(object))
  }

  return {
    star,
    starCX,
    objects,
    selectedObject,
    deletedObject,
    addObject,
    deleteObject,
    updateSelectedObject,
    restoreDeleted,
    randomizeObject,
    autoName,
    replaceCurrent,
  }
}
