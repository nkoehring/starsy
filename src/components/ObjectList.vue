<template>
  <table id="object-list">
    <tr>
      <th scope="col" v-for="col in columns">{{ col }}</th>
      <th scope="col">actions</th>
    </tr>
    <tr :class="{ deleted: i === deletedObject?.index }" v-for="o,i in objectList">
      <td v-for="value in values">
        <div class="cell">{{ o[value] }}</div>
      </td>
      <td><div class="cell">{{ o.satellites.length }}</div></td>
      <td><div class="cell">
        <button class="settings" @click="editObject(o)">&nbsp;</button>
        <button class="delete" @click="deleteObject(o)">&nbsp;</button>
      </div></td>
      <button v-if="i === deletedObject?.index"
        class="deleted-overlay"
        @click="restoreDeleted"
      >
        RESTORE DELETED OBJECT
      </button>
    </tr>
  </table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  objects: Array,
  deletedObject: [Object, null],
  editObject: Function,
  deleteObject: Function,
  restoreDeleted: Function,
})

const columns = ['Δ', 'Name', 'Type', 'Radius', 'Rings', 'Satellites']
const values = ['distance', 'name', 'type', 'radius', 'rings']
const objectList = computed(() => {
  if (!props.deletedObject) return props.objects

  const { index, object } = props.deletedObject
  const objects = [ ...props.objects ]
  objects.splice(index, 0, object)
  return objects
})
</script>
