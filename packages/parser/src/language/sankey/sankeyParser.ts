import { AstNode, LangiumParser, ParseResult, createLangiumParser } from 'langium';

import { SankeyServices } from './sankeyModule.js';
import type { Sankey, SankeyLink } from '../generated/ast.js';

export function createSankeyParser(services: SankeyServices): LangiumParser {
  const parser: LangiumParser = createLangiumParser(services);
  const parse = parser.parse.bind(parser);
  parser.parse = <T extends AstNode = AstNode>(input: string): ParseResult<T> => {
    const parseResult: ParseResult<T> = parse(input);

    const sankeyValue: Sankey = parseResult.value as unknown as Sankey;

    const nodes: Set<string> = new Set<string>();
    sankeyValue.links.forEach((link: SankeyLink) => {
      if (!nodes.has(link.source)) {
        nodes.add(link.source);
      }
      if (!nodes.has(link.target)) {
        nodes.add(link.target);
      }
    });
    sankeyValue.nodes = [...nodes];

    return parseResult;
  };
  return parser;
}
