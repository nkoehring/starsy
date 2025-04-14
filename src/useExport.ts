import html2canvas from "html2canvas"

const ATTRIBUTES = [
  'fill',
  'fillOpacity',
  'fillRule',
  'stroke',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
]

/**
 * applyStylesRecursively
 * Recursively apply CSS styles directly as properties to child elements
 */
function applyStylesRecursively(target: HTMLCollection, source: HTMLCollection) {
  const targetElements = Array.from(target)

  targetElements.forEach((el, i) => {
    const sourceEl = source.item(i)!
    const styles = getComputedStyle(sourceEl)

    if (el.childElementCount) {
      applyStylesRecursively(el.children, sourceEl.children)
    }

    ATTRIBUTES.forEach(attr => {
      const style = styles[attr as keyof typeof styles]
      if (style) el.setAttribute(attr, style as string)
    })
  })
}

/**
 * createSVGExport - still incomplete
 * Creates an SVG image out of an SVG DOM node, by applying all styles from
 * CSS classes etc directly as attributes, as far as possible.
 */
function createSVGExportElement(sourceEl: SVGGraphicsElement, width = 1000, height = 300) {
  const targetEl = sourceEl.cloneNode(true) as SVGGraphicsElement
  targetEl.setAttribute('width', `${width}px`)
  targetEl.setAttribute('height', `${height}px`)
  applyStylesRecursively(targetEl.children, sourceEl.children)

  const styles = getComputedStyle(sourceEl)
  const bgColor = styles.backgroundColor
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bgRect.setAttribute('fill', bgColor)
  bgRect.setAttribute('x', '0')
  bgRect.setAttribute('y', '0')
  bgRect.setAttribute('width', `${width}`)
  bgRect.setAttribute('height', `${height}`)
  targetEl.prepend(bgRect)

  return { targetEl, bgColor }
}

const exportPNG = async (name: string, svgEl: SVGGraphicsElement, width = 2000, height = 600) => {
  const cloneEl = svgEl.cloneNode(true) as SVGGraphicsElement
  cloneEl.setAttribute('width', `${width}px`)
  cloneEl.setAttribute('height', `${height}px`)
  const div = document.createElement('div')
  div.append(cloneEl)
  div.id = 'svg-export-el'
  div.style.marginTop = '-600px'
  div.style.position = 'absolute'
  document.body.prepend(div)

  const targetEl = document.getElementById('svg-export-el')!

  const canvas = await html2canvas(targetEl, { width, height, windowWidth: width })
  const link = document.createElement('a')

  svgEl.removeAttribute('width')
  svgEl.removeAttribute('height')
  document.body.removeChild(targetEl)

  link.download = `${name}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const exportSVG = (name: string, svgEl: SVGGraphicsElement) => {
  const source = (new XMLSerializer()).serializeToString(svgEl)
  const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source)
  const link = document.createElement('a')

  link.download = `${name}.png`
  link.href = url
  link.click()
}

export default function useExport(name: string, svgEl: SVGGraphicsElement) {
  // const { targetEl, bgColor } = createSVGExportElement(svgEl)

  return {
    exportPNG: (width = 2000, height = 600) => exportPNG(`starsy-${name}`, svgEl, width, height),
    exportSVG: () => exportSVG(`starsy-${name}`, svgEl),
  }
}
