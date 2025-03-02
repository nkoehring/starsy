import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { hasOldPresetFormat, updateOldPreset } from './utils'
import type { Star, Planet, StarSystem } from './types'

export default function useStarsyStorage(star: Star, primaryBodies: Planet[]) {
  const store = useStorage<Record<string, StarSystem>>('starsy', {
    example: { star, primaryBodies }
  })

  const storageInfo = computed(() => {
    return Object.keys(store.value).map(name => {
      const { star, objects, primaryBodies } = store.value[name] as {
        star: Star
        objects?: Planet[]
        primaryBodies?: Planet[]
      }

      // support for old storage format ("objects")
      const bodies = (primaryBodies ?? objects ?? []) as Planet[]

      return {
        name,
        star: star.designation,
        primaryBodies: bodies.length,
        secondaryBodies: bodies.reduce((acc, body) => acc + body.satellites.length, 0)
      }
    })
  })

  const currentName = ref('example')

  function loadPreset(name: string) {
    const jsonClone = JSON.stringify(store.value[name])
    const preset = JSON.parse(jsonClone)

    // transparently convert old storage format to new one on load
    if (hasOldPresetFormat(preset)) return updateOldPreset(preset)
    return preset
  }

  function savePreset(star: Star, primaryBodies: Planet[]) {
    const name = currentName.value
    const jsonClone = JSON.stringify({ star, primaryBodies })
    store.value[name] = JSON.parse(jsonClone)
  }

  function deletePreset(name: keyof typeof store.value) {
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
