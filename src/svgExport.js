const KNOWN_STYLES = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
]

/**
 * getStyles
 * Recursively apply CSS styles directly as properties to child elements
 *
 * @param nodes: NodeList
 * @param childList: SVGElement[]
 */
function getStyles(nodes, childList = []) {
  for (const node of nodes) {
    if (node.childElementCount) {
      getStyles(node.getChildNodes(), childList)
    }
    if (node.nodeName === '#text') continue

    const styles = getComputedStyles(node)
    KNOWN_STYLES.forEach(style => {
      // node.pr
    })
  }
}

/**
 * createSVGExport
 * Creates an SVG image out of an SVG DOM node, by applying all styles from
 * CSS classes etc directly as attributes, as far as possible.
 *
 * @param svgEl: SVGElement - the SVG DOM Element to export
 * @returns string
 */
function createSVGExport(svgEl) {
  /** SVGElement[] - to hold all transformed children of the export */
  const children = []

  svgEl.getChildNodes.forEach(node => {
    const styles = getComputedStyles(node)
  })

  const SVGXMLString = `<?xml version="1.0" encoding="utf-8"?>${svgExport.outerHTML}`
}
