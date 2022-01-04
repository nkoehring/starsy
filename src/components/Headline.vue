<template>
  <header>
    <div class="headline">
      <h1>Starsy</h1>
      <p>Starsystem<br/>Generator</p>
    </div>
    <div class="options">
      <label>
        Title Font
        <select v-model="selectedFont" @change="$emit('select:font', selectedFont)">
          <option v-for="f in labelFonts">{{ f }}</option>
        </select>
      </label>
      <label>
        Color Theme
        <select v-model="selectedTheme" @change="$emit('select:theme', selectedTheme)">
          <option v-for="t in themes">{{ t }}</option>
        </select>
      </label>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  labelFonts: Array,
  themes: Array,
})

const selectedFont = ref(props.labelFonts[0])
const selectedTheme = ref('default')
</script>
