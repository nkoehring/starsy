<template>
  <table id="object-list">
    <tr>
      <th scope="col" v-for="col in columns">{{ col }}</th>
      <th scope="col">actions</th>
    </tr>
    <tr v-for="o,i in objectList" :class="{ selected: o === selectedObject }">
      <td v-for="value in values">
        <div class="cell">{{ o[value] }}</div>
      </td>
      <td><div class="cell">{{ o.satellites.length }}</div></td>
      <td><div class="cell">
        <button class="settings" title="Configure Object" @click="editObject(o)">&nbsp;</button>
        <button class="dice" title="Randomize Object Values" @click="randomizeObject(o)">&nbsp;</button>
        <button class="delete" title="Delete Object" @click="deleteObject(o)">&nbsp;</button>
      </div></td>
      <button v-if="i === deletedObject?.index"
        class="deleted-overlay"
        @click="restoreDeleted"
      >
        RESTORE DELETED OBJECT
      </button>
    </tr>
    <button class="add" title="Add New Object" @click="addObject">&nbsp;</button>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import useObjects from '../useObjects'

const {
  objects,
  selectedObject,
  deletedObject,
  addObject,
  deleteObject,
  restoreDeleted,
  randomizeObject,
} = useObjects()

const columns = ['Δ', 'Name', 'Type', 'Radius', 'Rings', 'Satellites']
const values = ['distance', 'name', 'type', 'radius', 'rings']
const objectList = computed(() => {
  if (!deletedObject.value) return objects

  const { index, object } = deletedObject.value
  const objects_ = [ ...objects ]
  objects_.splice(index, 0, object)
  return objects_
})

function editObject (object) {
  if (object) {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
  selectedObject.value = object
}

</script>
