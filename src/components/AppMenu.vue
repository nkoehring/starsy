<template>
  <div class="info">
    <header>
      <button v-for="(_, slot) in slots"
        :key="slot"
        @click="shownSlot = slot"
        class="app-menu-button"
        :class="{ highlighted: shownSlot === slot }"
      >
        {{ slot }}
      </button>
    </header>
    <slot :name="shownSlot"></slot>
  </div>
</template>

<script setup>
import { ref, useSlots } from 'vue'

const props = defineProps({
  defaultSlot: {
    type: String,
  },
})

const slots = useSlots()
const shownSlot = ref(props.defaultSlot || Object.keys(slots)[0] || 'default')
</script>
