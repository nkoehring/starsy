<script setup lang="ts">
import { ref, computed } from 'vue'
import useObjects from '../useObjects'
import Tips from './Tips.vue'
import SatelliteSettings from './SatelliteSettings.vue'
import type { Planet } from '../types'

import {
  MIN_SIZE_PLANET,
  MAX_SIZE_PLANET,
  MIN_DISTANCE_PLANET,
  MAX_DISTANCE_PLANET,
  MIN_AMOUNT_RINGS,
  MAX_AMOUNT_RINGS,
} from '../constants'

const {
  selectedObject,
  deleteObject,
  updateSelectedObject,
} = useObjects()

const update = (attr: keyof Planet, event: Event) => {
  const target = event.target as HTMLInputElement
  updateSelectedObject({ [attr]: target.value })
}
const close = () => {
  selectedObject.value = null
}
</script>

<template>
  <div id="object-settings" v-if="selectedObject">
    <Tips>
      <li>You can use the scrollwheel together with the ALT key to resize a planet.</li>
      <li>Drag the <button class="move small action" /> button to rearrange satellites.</li>
      <li>Only moons can have a size, station sizes are static.</li>
    </Tips>
    <section class="main">
      <div>
        <input type="text" class="big"
          :value="selectedObject.label"
          @input="update('label', $event)"
        />
      </div>
      <div>
        Distance Δ:
        <input type="number" :min="MIN_DISTANCE_PLANET" :max="MAX_DISTANCE_PLANET"
          :value="selectedObject.distance"
          @input="update('distance', $event)"
        />
      </div>
      <div>
        Radius r:
        <input type="number" :min="MIN_SIZE_PLANET" :max="MAX_SIZE_PLANET"
          :value="selectedObject.radius"
          @input="update('radius', $event)"
        />
      </div>
      <div>
        Rings:
        <input type="number" :min="MIN_AMOUNT_RINGS" :max="MAX_AMOUNT_RINGS"
          :value="selectedObject.rings"
          @input="update('rings', $event)"
        />
      </div>
      <button class="close action" title="close" @click="close">&nbsp;</button>
    </section>

    <SatelliteSettings v-model="selectedObject.satellites" />

    <section class="additional-options">
      Other options:
      <button class="cta danger" @click="deleteObject()">REMOVE OBJECT</button>
    </section>
  </div>
</template>
