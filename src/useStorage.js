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
    const jsonClone = JSON.stringify(store.value[name])
    const preset = JSON.parse(jsonClone)
    return preset
  }

  function savePreset(star, objects) {
    const name = currentName.value
    const jsonClone = JSON.stringify({ star, objects})
    store.value[name] = JSON.parse(jsonClone)
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