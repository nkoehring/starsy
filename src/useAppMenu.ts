import { ref, computed } from 'vue'

export default function useAppMenu() {
  const isShowingMenu = ref(false)
  const appMenuParentEl = ref<HTMLElement>()
  const appMenuPosition = computed(() => {
    const rect = appMenuParentEl.value?.getBoundingClientRect()
    if (!rect) return { x: window.document.body.scrollWidth, y: 0 }

    // position the menu beneath the menu button
    return { x: rect.right, y: rect.bottom }
  })

  const toggleAppMenu = (event: PointerEvent) => {
    if (isShowingMenu.value) {
      appMenuParentEl.value = undefined
      isShowingMenu.value = false
    } else {
      appMenuParentEl.value = event.target as HTMLElement
      isShowingMenu.value = true
    }
  }

  return { isShowingMenu, appMenuPosition, toggleAppMenu }
}
