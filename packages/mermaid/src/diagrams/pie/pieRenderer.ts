/** Created by AshishJ on 11-09-2019. */
// @ts-nocheck - TODO Fix ts errors
import { select, scaleOrdinal, pie as d3pie, arc } from 'd3';
import { log } from '../../logger.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import * as configApi from '../../config.js';
import { parseFontSize } from '../../utils.js';
import { DrawDefinition } from '../../diagram-api/types.js';

/**
 * Draws a Pie Chart with the data given in text.
 *
 * @param text - pie chart code
 * @param id - diagram id
 */
let width;
const height = 450;
export const draw: DrawDefinition = (txt, id, _version, diagObj) => {
  try {
    const conf = configApi.getConfig();
    log.debug('Rendering info diagram\n' + txt);

    const securityLevel = configApi.getConfig().securityLevel;
    // Handle root and Document for when rendering in sandbox mode
    let sandboxElement;
    if (securityLevel === 'sandbox') {
      sandboxElement = select('#i' + id);
    }
    const root =
      securityLevel === 'sandbox'
        ? select(sandboxElement.nodes()[0].contentDocument.body)
        : select('body');
    const doc = securityLevel === 'sandbox' ? sandboxElement.nodes()[0].contentDocument : document;

    // Parse the Pie Chart definition
    diagObj.db.clear?.();
    diagObj.parser.parse(txt);
    log.debug('Parsed info diagram');
    const elem = doc.getElementById(id);
    width = elem.parentElement.offsetWidth;

    if (width === undefined) {
      width = 1200;
    }

    // @ts-ignore: TODO Fix ts errors
    if (conf.useWidth !== undefined) {
      // @ts-ignore: TODO Fix ts errors
      width = conf.useWidth;
    }
    if (conf.pie?.useWidth !== undefined) {
      width = conf.pie.useWidth;
    }

    const diagram = root.select('#' + id);
    // @ts-ignore: TODO Fix ts errors
    configureSvgSize(diagram, height, width, conf.pie.useMaxWidth);

    // Set viewBox
    elem.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    // Fetch the default direction, use TD if none was found
    const margin = 40;
    const legendRectSize = 18;
    const legendSpacing = 4;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = diagram
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // @ts-ignore: TODO Fix ts errors
    const data = diagObj.db.getSections();
    let sum = 0;
    Object.keys(data).forEach(function (key) {
      sum += data[key];
    });

    const themeVariables = conf.themeVariables;
    const myGeneratedColors = [
      themeVariables.pie1,
      themeVariables.pie2,
      themeVariables.pie3,
      themeVariables.pie4,
      themeVariables.pie5,
      themeVariables.pie6,
      themeVariables.pie7,
      themeVariables.pie8,
      themeVariables.pie9,
      themeVariables.pie10,
      themeVariables.pie11,
      themeVariables.pie12,
    ];

    const textPosition = conf.pie?.textPosition ?? 0.75;
    let [outerStrokeWidth] = parseFontSize(themeVariables.pieOuterStrokeWidth);
    outerStrokeWidth ??= 2;

    // Set the color scale
    const color = scaleOrdinal().range(myGeneratedColors);

    // Compute the position of each group on the pie:
    const pieData = Object.entries(data).map(function (el, idx) {
      return {
        order: idx,
        name: el[0],
        value: el[1],
      };
    });
    const pie = d3pie()
      // @ts-ignore: TODO Fix ts errors
      .value(function (d) {
        return d.value;
      })
      // @ts-ignore: TODO Fix ts errors
      .sort(function (a, b) {
        // Sort slices in clockwise direction
        return a.order - b.order;
      });
    const dataReady = pie(pieData);

    // Shape helper to build arcs:
    const arcGenerator = arc().innerRadius(0).outerRadius(radius);
    const labelArcGenerator = arc()
      .innerRadius(radius * textPosition)
      .outerRadius(radius * textPosition);

    svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius + outerStrokeWidth / 2)
      .attr('class', 'pieOuterCircle');

    // Build the pie chart: each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('mySlices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      // @ts-ignore: TODO Fix ts errors
      .attr('fill', function (d) {
        return color(d.data.name);
      })
      .attr('class', 'pieCircle');

    // Now add the percentage.
    // Use the centroid method to get the best coordinates.
    svg
      .selectAll('mySlices')
      .data(dataReady)
      .enter()
      .append('text')
      // @ts-ignore: TODO Fix ts errors
      .text(function (d) {
        return ((d.data.value / sum) * 100).toFixed(0) + '%';
      })
      // @ts-ignore: TODO Fix ts errors
      .attr('transform', function (d) {
        return 'translate(' + labelArcGenerator.centroid(d) + ')';
      })
      .style('text-anchor', 'middle')
      .attr('class', 'slice');

    svg
      .append('text')
      // @ts-ignore: TODO Fix ts errors
      .text(diagObj.db.getDiagramTitle())
      .attr('x', 0)
      .attr('y', -(height - 50) / 2)
      .attr('class', 'pieTitleText');

    // Add the legends/annotations for each section
    const legend = svg
      .selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      // @ts-ignore: TODO Fix ts errors
      .attr('transform', function (d, i) {
        const height = legendRectSize + legendSpacing;
        const offset = (height * color.domain().length) / 2;
        const horizontal = 12 * legendRectSize;
        const vertical = i * height - offset;
        return 'translate(' + horizontal + ',' + vertical + ')';
      });

    legend
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend
      .data(dataReady)
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      // @ts-ignore: TODO Fix ts errors
      .text(function (d) {
        // @ts-ignore: TODO Fix ts errors
        if (diagObj.db.getShowData() || conf.showData || conf.pie.showData) {
          return d.data.name + ' [' + d.data.value + ']';
        } else {
          return d.data.name;
        }
      });
  } catch (e) {
    log.error('Error while rendering info diagram');
    log.error(e);
  }
};

export default {
  draw,
};
