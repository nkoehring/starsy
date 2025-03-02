<script setup lang="ts">
import { ref, useSlots } from 'vue'
export interface Props {
  defaultSlot?: string
}
const props = defineProps<Props>()
const slots = useSlots()
const shownSlot = ref(props.defaultSlot || Object.keys(slots)[0] || 'default')
</script>

<template>
  <div class="info">
    <header>
      <button v-for="(_, slot) in slots"
        :key="slot"
        @click="shownSlot = slot as string"
        class="app-menu-button"
        :class="{ highlighted: shownSlot === slot }"
      >
        {{ slot }}
      </button>
    </header>
    <slot :name="shownSlot"></slot>
  </div>
</template>
