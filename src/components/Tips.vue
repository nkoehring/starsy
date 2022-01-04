<template>
  <ul class="tip">
    <header>
      Tips:
      <button @click="tipsShown = !tipsShown">{{ tipsShown ? 'close' : 'expand' }}</button>
    </header>
    <template v-if="tipsShown">
      <slot />
    </template>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
const tipsShown = ref(true)
</script>
