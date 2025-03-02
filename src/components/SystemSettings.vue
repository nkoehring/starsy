<script setup lang="ts">
import useObjects from '../useObjects'
import { MIN_SIZE_STAR, MAX_SIZE_STAR } from '../constants'

const { star } = useObjects()
</script>

<template>
  <header>
    <h1>Star System Parameters</h1>
    <menu id="system-settings">
      <label>
        Name
        <input type="text" v-model="star.designation" />
      </label>
      <label>
        Star Size
        <input type="range"
          :min="MIN_SIZE_STAR"
          :max="MAX_SIZE_STAR"
          v-model.number="star.radius"
        />
        ({{ star.radius }})
      </label>
    </menu>
  </header>
</template>
