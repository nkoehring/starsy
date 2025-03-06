import { ref } from 'vue'

/** Set for font data objects coming from queryLocalFonts */
const availableFonts = new Set<FontData>()
/** CSSStyleSheet for font-face rules to load local fonts */
const fontsStyleSheet = new CSSStyleSheet()
/** Flag to ensure the style sheet is only applied when necessary */
let isStyleSheetApplied = false

// looks like typescript doesn't know anything about the font query api, yet
/**
 * Interface representing a local font from the Font Access API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FontData
 */
export interface FontData {
  fullName: string
  postscriptName: string
  family: string
  style: string
  blob: () => null
}

/**
 * Composable for working with the Local Font Access API
 * @returns Object containing:
 *  - canQueryLocalFonts: Boolean indicating if the API is supported
 *  - queryLocalFonts: Function to fetch available system fonts
 *  - loadFont: Function to load a specific font by postscript name
 *  - localFonts: Ref to array of available system fonts
 */
export default function useLocalFonts() {
  const localFonts = ref<FontData[]>(Array.from(availableFonts))

  // to make usage as smooth as possible everywhere, return dummy functions
  // when queryLocalFonts is not supported
  if (!("queryLocalFonts" in window)) return {
    canQueryLocalFonts: false,
    queryLocalFonts: () => [],
    loadFont: (_name: string) => false,
    localFonts,
  }

  /** Queries available system fonts and stores them in the localFonts ref */
  const query = async () => {
    // @ts-ignore-next-line: typescript doesn't know queryLocalFonts, yet
    const fontList: FontData[] = await window.queryLocalFonts()
    fontList.forEach(font => availableFonts.add(font))
    localFonts.value = Array.from(availableFonts)
  }

  /**
   * Loads a font by its postscript name and makes it available via CSS
   * 
   * @param postscriptName - The PostScript name of the font to load
   * @returns Boolean indicating whether the font was successfully loaded
   */
  const load = (postscriptName: string): boolean => {
    fontsStyleSheet.insertRule(`@font-face {
      font-family: "${postscriptName}";
      src: local("${postscriptName}");
    }`)

    if (!isStyleSheetApplied) {
      window.document.adoptedStyleSheets = [
        ...window.document.adoptedStyleSheets,
        fontsStyleSheet,
      ]
      isStyleSheetApplied = true
    }

    return isStyleSheetApplied
  }

  return { canQueryLocalFonts: true, queryLocalFonts: query, loadFont: load, localFonts }
}
