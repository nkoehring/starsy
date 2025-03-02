<script setup lang="ts">
import { ref } from 'vue'

export interface Props {
  collapsible?: boolean
  hiddenByDefault?: boolean
}
const { collapsible = true, hiddenByDefault = false } = defineProps<Props>()
const isShowingTips = ref(!hiddenByDefault)
</script>

<template>
  <ul class="info">
    <header>
      Tips:
      <button @click="isShowingTips = !isShowingTips" v-if="collapsible">
        {{ isShowingTips ? 'collapse' : 'expand' }}
      </button>
    </header>
    <template v-if="isShowingTips">
      <slot />
    </template>
  </ul>
</template>
