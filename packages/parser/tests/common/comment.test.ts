import { describe, expect, it } from 'vitest';

import { createPieTestServices, createTimelineTestServices } from '../test-utils.js';

describe('comments', () => {
  const { parse: pieParse } = createPieTestServices();
  const { parse: timelineParse } = createTimelineTestServices();

  describe('pie', () => {
    describe('single line', () => {
      it('should handle empty comment', () => {
        const context = `pie %%`;
        const result = pieParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });

      it('should handle regular comment', () => {
        const context = `pie %% comment`;
        const result = pieParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });
    });

    describe('multi line', () => {
      it('should handle empty comment', () => {
        const context = `pie %%**%%`;
        const result = pieParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });

      it('should handle regular comment', () => {
        const context = `pie %%*
        multi line comment
        *%%`;
        const result = pieParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });
    });
  });

  describe.todo('timeline', () => {
    describe('single line', () => {
      it('should handle empty comment', () => {
        const context = `timeline %%`;
        const result = timelineParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });

      it('should handle regular comment', () => {
        const context = `timeline %% comment`;
        const result = timelineParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });
    });

    describe('multi line', () => {
      it('should handle empty comment', () => {
        const context = `timeline %%**%%`;
        const result = timelineParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });

      it('should handle regular comment', () => {
        const context = `timeline %%*
        multi line comment
        *%%`;
        const result = timelineParse(context);
        expect(result.parserErrors).toHaveLength(0);
        expect(result.lexerErrors).toHaveLength(0);
      });
    });
  });
});
