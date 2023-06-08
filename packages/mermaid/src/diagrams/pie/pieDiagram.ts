import { DiagramDefinition } from '../../diagram-api/types.js';
import db from './pieDb.js';
import styles from './styles.js';
import renderer from './pieRenderer.js';
import { parse } from './pieParser.js';

export const diagram: DiagramDefinition = {
  parser: {
    parser: { yy: {} },
    parse,
  },
  db,
  renderer,
  styles,
};
