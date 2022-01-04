<template>
  <Headline
    v-bind="{ labelFonts, themes }"
    @select:font="setFont($event)"
    @select:theme="setTheme($event)"
  />
  <SystemDiagram v-bind="{ star, objects, selectedObject }" @select="selectObject" />

  <section id="settings">
    <ObjectSettings v-if="selectedObject"
      v-model:name="selectedObject.name"
      v-model:distance="selectedObject.distance"
      v-model:type="selectedObject.type"
      v-model:radius="selectedObject.radius"
      v-model:rings="selectedObject.rings"
      v-model:satellites="selectedObject.satellites"
      :auto-name="autoName(selectedObject)"
      @delete="deleteObject"
      @close="editObject(null)"
    />
    <Tips>
      <li>Edit planets by clicking directly inside the graphic or in the table below.</li>
      <li>Drag planets around to change their distance.</li>
      <li>Use the scrollwheel to change their size (click first to activate).</li>
      <li>To change satellites, click their respective buttons in the planet dialog.</li>
      <li>You can also drag satellite buttons around to reorder them.</li>
      <li>The last removed object can be restored from the table.</li>
      <li><strong>ONLY THE LAST</strong> removed object can be restored.</li>
    </Tips>
    <SystemSettings v-model:designation="star.designation" v-model:radius="star.radius" />
    <ObjectList v-bind="{ objects, deletedObject, editObject, deleteObject, restoreDeleted }" />
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
const deletedObject = ref(null) // { index: Number, object: Object }

function editObject (object) {
  if (object) {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
  selectedObject.value = object
}
function selectObject (object) {
  selectedObject.value = object
}

function deleteObject (object) {
  if (deletedObject.value) {
    const lost = deletedObject.value.object.name
    const confirmed = confirm(`
      Attention! Only the LAST deleted object can be restored.
      ${lost} will be lost forever! Proceed anyway?`
    )
    if (!confirmed) return
  }

  if (!object) object = selectedObject.value
  const index = objects.value.indexOf(object)

  console.debug('deleting object at index', index)

  if (index >= 0) objects.value.splice(index, 1)
  if (object === selectedObject.value) selectedObject.value = null

  deletedObject.value = { index, object }
}

function restoreDeleted () {
  const { index, object } = deletedObject.value
  console.debug('restoring deleted object', index)
  objects.value.splice(index, 0, object)
  deletedObject.value = null
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
