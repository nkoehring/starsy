<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useObjects from '../useObjects'
import useStorage from '../useStorage'
import useExport from '../useExport'

export interface Props {
  svgEl: SVGGraphicsElement
}
const props = defineProps<Props>()

const imageWidth = ref(2000)
const imageHeight = ref(600)
const linkedRatio = ref(true)
const ratio = 3 + 1/3

let ignoreWidthChange = false
let ignoreHeightChange = false

watch(imageWidth, w => {
  if (ignoreWidthChange || !linkedRatio.value) return
  ignoreHeightChange = true
  imageHeight.value = Math.round(w / ratio)
  nextTick(() => {
    ignoreHeightChange = false
  })
})

watch(imageHeight, h => {
  if (ignoreHeightChange || !linkedRatio.value) return
  ignoreWidthChange = true
  imageWidth.value = Math.round(h * ratio)
  nextTick(() => {
    ignoreWidthChange = false
  })
})

const { star, primaryBodies } = useObjects()
const { currentName } = useStorage(star, primaryBodies)
const { exportPNG } = useExport(props.svgEl)

function toggleEnforceRatio() {
  if (linkedRatio.value) {
    linkedRatio.value = false
    return
  }

  linkedRatio.value = true
  imageWidth.value = 2000
}
</script>

<template>
  <div class="image-options">
    <div>
      <label>Image Name</label>
      <input placeholder="fancy star system" v-model="currentName" type="text" />
    </div>

    <div>
      <label>Image Width</label>
      <input placeholder="2000" v-model.number="imageWidth" type="number" min="10" />
    </div>
    <button class="keep-ratio action link" :class="{ selected: linkedRatio }"
      @click="toggleEnforceRatio()"
      title="enforce original image ratio"
    />
    <div>
      <label>Image Height</label>
      <input placeholder="600" v-model.number="imageHeight" type="number" min="3" />
    </div>
  </div>
  <button class="image-download-cta" @click="exportPNG(currentName, imageWidth, imageHeight)">
    download starsy-{{ currentName }}.png
  </button>
</template>

<style scoped>
.image-options {
  display: flex;
  flex-flow: column nowrap;
  gap: 1em;
  margin: 2em 0;
}
.image-options > div {
  display: flex;
  align-items: baseline;
  gap: 1em;
}
.image-options label {
  display: inline-block;
  width: 8em;
}
.image-options label::after {
  content: ':';
}
input[type="number"] {
  width: 5em;
}
button.keep-ratio {
  margin: -2em 0 -2em 240px;
  opacity: 0.8;
  background-color: var(--bg-app);
}
button.keep-ratio.selected {
  opacity: 1.0;
  width: 32px;
  height: 32px;
}
.image-download {
  display: flex;
  gap: 1em;
  align-items: baseline;
  margin: 2em 0 0;
}
input {
  font-size: 1em;
}
button.image-download-cta {
  padding: .2em .5em;
  font-size: 1.5em;
}
</style>
