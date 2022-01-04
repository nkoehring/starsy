<template>
  <Headline
    v-bind="{ labelFonts, themes }"
    @select:font="setFont($event)"
    @select:theme="setTheme($event)"
  />
  <SystemDiagram v-bind="{ star, objects }" />

  <section id="settings">
    <ObjectSettings v-model:object="selectedObject" v-if="selectedObject" />
    <Tips>
      <li>Edit planets by clicking directly inside the graphic or in the table below.</li>
      <li>Drag planets around to change their distance.</li>
      <li>Use the scrollwheel to change their size.</li>
      <li>To change satellites, click their respective buttons in the planet dialog.</li>
      <li>You can also drag satellite buttons around to reorder them.</li>
    </Tips>
    <SystemSettings v-model:designation="star.designation" v-model:radius="star.radius" />
    <ObjectList v-bind="{ objects, editObject, deleteObject }" />
  </section>

</template>

<script setup>
import { ref, reactive } from 'vue'
import exampleData from './example-data'
import Headline from './components/Headline.vue'
import SystemDiagram from './components/SystemDiagram.vue'
import Tips from './components/Tips.vue'
import SystemSettings from './components/SystemSettings.vue'
import ObjectList from './components/ObjectList.vue'
import ObjectSettings from './components/ObjectSettings.vue'

const star = reactive({
  designation: 'Sol',
  radius: 400,
})

const objects = ref(exampleData)
const labelFonts = ['xolonium', 'douar', 'lack']
const themes = ['default', 'retro', 'inverse', 'paper']

const selectedObject = ref(null)

function editObject (obj) {
  selectedObject.value = obj
}

function deleteObject (obj) {
  console.log('delete object not yet implemented')
}

function autoName (obj) {
  const index = objects.value.indexOf(obj)
  return `${star.designation}-${index}`
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
