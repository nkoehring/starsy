<script setup lang="ts">
import type { Planet } from '../types'
import { ref, computed } from 'vue'
import useObjects from '../useObjects'
// import { getStarColor } from '../utils'

const {
  star,
  starCX,
  primaryBodies,
  selectedObject,
  updateSelectedObject,
} = useObjects()

const draggedObject = ref<null | Planet>(null)
const draggingDelta = ref(0)
let dragStart = 0
// pixelFactor is used to transform screen pixels to SVG units
let pixelFactor = 1.0

// TODO: when releasing the pointer outside of the dragged element, this
//       function is called but somehow doesn't remove the event listener?
const stopDragging = (event: Event) => {
  if (draggedObject.value === null) return // unreachable

  window.removeEventListener('pointermove', updateDelta)
  window.removeEventListener('pointerup', stopDragging)
  event.target?.removeEventListener('pointerup', stopDragging)
  console.debug('stop dragging', draggedObject.value.label)

  const distance = draggedObject.value.distance + draggingDelta.value
  updateSelectedObject({ distance })

  dragStart = 0
  draggingDelta.value = 0
  draggedObject.value = null
}

const updateDelta = (event: PointerEvent) => {
  draggingDelta.value = Math.round((event.clientX - dragStart) * pixelFactor)
}

const startDragging = (event: PointerEvent, object: Planet) => {
  console.debug('start dragging', object.label)
  selectedObject.value = object

  // we can savely assume that the windows width is not changing while dragging
  pixelFactor = 1000 / document.body.offsetWidth
  draggedObject.value = object
  dragStart = event.clientX

  // both window and element listeners are necessary to avoid
  // issues when releasing the cursor outside of the element
  window.addEventListener('pointermove', updateDelta)
  window.addEventListener('pointerup', stopDragging)
  event.target?.addEventListener('pointerup', stopDragging)
}

const resizeObject = (event: WheelEvent) => {
  if (!selectedObject.value) return

  // Only prevent default behaviour when there is a selection,
  // otherwise scrolling will be broken
  event.preventDefault()

  let radius = selectedObject.value.radius
  radius = radius + event.deltaY * -0.01

  if (event.deltaY > 0) radius = Math.floor(radius)
  else radius = Math.ceil(radius)

  updateSelectedObject({ radius })
}
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1000 300">
    <line id="axis" x1="0" y1="150" x2="1000" y2="150" />
    <circle id="star" :r="star.radius" :cx="starCX" cy="150" />

    <g v-for="o in primaryBodies"
      class="object"
      :class="{ selected: o === selectedObject }"
      :id="o.label"
      :style="{ transform: `translateX(${o === draggedObject ? draggingDelta : 0}px)` }"
      @pointerdown.left="startDragging($event, o)"
      @wheel.alt="resizeObject($event)"
      @dragenter.prevent.stop
    >
      <g class="rings" v-for="i in o.rings">
        <circle :r="o.radius - 5 + 2*i" :cx="o.distance" cy="150" />
      </g>

      <text
        :transform="o.radius < 10 ? `rotate(-45, ${o.distance}, ${125 - o.radius})` : ''"
        :x="o.distance"
        :y="140 - o.radius"
      >
        {{ o.label }}
      </text>
      <circle v-if="o.type === 'planet'" :r="o.radius" :cx="o.distance" cy="150" />
      <line v-if="o.satellites.length" :x1="o.distance" y1="150" :x2="o.distance" :y2="150 + o.radius + 10*o.satellites.length" />

      <g class="satellite" v-for="m,i in o.satellites">
        <rect v-if="m.type === 'station'" class="station" :x="o.distance - 2" :y="158 + o.radius + 10*i" width="4" height="4" />
        <circle v-else :r="m.radius" :cx="o.distance" :cy="160 + o.radius + 10*i" />
        <text :x="o.distance + 5" :y="162 + o.radius + 10*i">{{ m.label }}</text>
      </g>

    </g>

    <text id="designation" x="980" y="30">{{ star.designation }}</text>
  </svg>
</template>
