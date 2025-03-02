<script setup lang="ts">
import { computed } from 'vue'
import useObjects from '../useObjects'
import type { Planet } from '../types'

const {
  primaryBodies,
  selectedObject,
  deletedObject,
  addObject,
  deleteObject,
  restoreDeleted,
  randomizeObject,
} = useObjects()

const columns = ['Δ', 'Label', 'Type', 'Radius', 'Rings', 'Satellites'] as const
const values = ['distance', 'label', 'type', 'radius', 'rings'] as Array<keyof Planet>

const objectList = computed(() => {
  if (!deletedObject.value) return primaryBodies

  const { index, object } = deletedObject.value
  const bodies = [ ...primaryBodies ]
  bodies.splice(index, 0, object)
  return bodies
})

function editObject(object: Planet) {
  selectedObject.value = object
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

</script>

<template>
  <table id="object-list">
    <thead>
      <tr>
        <th scope="col" v-for="col in columns">{{ col }}</th>
        <th scope="col">actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="o,i in objectList" :class="{ selected: o === selectedObject }">
        <td v-for="value in values">
          <div class="cell">{{ o[value] }}</div>
        </td>
        <td><div class="cell">{{ o.satellites.length }}</div></td>
        <td><div class="cell">
          <button class="settings action" title="Configure Object" @click="editObject(o)">&nbsp;</button>
          <button class="dice action" disabled title="Randomization is coming soon!" @click="randomizeObject(o)">&nbsp;</button>
          <button class="delete action" title="Delete Object" @click="deleteObject(o)">&nbsp;</button>
        </div></td>
        <button v-if="i === deletedObject?.index"
          class="deleted-overlay"
          @click="restoreDeleted"
        >
          RESTORE DELETED OBJECT
        </button>
      </tr>
      <tr>
        <td>
          <button class="add action" title="Add New Object" @click="addObject">&nbsp;</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
