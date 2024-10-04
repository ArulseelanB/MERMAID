import { describe, expect, it } from 'vitest';

import { Architecture } from '../src/index.js';
import { expectNoErrorsOrAlternatives, architectureParse as parse } from './test-util.js';

describe('architecture', () => {
  it.each([
    `architecture-beta`,
    `  architecture-beta  `,
    `\tarchitecture-beta\t`,
    `
    \tarchitecture-beta
    `,
  ])('should handle regular architecture-beta', (context: string) => {
    const result = parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Architecture);
  });

  it.each([
    `architecture-beta group api(cloud)[API]`,
    `  architecture-beta  group api(cloud)[API]  `,
    `\tarchitecture-beta\tgroup api(cloud)[API]\t`,
    `
    architecture-beta\tgroup api(cloud)[API]
    `,
  ])('should handle architecture-beta & group in same line', (context: string) => {
    const result = parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Architecture);

    const { groups } = result.value;
    expect(groups[0]).toBeTruthy();
  });

  it.each([
    `architecture-beta
    group api(cloud)[API]`,
    `architecture-beta
    group api(cloud)[API]
    `,
    `architecture-beta
    group api(cloud)[API]`,
    `architecture-beta
    group api(cloud)[API]
    `,
  ])('should handle architecture-beta + group in different line', (context: string) => {
    const result = parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Architecture);

    const { groups } = result.value;
    expect(groups[0].title).toBe('API');
  });

  it.each([
    `architecture-beta group api(cloud)[a.b-t]`,
    `architecture-beta group api(cloud)[user:password@some_domain.com]
    `,
  ])('should handle special character in a title', (context: string) => {
    const result = parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Architecture);

    const { groups } = result.value;
    expect(groups[0]).toBeTruthy();
  });
});
