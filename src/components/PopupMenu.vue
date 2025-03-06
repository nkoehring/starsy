<script setup lang="ts">
import { computed } from 'vue'
import type { LabeledValue } from '../types'

export interface Props {
  menuItems: LabeledValue[]
  position: { x: number; y: number }
}
export interface Events {
  (e: 'select', value: string): void
}
const props = defineProps<Props>()
const emit = defineEmits<Events>()
const isShowingMenu = defineModel<boolean>({ default: false })

const select = (value: string) => {
  emit('select', value)
  isShowingMenu.value = false
}
</script>

<template>
  <menu v-show="isShowingMenu"
    class="popup-menu"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  >
    <li v-for="item in menuItems" @click="select(item.value)">
      {{ item.label }}
    </li>
  </menu>
</template>
