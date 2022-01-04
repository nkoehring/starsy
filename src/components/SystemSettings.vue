<template>
  <header>
    <h1>Star System Parameters</h1>
    <menu id="system-settings">
      <label>
        Name
        <input type="text"
          :value="designation"
          @input="update('designation', $event.target.value)"
        />
      </label>
      <label>
        Star Size
        <input type="range"
          :min="MIN_SIZE_STAR"
          :max="MAX_SIZE_STAR"
          :value="radius"
          @input="update('radius', $event.target.value)"
        />
        ({{ radius }})
      </label>
    </menu>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  MIN_SIZE_STAR,
  MAX_SIZE_STAR,
} from '../constants'

const props = defineProps({
  designation: String,
  radius: Number,
})
const emit = defineEmits([
  'update:designation',
  'update:radius',
])

function update (target, value) {
  if (target === 'radius') value = parseInt(value)
  emit(`update:${target}`, value)
}
</script>
