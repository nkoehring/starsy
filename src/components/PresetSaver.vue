<template>
  <div>
    <label>
      Save current system as:
      <input placeholder="fancy star system" v-model="currentName" />
    </label>
  </div>
  <div>
    <h2>Local Storage</h2>
    <button @click="savePreset(star, objects)">save as "{{ currentName }}"</button>
  </div>
  <div>
    <h2>File System</h2>
    <a :href="fileBlob" :download="`${currentName}.json`">download as {{ currentName }}.json</a>
  </div>
</template>

<script setup>
import useObjects from '../useObjects'
import useStorage from '../useStorage'

const { star, objects } = useObjects()
const {
  savePreset,
  currentName,
} = useStorage(star, objects)
</script>

<style scoped>
div, label {
  display: flex;
  gap: 1em;
  align-items: baseline;
  margin: .5em 0;
}
h2 {
  font-size: 1.2em;
  margin: .5em 0 0 0;
}
h2::after {
  content: ":";
}
button, input {
  font-size: 1em;
}
</style>
