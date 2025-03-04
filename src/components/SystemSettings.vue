<script setup lang="ts">
import { computed } from 'vue'
import useObjects from '../useObjects'
import { MIN_SIZE_STAR as min, MAX_SIZE_STAR as max } from '../constants'

const { star } = useObjects()
</script>

<template>
  <header>
    <h1>Star System Parameters</h1>
    <menu id="system-settings">
      <li>
        <label>Name</label>
        <input type="text" v-model="star.designation" />
      </li>
      <li>
        <label>Star Size</label>
        <input type="range" :min :max v-model.number="star.radius" />
        <input type="number" :min :max v-model.number="star.radius">
      </li>
    </menu>
  </header>
</template>
