<template>
  <p>
    <label>
      Save current system as:
      <input placeholder="fancy star system" v-model="currentName" />
    </label>
  </p>
  <p>
    <b>Local Storage </b>
    <button @click="savePreset(star, objects)">save as "{{ currentName }}"</button>
  </p>
  <p>
    <b>File System </b>
    <a :href="fileBlob" :download="`${currentName}.json`">download as {{ currentName }}.json</a>
  </p>
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
