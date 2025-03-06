<script setup lang="ts">
import { ref } from 'vue'
import useModal from '../useModal'
import type { StarsyTheme } from '../types'

export interface Props {
  fonts: string[]
  themes: string[]
  currentTheme: StarsyTheme
}
export interface Events {
  (e: 'select:theme', value: string): void,
  (e: 'select:menu', value: PointerEvent): void,
}
const props = defineProps<Props>()
const emit = defineEmits<Events>()
</script>

<template>
  <header>
    <div class="headline">
      <h1>Starsy</h1>
      <p>Starsystem<br/>Generator</p>
    </div>
    <div class="options">
      <label>
        Theme
        <select
          :value="currentTheme.label"
          @change="emit('select:theme', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="t in themes">{{ t }}</option>
        </select>
      </label>
      <button class="action menu" @click="emit('select:menu', $event)" />
    </div>
  </header>
</template>
