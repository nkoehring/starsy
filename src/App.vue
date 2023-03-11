<template>
  <Headline
    v-bind="{ labelFonts, themes }"
    @select:font="setFont($event)"
    @select:theme="setTheme($event)"
  />
  <SystemDiagram />

  <section id="settings">
    <ObjectSettings v-if="selectedObject" />
    <AppMenu default-slot="tips">
      <template #tips>
        <ul>
          <li>Edit planets by clicking directly inside the graphic or in the table below.</li>
          <li>Drag planets around to change their distance.</li>
          <li>The last removed planet can be restored from the table.</li>
          <li><strong>ONLY THE LAST</strong> removed planet can be restored.</li>
          <li>Click on a planet to get more tips.</li>
        </ul>
      </template>
      <template #load>
        <p><i>(Careful! Loading will overwrite the current state!)</i></p>
        <p>
          <b>Local Storage</b>
          <br />
          <ul>
            <li :key="name" v-for="{name, star, objects } in storageInfo">
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
      <template #save>
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
      <template #x></template>
    </AppMenu>
    <SystemSettings />
    <ObjectList />
  </section>

</template>

<script setup>
import { computed } from 'vue'

import Headline from './components/Headline.vue'
import SystemDiagram from './components/SystemDiagram.vue'
import AppMenu from './components/AppMenu.vue'
import Tips from './components/Tips.vue'
import SystemSettings from './components/SystemSettings.vue'
import ObjectList from './components/ObjectList.vue'
import ObjectSettings from './components/ObjectSettings.vue'

import useObjects from './useObjects'
import useStorage from './useStorage'

const { star, objects, selectedObject, replaceCurrent } = useObjects()
const labelFonts = ['xolonium', 'douar', 'lack']
const themes = ['default', 'retro', 'inverse', 'paper']

const {
  storageInfo,
  loadPreset,
  savePreset,
  deletePreset,
  currentName,
} = useStorage(star, objects)

const fileBlob = computed(() => {
  const jsonFileData = JSON.stringify({ star, objects })
  return `data:text/json;charset=utf-8,${encodeURIComponent(jsonFileData)}`
})

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

function setTheme (theme) {
  const classes = document.body.className.split(' ')
  const currentTheme = classes.find(c => c.startsWith('theme-'))
  const newTheme = `theme-${theme}`

  if (currentTheme) {
    document.body.classList.replace(currentTheme, newTheme)
  } else {
    document.body.classList.add(newTheme)
  }
}
function setFont (font) {
  const classes = document.body.className.split(' ')
  const currentFont = classes.find(c => c.startsWith('title-'))
  const newFont = `title-${font}`

  if (currentFont) {
    document.body.classList.replace(currentFont, newFont)
  } else {
    document.body.classList.add(newFont)
  }
}

setTheme(themes[0])
setFont(labelFonts[0])
</script>
