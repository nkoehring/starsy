import { ref } from 'vue'

const hasQueryLocalFonts = "queryLocalFonts" in window
const availableFonts = new Set<FontData>()
const fontsStyleSheet = new CSSStyleSheet()
let isStyleSheetApplied = false

// looks like typescript doesn't know anything about the font query api, yet
export interface FontData {
  fullName: string
  postscriptName: string
  family: string
  style: string
  blob: () => null
}

export default function useLocalFonts() {
  const localFonts = ref<FontData[]>(Array.from(availableFonts))

  if (!("queryLocalFonts" in window)) return {
    canQueryLocalFonts: false,
    query: () => [],
    load: (_font: FontData) => undefined,
  }

  const query = async () => {
    // @ts-ignore-next-line: typescript doesn't know queryLocalFonts, yet
    const fontList: FontData[] = await window.queryLocalFonts()
    fontList.forEach(font => availableFonts.add(font))
    localFonts.value = Array.from(availableFonts)
    console.log('local fonts', fontList)
  }

  const load = async (font: FontData): Promise<string> => {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/FontData
    fontsStyleSheet.insertRule(`
      @font-face {
        font-family: '${font.fullName}';
        src: local('${font.fullName}'), local('${font.postscriptName}');
      }
    `)

    if (!isStyleSheetApplied) {
      window.document.adoptedStyleSheets = [
        ...window.document.adoptedStyleSheets,
        fontsStyleSheet,
      ]
      isStyleSheetApplied = true
    }

    return font.fullName
  }

  return { canQueryLocalFonts: true, queryLocalFonts: query, loadFont: load, localFonts }
}
