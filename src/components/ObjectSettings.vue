<template>
  <div class="object-settings">
    <header>
      <h2><input type="text" v-model="name" @blur="checkName"/></h2>
      <p>
        Distance Δ:
        <input type="number" min="50" max="1000" v-model="distance" />
      </p>
      <p>
        Radius r:
        <input type="number" min="1" max="125" v-model="radius" />
      </p>
      <p>
        Rings:
        <input type="number" min="0" max="15" v-model="rings" />
      </p>
    </header>
    <div class="satellite-list">
      Satellites:
      <button class="satellite" v-for="satellite in satellites">
        {{ satellite.name }}
        <template v-if="satellite.type">({{ satellite.type }})</template>
      </button>
      <button class="add">&nbsp;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  object: Object,
})
const emit = defineEmits([
  'update:object',
])

const tipsShown = ref(true)

const distance = ref(props.object.distance)
const name = ref(props.object.name)
const type = ref(props.object.type)
const radius = ref(props.object.radius)
const rings = ref(props.object.rings)
const satellites = ref(props.object.satellites)

const satellitesList = computed(() => {
  if (!satellites.value || !satellites.value.length) return 'none'
  return satellites.value.reduce((acc, satellite) => {
    let s = satellite.name
    if (satellite.type) s += ` (${satellite.type})`
    acc.push(s)
    return acc
  }, []).join(', ')
})

function update (target, value) {
  if (target === 'radius') value = parseInt(value)
  emit(`update:${target}`, value)
}
</script>
