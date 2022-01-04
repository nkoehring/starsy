<template>
  <table id="object-list">
    <tr>
      <th scope="col" v-for="col in columns">{{ col }}</th>
      <th scope="col">actions</th>
    </tr>
    <tr v-for="o in objects">
      <td v-for="value in values">
        <div class="cell">{{ o[value] }}</div>
      </td>
      <td><div class="cell">{{ o.satellites.length }}</div></td>
      <td><div class="cell">
        <button class="settings" @click="editObject(o)">&nbsp;</button>
        <button class="delete" @click="deleteObject(o)">&nbsp;</button>
      </div></td>
    </tr>
  </table>
</template>

<script setup>
const props = defineProps({
  objects: Array,
  editObject: Function,
  deleteObject: Function,
})

const columns = ['Δ', 'Name', 'Type', 'Radius', 'Rings', 'Satellites']
const values = ['distance', 'name', 'type', 'radius', 'rings']
</script>
