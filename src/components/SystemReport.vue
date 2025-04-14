<script setup lang="ts">
import type { Star, Planet } from '../types'
import { computed } from 'vue'

export interface Props {
  star: Star
  primaryBodies: Planet[]
}
const props = defineProps<Props>()

const secondaryBodiesAmount = computed(() => {
  return props.primaryBodies.reduce((acc, planet) => {
    return acc + planet.satellites.length
  }, 0)
})
</script>

<template>
  <header>
    <h1>{{ star.designation }}</h1>

    <div class="primary-bodies">
      Primary Bodies: {{ primaryBodies.length }}
    </div>
    <div class="secondary-bodies">
      Secondary Bodies and Stations: {{ secondaryBodiesAmount }}
    </div>
  </header>

  <div>
    This section is not yet implemented, but will allow to add meta data to the system and every object in there.
    The goal is to be able to use the print function to print a system report style page. Please stay tuned!
  </div>
</template>

<style scoped>
header {
  margin: 2em 0;
}
</style>
