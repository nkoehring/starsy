<script setup lang="ts">
import type { Satellite } from '../types'
import { nextTick, ref } from 'vue'
import {
  MIN_SIZE_MOON,
  MAX_SIZE_MOON,
} from '../constants'
import { copyProperties } from '../utils'

const satellites = defineModel<Satellite[]>({ required: true })
const satelliteTypes = ['moon', 'station']

function isResizable(satellite: Satellite) {
  return satellite.type === 'moon'
}

const update = (index: number, attr: keyof Satellite, event: Event, isNumber = false): void => {
  const target = event.target as HTMLInputElement | undefined
  if (!target) return

  const value = isNumber ? parseInt(target.value) : target.value
  const satellite = { ...satellites.value[index], [attr]: value }
  satellites.value[index] = satellite
}

// TODO: auto focus new satellite label input
const addSatellite = (): void => {
  satellites.value.push({ label: 'Unnamed', type: 'moon', radius: 1 })
}

const deleteSatellite = (index: number): void => {
  const confirmed = confirm(`Attention! This cannot be undone! Proceed anyway?`)
  if (!confirmed) return

  satellites.value.splice(index, 1)
}

const dragIndex = ref(-1)
const dropIndex = ref(-1)

let dragStart = 0
const dragDelta = ref(0)

const updateDelta = (event: PointerEvent): void => {
  dragDelta.value = event.clientY - dragStart
}
const onDragEnter = (index: number): void => {
  if (dragIndex.value === -1 || dragIndex.value === index) return
  dropIndex.value = index
}
const onDragLeave = (index: number): void => {
  if (index !== dropIndex.value) return
  dropIndex.value = -1
}
const startDragging = (index: number, event: PointerEvent): void => {
  if (satellites.value.length < 2) return
  dragIndex.value = index
  dragStart = event.clientY
  window.addEventListener('pointermove', updateDelta)
  window.addEventListener('pointerup', stopDragging)
}
const stopDragging = (): void => {
  window.removeEventListener('pointermove', updateDelta)
  window.removeEventListener('pointerup', stopDragging)

  if (dropIndex.value !== -1) {
    const oldIdx = dragIndex.value
    const newIdx = dropIndex.value
    // move element at oldIdx to newIdx
    satellites.value.splice(newIdx, 0, satellites.value.splice(oldIdx, 1)[0])
  }

  dragIndex.value = -1
  dropIndex.value = -1
}

</script>

<template>
  <section class="satellite-list">
    Satellites:
    <div v-for="satellite,index in satellites"
      class="satellite-list-entry"
      :key="satellite.label"
      :class="{
        dragging: dragIndex === index,
        dragunder: dropIndex === index && dragIndex < index,
        dragover: dropIndex === index && dragIndex > index
      }"
      :style="dragIndex === index ? `transform: translateY(${dragDelta}px)` : ''"
      @pointerenter="onDragEnter(index)"
      @pointerleave="onDragLeave(index)"
    >
      <header>
        <span class="satellite-label">
          <input type="text"
            :value="satellite.label"
            @keydown.enter="update(index, 'label', $event)"
            @blur="update(index, 'label', $event)"
          />
        </span>
      </header>
      <div class="options">
        <span class="satellite-type">
          <select
            :value="satellite.type"
            @change="update(index, 'type', $event)"
          >
            <option v-for="type in satelliteTypes">{{ type }}</option>
          </select>
        </span>
        <span class="satellite-radius" :class="satellite.type">
          Radius r:
          <input type="range" :min="MIN_SIZE_MOON" :max="MAX_SIZE_MOON"
            :disabled="satellite.type !== 'moon'"
            :value="satellite.radius"
            @input="update(index, 'radius', $event, true)"
          />
        </span>
        <span class="actions">
          <button class="move action" title="drag to reorder" :disabled="satellites.length < 2"
            @pointerdown="startDragging(index, $event)"
            @pointerup="stopDragging"
          >&nbsp;</button>

          <button class="delete action" title="delete satellite"
            @click="deleteSatellite(index)"
          >&nbsp;</button>
        </span>
      </div>
    </div>
    <button class="add action" @click="addSatellite">&nbsp;</button>
  </section>
</template>
