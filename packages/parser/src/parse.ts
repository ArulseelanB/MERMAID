import type { LangiumParser, ParseResult } from 'langium';
import type { Info, Sankey } from './index.js';
import { createInfoServices, createSankeyServices } from './language/index.js';

export type DiagramAST = Info | Sankey;

const parsers: Record<string, LangiumParser> = {};

const initializers = {
  info: () => {
    // Will have to make parse async to use this. Can try later...
    // const { createInfoServices } = await import('./language/info/index.js');
    const parser = createInfoServices().Info.parser.LangiumParser;
    parsers['info'] = parser;
  },
  sankey: () => {
    const parser = createSankeyServices().Sankey.parser.LangiumParser;
    parsers['sankey'] = parser;
  },
} as const;

export function parse(diagramType: 'info', text: string): Info;
export function parse(diagramType: 'sankey', text: string): Sankey;
export function parse<T extends DiagramAST>(
  diagramType: keyof typeof initializers,
  text: string
): T {
  const initializer = initializers[diagramType];
  if (!initializer) {
    throw new Error(`Unknown diagram type: ${diagramType}`);
  }
  if (!parsers[diagramType]) {
    initializer();
  }
  const parser: LangiumParser = parsers[diagramType];
  const result: ParseResult<T> = parser.parse<T>(text);
  if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
    throw new MermaidParseError(result);
  }
  return result.value;
}

export class MermaidParseError extends Error {
  constructor(public result: ParseResult<DiagramAST>) {
    const lexerErrors: string = result.lexerErrors.map((err) => err.message).join('\n');
    const parserErrors: string = result.parserErrors.map((err) => err.message).join('\n');
    super(`Parsing failed: ${lexerErrors} ${parserErrors}`);
  }
}
