import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { hasOldPresetFormat, updateOldPreset } from './utils'
import type { Star, Planet, StarSystem } from './types'

/**
 * Composable for managing star system data persistence in local storage
 * 
 * @param star - The initial star data
 * @param primaryBodies - The initial array of primary celestial bodies
 * @returns Object containing storage utilities and state:
 *  - store: Ref to the raw storage object mapping system names to StarSystem objects
 *  - storageInfo: Computed property providing summary information for all stored systems
 *  - loadPreset: Function to load a preset by name and handle format conversions
 *  - savePreset: Function to save the current star system under the current name
 *  - deletePreset: Function to remove a preset from storage
 *  - currentName: Ref to the currently active system name
 */
export default function useStarsyStorage(star: Star, primaryBodies: Planet[]) {
  const store = useStorage<Record<string, StarSystem>>('starsy', {
    example: { star, primaryBodies }
  })

  /**
   * Computed property that provides summary information about all stored star systems
   * 
   * @returns Array of objects containing:
   *  - name: The storage key for the system
   *  - star: The designation of the star in the system
   *  - primaryBodies: Count of primary celestial bodies orbiting the star
   *  - secondaryBodies: Total count of satellites orbiting primary bodies
   */
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

  /** Reference to the current star system name */
  const currentName = ref('example')

  /**
   * Loads a star system preset from storage by name
   * Handles conversion from old format if necessary
   * 
   * @param name - The name of the preset to load
   * @returns The loaded star system as a StarSystem object
   */
  function loadPreset(name: string) {
    const jsonClone = JSON.stringify(store.value[name])
    const preset = JSON.parse(jsonClone)

    // transparently convert old storage format to new one on load
    if (hasOldPresetFormat(preset)) return updateOldPreset(preset)
    return preset
  }

  /**
   * Saves the current star system to storage under the current name
   * Creates a deep clone to prevent reference issues
   * 
   * @param star - The star data to save
   * @param primaryBodies - The primary celestial bodies to save
   */
  function savePreset(star: Star, primaryBodies: Planet[]) {
    const name = currentName.value
    const jsonClone = JSON.stringify({ star, primaryBodies })
    store.value[name] = JSON.parse(jsonClone)
  }

  /**
   * Deletes a preset from storage by name
   * 
   * @param name - The name of the preset to delete
   */
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
