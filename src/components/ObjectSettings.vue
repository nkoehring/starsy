<template>
  <div id="object-settings">
    <section class="main">
      <div>
        <input type="text" class="big"
          :value="name"
          @input="checkName($event.target.value)"
        />
      </div>
      <div>
        Distance Δ:
        <input type="number" :min="MIN_DISTANCE_PLANET" :max="MAX_DISTANCE_PLANET"
          :value="distance"
          @input="update('distance', $event.target.value)"
        />
      </div>
      <div>
        Radius r:
        <input type="number" :min="MIN_SIZE_PLANET" :max="MAX_SIZE_PLANET"
          :value="radius"
          @input="update('radius', $event.target.value)"
        />
      </div>
      <div>
        Rings:
        <input type="number" :min="MIN_AMOUNT_RINGS" :max="MAX_AMOUNT_RINGS"
          :value="rings"
          @input="update('rings', $event.target.value)"
        />
      </div>
      <button class="close" title="close" @click="$emit('close')">&nbsp;</button>
    </section>
    <section class="satellite-list">
      Satellites:
      <button class="cta" v-for="satellite in satellites">
        {{ satellite.name }}
        <template v-if="satellite.type">({{ satellite.type }})</template>
      </button>
      <button class="add">&nbsp;</button>
    </section>
    <section class="additional-options">
      Other options:
      <button class="cta danger" @click="$emit('delete')">REMOVE OBJECT</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  MIN_SIZE_STAR,
  MAX_SIZE_STAR,
  MIN_SIZE_PLANET,
  MAX_SIZE_PLANET,
  MIN_DISTANCE_PLANET,
  MAX_DISTANCE_PLANET,
  MIN_AMOUNT_RINGS,
  MAX_AMOUNT_RINGS,
} from '../constants'

const props = defineProps({
  distance: Number,
  name: String,
  type: String,
  radius: Number,
  rings: Number,
  satellites: Array,
  autoName: String, // auto generated name, like Sol-3
})
const emit = defineEmits([
  'update:distance',
  'update:name',
  'update:type',
  'update:radius',
  'update:rings',
  'update:satellites',
  'delete',
  'close',
])

const satellitesList = computed(() => {
  if (!satellites.value || !satellites.value.length) return 'none'
  return satellites.value.reduce((acc, satellite) => {
    let s = satellite.name
    if (satellite.type) s += ` (${satellite.type})`
    acc.push(s)
    return acc
  }, []).join(', ')
})

const numberTargets = ['distance', 'radius', 'rings']

function update (target, value) {
  console.debug('updating', target, 'with', value)
  if (numberTargets.indexOf(target) >= 0) value = parseInt(value)
  emit(`update:${target}`, value)
}

function checkName (name) {
  if (!name.trim().length) name = props.autoName
  update('name', name)
}
</script>
