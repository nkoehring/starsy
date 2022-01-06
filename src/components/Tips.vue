<template>
  <ul class="tip">
    <header>
      Tips:
      <button @click="tipsShown = !tipsShown" v-if="collapsible">
        {{ tipsShown ? 'collapse' : 'expand' }}
      </button>
    </header>
    <template v-if="tipsShown">
      <slot />
    </template>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  collapsible: {
    type: Boolean,
    default: true,
  },
  hiddenByDefault: {
    type: Boolean,
    default: false,
  },
})

const tipsShown = ref(!props.hiddenByDefault)
</script>
