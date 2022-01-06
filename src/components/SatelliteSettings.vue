<template>
  <section class="satellite-list">
    Satellites:
    <div v-for="satellite,index in satellites"
      class="satellite-list-entry"
      :key="satellite.name"
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
        <span class="satellite-name">
          <input type="text"
            :value="satellite.name"
            @keydown.enter="update(index, 'name', $event.target)"
            @blur="update(index, 'name', $event.target)"
          />
        </span>
      </header>
      <div class="options">
        <span class="satellite-type">
          <select
            :value="satellite.type"
            @change="update(index, 'type', $event.target)"
          >
            <option v-for="type in satelliteTypes">{{ type }}</option>
          </select>
        </span>
        <span class="satellite-radius" :class="satellite.type">
          Radius r:
          <input type="range" :min="MIN_SIZE_MOON" :max="MAX_SIZE_MOON"
            :disabled="satellite.type !== 'moon'"
            :value="satellite.radius"
            @input="update(index, 'radius', $event.target, true)"
          />
        </span>
        <span class="actions">
          <button class="move" title="drag to reorder"
            @pointerdown="startDragging(index, $event)"
            @pointerup="stopDragging"
          >&nbsp;</button>
          <button class="delete" title="delete satellite"
            @click="deleteSatellite(index)"
          >&nbsp;</button>
        </span>
      </div>
    </div>
    <button class="add" @click="addSatellite">&nbsp;</button>
  </section>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import {
  MIN_SIZE_MOON,
  MAX_SIZE_MOON,
} from '../constants'

const props = defineProps({
  satellites: Array,
})

const emit = defineEmits([
  'update:satellites'
])

const satelliteTypes = ['moon', 'station']

function isResizable (satellite) {
  return satellite.type === 'moon'
}

function update (index, attr, target, isNumber) {
  const satellites = [...props.satellites]
  let value = target.value
  if (isNumber) value = parseInt(value)

  satellites[index][attr] = value
  emit('update:satellites', satellites)
}

// TODO: auto focus new satellite name input
function addSatellite () {
  const satellites = [...props.satellites]
  satellites.push({
    name: 'unnamed', type: 'moon', radius: 1
  })
  emit('update:satellites', satellites)
}

function deleteSatellite (index) {
  const confirmed = confirm(`Attention! This cannot be undone! Proceed anyway?`)
  if (!confirmed) return

  const satellites = [...props.satellites]
  satellites.splice(index, 1)

  emit('update:satellites', satellites)
}

const dragIndex = ref(null)
const dropIndex = ref(null)

let dragStart = 0
const dragDelta = ref(0)

function updateDelta (event) {
  dragDelta.value = event.clientY - dragStart
}
function onDragEnter (index) {
  if (dragIndex.value !== null && dragIndex.value !== index) dropIndex.value = index
}
function onDragLeave (index) {
  if (index === dropIndex.value) dropIndex.value = null
}
function startDragging (index, event) {
  dragIndex.value = index
  dragStart = event.clientY
  window.addEventListener('pointermove', updateDelta)
  window.addEventListener('pointerup', stopDragging)
}
function stopDragging () {
  window.removeEventListener('pointermove', updateDelta)
  window.removeEventListener('pointerup', stopDragging)

  if (dropIndex !== null) {
    const oldIdx = dragIndex.value
    const newIdx = dropIndex.value
    // move element at oldIdx to newIdx
    const satellites = [...props.satellites]
    satellites.splice(newIdx, 0, satellites.splice(oldIdx, 1)[0])

    emit('update:satellites', satellites)
  }

  dragIndex.value = null
  dropIndex.value = null
}

</script>
