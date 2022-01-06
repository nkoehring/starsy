<template>
  <div id="object-settings">
    <Tips>
      <li>You can use the scrollwheel together with the ALT key to resize a planet.</li>
      <li>Drag the <button class="move small" /> button to rearrange satellites.</li>
      <li>Only moons can have a size, station sizes are static.</li>
    </Tips>
    <section class="main">
      <div>
        <input type="text" class="big"
          :value="selectedObject.name"
          @input="update('name', $event.target.value)"
        />
      </div>
      <div>
        Distance Δ:
        <input type="number" :min="MIN_DISTANCE_PLANET" :max="MAX_DISTANCE_PLANET"
          :value="selectedObject.distance"
          @input="update('distance', $event.target.value)"
        />
      </div>
      <div>
        Radius r:
        <input type="number" :min="MIN_SIZE_PLANET" :max="MAX_SIZE_PLANET"
          :value="selectedObject.radius"
          @input="update('radius', $event.target.value)"
        />
      </div>
      <div>
        Rings:
        <input type="number" :min="MIN_AMOUNT_RINGS" :max="MAX_AMOUNT_RINGS"
          :value="selectedObject.rings"
          @input="update('rings', $event.target.value)"
        />
      </div>
      <button class="close" title="close" @click="close">&nbsp;</button>
    </section>

    <SatelliteSettings :satellites="selectedObject.satellites" @update:satellites="update('satellites', $event)" />

    <section class="additional-options">
      Other options:
      <button class="cta danger" @click="deleteObject()">REMOVE OBJECT</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useObjects from '../useObjects'
import Tips from './Tips.vue'
import SatelliteSettings from './SatelliteSettings.vue'

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

const numberTargets = ['distance', 'radius', 'rings']

function update (target, value) {
  console.debug('updating', target, 'with', value)
  if (numberTargets.indexOf(target) >= 0) value = parseInt(value)

  updateSelectedObject({ [target]: value })
}

function close () {
  selectedObject.value = null
}
</script>
