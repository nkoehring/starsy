<script setup lang="ts">
import useObjects from '../useObjects'
import useStorage from '../useStorage'

const { star, primaryBodies, replaceCurrent } = useObjects()
const {
  storageInfo,
  loadPreset,
  deletePreset,
} = useStorage(star, primaryBodies)

function loadJSONFile(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const reader = new FileReader()
  reader.onload = (evt: ProgressEvent<FileReader>) => {
    const result = evt.target?.result as string | undefined
    if (!result) return
    try {
      const preset = JSON.parse(result)
      replaceCurrent(preset)
    } catch {
      alert('Failed to read file. Are you sure, it is a valid Starsy JSON file?')
    }
  }
  reader.readAsText(files[0])
}
</script>

<template>
  <div>
    <i>(Careful! Loading will overwrite the current state!)</i>
  </div>
  <div>
    <h2>Local Storage</h2>
    <ul>
      <li :key="name" v-for="{ name, star, primaryBodies, secondaryBodies } in storageInfo">
        {{ name }} ("{{ star }}",
        {{ primaryBodies }} primary bodies,
        {{ secondaryBodies }} secondary bodies (moons/stations))
        <button @click="replaceCurrent(loadPreset(name))">load</button>
        <button @click="deletePreset(name)" v-if="name !== 'example'">delete</button>
      </li>
    </ul>
  </div>
  <div>
    <h2>File System</h2>
    <input type="file" accept=".json,.starsy" @change="loadJSONFile($event)" />
  </div>
</template>

<style scoped>
div {
  margin: 1em 0;
}
h2 {
  font-size: 1.2em;
  margin: 2em 0 1em 0;
}
</style>
