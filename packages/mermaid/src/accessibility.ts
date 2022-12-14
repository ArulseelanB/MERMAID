/**
 * Accessibility (a11y) functions, types, helpers
 *
 */
import { D3Element } from './mermaidAPI';

import isEmpty from 'lodash-es/isEmpty';

/**
 * Add aria-roledescription to the svg element to the diagramType
 *
 * @param svg - d3 object that contains the SVG HTML element
 * @param diagramType - diagram name for to the aria-roledescription
 */
export function setA11yDiagramInfo(svg: D3Element, diagramType: string | null | undefined) {
  if (!isEmpty(diagramType)) {
    svg.attr('aria-roledescription', diagramType);
  }
}
/**
 * Add an accessible title and/or description element to a chart.
 * The title is usually not displayed and the description is never displayed.
 *
 * The following charts display their title as a visual and accessibility element: gantt
 *
 * @param svg - d3 node to insert the a11y title and desc info
 * @param a11yTitle - a11y title. null and undefined are meaningful: means to skip it
 * @param a11yDesc - a11y description.  null and undefined are meaningful: means to skip it
 * @param baseId - id used to construct the a11y title and description id
 */
export function addSVGa11yTitleDescription(
  svg: D3Element,
  a11yTitle: string | null | undefined,
  a11yDesc: string | null | undefined,
  baseId: string
) {
  if (svg.insert === undefined) {
    return;
  }

  if (a11yTitle || a11yDesc) {
    if (a11yDesc) {
      const descId = 'chart-desc-' + baseId;
      svg.attr('aria-describedby', descId);
      svg.insert('desc', ':first-child').attr('id', descId).text(a11yDesc);
    }
    if (a11yTitle) {
      const titleId = 'chart-title-' + baseId;
      svg.attr('aria-labelledby', titleId);
      svg.insert('title', ':first-child').attr('id', titleId).text(a11yTitle);
    }
  } else {
    return;
  }
}
