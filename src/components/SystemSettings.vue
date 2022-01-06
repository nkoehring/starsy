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
          :value="star.radius"
          @input="updateRadius($event.target.value)"
        />
        ({{ star.radius }})
      </label>
    </menu>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import useObjects from '../useObjects'
import {
  MIN_SIZE_STAR,
  MAX_SIZE_STAR,
} from '../constants'

const { star } = useObjects()

function updateRadius (radius) {
  star.radius = parseInt(radius)
}
</script>
