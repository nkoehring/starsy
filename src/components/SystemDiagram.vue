<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1000 300">
    <line id="axis" x1="0" y1="150" x2="1000" y2="150" />
    <circle id="star" :r="star.radius" :cx="starCX" cy="150" />

    <g v-for="o in objects"
      class="object"
      :class="{ selected: o === selectedObject }"
      :id="o.name"
      @mousedown.left="startDragging(o)"
      @mouseup.left="stopDragging"
    >
      <g class="rings" v-for="i in o.rings">
        <circle :r="o.radius - 5 + 2*i" :cx="o.distance" cy="150" />
      </g>

      <text :class="{ tilted: o.radius < 10 }" :x="o.distance" :y="140 - o.radius">{{ o.name }}</text>
      <circle v-if="o.type === 'planet'" :r="o.radius" :cx="o.distance" cy="150" />
      <line v-if="o.satellites.length" :x1="o.distance" y1="150" :x2="o.distance" :y2="150 + o.radius + 10*o.satellites.length" />

      <g class="satellite" v-for="m,i in o.satellites">
        <rect v-if="m.type === 'station'" class="station" :x="o.distance - 2" :y="158 + o.radius + 10*i" width="4" height="4" />
        <circle v-else :r="m.radius" :cx="o.distance" :cy="160 + o.radius + 10*i" />
        <text :x="o.distance + 5" :y="162 + o.radius + 10*i">{{ m.name }}</text>
      </g>

    </g>

    <text id="designation" x="980" y="30">{{ star.designation }}</text>
  </svg>
</template>

<script setup>
import { ref, computed } from 'vue'
import steepCurve from '../steep-curve'

const props = defineProps({
  star: Object,
  objects: Array,
  selectedObject: Object,
})

const emit = defineEmits([ 'select' ])

const starCX = computed(() => {
  const r = props.star.radius
  return -1 * r * steepCurve(r, 50, 0.955)
})

const draggedObject = ref(null)

function startDragging (object) {
  emit('select', object)
  draggedObject.value = object
}
function stopDragging () {
  draggedObject.value = null
}

</script>
