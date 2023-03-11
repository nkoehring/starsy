import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export default function useStarsyStorage(star, objects) {
  const store = useStorage('starsy', {
    example: { star, objects }
  })

  const storageInfo = computed(() => {
    return Object.keys(store.value).map(name => {
      const { star, objects } = store.value[name]

      return {
        name,
        star: star.designation,
        objects: objects.length,
      }
    })
  })

  const currentName = ref('example')

  function loadPreset(name) {
    return store.value[name]
  }

  function savePreset(star, objects) {
    const name = currentName.value
    store.value[name] = { star, objects }
    console.log('saved preset', name, store.value[name])
  }

  function deletePreset(name) {
    delete store.value[name]
  }

  return {
    store,
    storageInfo,
    loadPreset,
    savePreset,
    deletePreset,
    currentName,
  }
}