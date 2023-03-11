<template>
  <p><i>(Careful! Loading will overwrite the current state!)</i></p>
  <p>
    <b>Local Storage</b>
    <br />
    <ul>
      <li :key="name" v-for="{ name, star, objects } in storageInfo">
        {{ name }} ("{{ star }}", {{ objects }} objects)
        <button @click="replaceCurrent(loadPreset(name))">load</button>
        <button @click="deletePreset(name)" v-if="name !== 'example'">delete</button>
      </li>
    </ul>
  </p>
  <p>
    <b>File System</b>
    <br />
    <input type="file" @change="loadJSONFile($event)" />
  </p>
</template>

<script setup>
import useObjects from '../useObjects'
import useStorage from '../useStorage'

const { star, objects, replaceCurrent } = useObjects()
const {
  storageInfo,
  loadPreset,
  savePreset,
  deletePreset,
  currentName,
} = useStorage(star, objects)

function loadJSONFile (event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = evt => {
    try {
      const preset = JSON.parse(evt.target.result)
      replaceCurrent(preset)
    } catch {
      alert('Failed to read file. Are you sure, it is a valid Starsy JSON file?')
    }
  }
  reader.readAsText(file)
}
</script>
