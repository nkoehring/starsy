<script setup lang="ts">
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

const { selectedObject } = useObjects()
const labelFonts = ['xolonium', 'douar', 'lack']
const themes = ['default', 'retro', 'inverse', 'paper']

type ValidFont = typeof labelFonts[number]
type ValidTheme = typeof themes[number]

function setTheme(theme: ValidTheme) {
  const classes = document.body.className.split(' ')
  const currentTheme = classes.find(c => c.startsWith('theme-'))
  const newTheme = `theme-${theme}`

  if (currentTheme) {
    document.body.classList.replace(currentTheme, newTheme)
  } else {
    document.body.classList.add(newTheme)
  }
}
function setFont(font: ValidFont) {
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
      <template #collapse>
        <!-- empty template to "close" the menu -->
      </template>
    </AppMenu>
    <SystemSettings />
    <ObjectList />
  </section>

  <footer>
    An experiment by
    <a target="_blank" rel="noopener" href="https://koehr.ing">koehr</a> |
    © 2022 - today |
    <a target="_blank" rel="noopener" href="https://github.com/nkoehring/starsy">open source</a>
  </footer>
</template>
