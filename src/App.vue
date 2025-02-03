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
        <PresetLoader />
      </template>
      <template #save>
        <PresetSaver />
      </template>
      <template #x>
        <!-- empty template to "close" the menu -->
      </template>
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
import PresetLoader from './components/PresetLoader.vue'
import PresetSaver from './components/PresetSaver.vue'

import useObjects from './useObjects'
import useStorage from './useStorage'

const { star, objects, selectedObject } = useObjects()
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
