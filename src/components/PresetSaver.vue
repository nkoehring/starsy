<script setup lang="ts">
import { computed } from 'vue'
import useObjects from '../useObjects'
import useStorage from '../useStorage'

const { star, primaryBodies } = useObjects()
const { savePreset, currentName } = useStorage(star, primaryBodies)

const fileBlob = computed(() => {
  const jsonFileData = JSON.stringify({ star, primaryBodies })
  return `data:text/json;charset=utf-8,${encodeURIComponent(jsonFileData)}`
})
</script>

<template>
  <div>
    <label>
      Save current system as:
      <input placeholder="fancy star system" v-model="currentName" />
    </label>
  </div>
  <div>
    <h2>Local Storage</h2>
    <button @click="savePreset(star, primaryBodies)">save as "{{ currentName }}"</button>
  </div>
  <div>
    <h2>File System</h2>
    <a :href="fileBlob" :download="`${currentName}.starsy`">download as {{ currentName }}.starsy</a>
  </div>
</template>

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
