<template>
  <g class="planetary">
  </g>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  name: String,
  size: Number,
  type: String,  // TODO
  moons: Object, // moons: { name, size as fraction of planet size }
})
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
