import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import type { StarsySettings, StarsyTheme } from './types'

const fonts = ['xolonium', 'douar', 'lack']

/** The default theme */
const themeDefault: StarsyTheme = {
  label: 'default',
  font: 'xolonium',
  bgApp: '#232332',
  fgApp: '#EEEEEE',
  bgGraphic: '#000000',
  fgGraphic: '#FFFFFF',
  hlGraphic: '#FFFFBB',
  fillStar: '#FFFFBB', // 'auto',
  fgDanger: '#CC0000',
  isBright: false,
  system: true,
} as const

/** A sepia coloured retro style theme */
const themeRetro: StarsyTheme = {
  label: 'retro',
  font: 'xolonium',
  bgApp: '#4B4839',
  fgApp: '#E4DCB5',
  bgGraphic: '#E4DCB5',
  fgGraphic: '#4B4839',
  hlGraphic: '#222222',
  fillStar: '#4B4839',
  fgDanger: '#FF6666',
  isBright: false,
  system: true,
} as const

/** A sepia coloured retro style theme, but with a dark background */
const themeInverse: StarsyTheme = {
  label: 'inverse',
  font: 'xolonium',
  bgApp: '#333333',
  fgApp: '#E4DCB5',
  bgGraphic: '#4B4839',
  fgGraphic: '#E4DCB5',
  hlGraphic: '#FFFF00',
  fillStar: '#E4DCB5',
  fgDanger: '#CC0000',
  isBright: false,
  system: true,
} as const

/** A black and white theme, meant to be used for printing */
const themePaper: StarsyTheme = {
  label: 'paper',
  font: 'xolonium',
  bgApp: '#FFFFFF',
  fgApp: '#000000',
  bgGraphic: '#FFFFFF',
  fgGraphic: '#000000',
  hlGraphic: '#555555',
  fillStar: '#000000',
  fgDanger: '#CC0000',
  isBright: true,
  system: true,
} as const

/** Lots of bold blue and yellow colours */
const themeYellowBlue: StarsyTheme = {
  label: 'yellow-blue',
  font: 'xolonium',
  bgApp: '#0000AA',
  fgApp: '#FFFF00',
  bgGraphic: '#000088',
  fgGraphic: '#FFFF00',
  hlGraphic: '#AAFF00',
  fillStar: '#AAFF00',
  fgDanger: '#FF8800',
  isBright: false,
  system: true,
} as const

/** List of system themes */
const systemThemes: Record<string, StarsyTheme> = {
  default: themeDefault,
  inverse: themeInverse,
  paper: themePaper,
  retro: themeRetro,
  ['yellow-blue']: themeYellowBlue,
}

/** Apply values from a theme to the respective CSS variables */
function applyTheme(theme: StarsyTheme) {
  const rootEl = window.document.documentElement

  rootEl.style.setProperty('--bg-app', theme.bgApp)
  rootEl.style.setProperty('--fg-app', theme.fgApp)
  rootEl.style.setProperty('--bg-graphic', theme.bgGraphic)
  rootEl.style.setProperty('--fg-graphic', theme.fgGraphic)
  rootEl.style.setProperty('--hl-graphic', theme.hlGraphic)
  rootEl.style.setProperty('--fg-danger', theme.fgDanger)
  rootEl.style.setProperty('--title-font', theme.font)

  if (theme.fillStar !== 'auto') {
    rootEl.style.setProperty('--fill-star', theme.fillStar)
  } else {
    rootEl.style.setProperty('--fill-star', 'var(--hl-graphic)')
  }

  if (theme.isBright) rootEl.classList.add('bright-theme')
  else rootEl.classList.remove('bright-theme')
}

/**
  * Update stored themes with newest version, ignoring user themes
  * and converting deleted but used system themes to user themes
  */
const updateThemes = (storedThemes: StarsyTheme[], currentTheme: StarsyTheme) => {
  const knownThemeLabels = Object.keys(systemThemes)

  storedThemes.forEach((storedTheme, index) => {
    if (!storedTheme.system) return
    if (knownThemeLabels.indexOf(storedTheme.label) < 0) storedThemes.splice(index, 1)
    else storedThemes[index] = systemThemes[storedTheme.label]
  })

  const storedThemeLabels = storedThemes.map(t => t.label)

  knownThemeLabels.forEach(knownThemeLabel => {
    if (storedThemeLabels.indexOf(knownThemeLabel) >= 0) return
    storedThemes.push(systemThemes[knownThemeLabel])
  })

  if (currentTheme.system) {
    // current theme doesn't exist anymore, lets keep it as user theme
    if (knownThemeLabels.indexOf(currentTheme.label) < 0) {
      currentTheme.system = false
      storedThemes.push(currentTheme)
    } else {
      currentTheme = systemThemes[currentTheme.label]
    }
  }

  return { storedThemes, currentTheme }
}

const store = useStorage<StarsySettings>('starsy-theme', {
  storedThemes: Object.values(systemThemes),
  currentTheme: themeDefault,
})

// update stored system themes
store.value = updateThemes(store.value.storedThemes, store.value.currentTheme)
// apply the stored theme
applyTheme(store.value.currentTheme)

/** Find a theme by its label and apply it */
const applyThemeByLabel = (themeLabel: string): boolean => {
  const theme = store.value.storedThemes.find(t => t.label === themeLabel)
  if (!theme) return false

  applyTheme(theme)
  store.value.currentTheme = theme

  return true
}

/** Add a theme to the list of stored themes and select it */
const addTheme = (theme: StarsyTheme): boolean => {
  const exists = store.value.storedThemes.some(t => t.label === theme.label)
  if (exists) return false

  theme.system = false
  store.value = {
    currentTheme: theme,
    storedThemes: [...store.value.storedThemes, theme]
  }
  return true
}

/** Find a theme by its label and remove it from the stored themes */
const removeThemeByLabel = (label: string): boolean => {
  const idx = store.value.storedThemes.findIndex(t => t.label === label)
  if (idx < 0) return false
  
  const theme = store.value.storedThemes[idx]
  if (theme.system) return false

  store.value.storedThemes.splice(idx, 1)
  return true
}

/** Find a theme by its original label and overwrite it with a new theme */
const overwriteTheme = (originalLabel: string, theme: StarsyTheme): boolean => {
  const idx = store.value.storedThemes.findIndex(t => t.label === originalLabel)
  if (idx < 0) return false

  const oldTheme = store.value.storedThemes[idx]
  if (oldTheme.system) return false

  store.value.storedThemes[idx] = theme

  if (store.value.currentTheme.label === originalLabel) {
    store.value.currentTheme = theme
  }

  return true
}

/**
 * Composable for workign with themes
 * @returns Object containing:
 * - currentTheme - the currently selected theme
 * - themes - a list of stored themes
 * - fonts - a list of known fonts (without local fonts)
 * - addTheme - Function to add a new theme
 * - overwriteTheme - Function to overwrite an existing theme
 * - applyTheme - Function to apply a theme
 * - removeTheme - Function to remove a theme from storage
 */
export default function useStaryTheme() {
  const currentTheme = computed(() => store.value.currentTheme)
  const themes = computed<string[]>(() => store.value.storedThemes.map(t => t.label))

  return {
    currentTheme,
    themes,
    fonts,
    addTheme,
    overwriteTheme,
    applyTheme: applyThemeByLabel,
    removeTheme: removeThemeByLabel,
  }
}
