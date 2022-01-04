<template>
  <header>
    <h1>Star System Parameters</h1>
    <menu id="system-settings">
      <label>
        Name
        <input type="text" :value="designation" @input="update('designation', $event.target.value)" />
      </label>
      <label>
        Star Size
        <input type="range" min="50" max="1500" :value="radius" @input="update('radius', $event.target.value)" />
        ({{ radius }})
      </label>
    </menu>
  </header>
</template>

<script setup>
import { ref } from 'vue'

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
