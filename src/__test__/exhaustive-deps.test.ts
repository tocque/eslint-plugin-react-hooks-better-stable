import { RuleTester } from 'eslint';
import casesJS from './cases-js';
import { it, describe } from 'vitest';
import exhaustiveDeps from '../rules/exhaustive-deps';

const parsers = [
  {
    name: 'eslint',
    parser: require('@babel/eslint-parser'),
    rule: exhaustiveDeps,
  },
  {
    name: 'typescript-eslint v8',
    parser: require('@typescript-eslint/parser'),
    rule: exhaustiveDeps,
  },
];

for (const { name, parser, rule } of parsers) {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  });

  ruleTester.run('exhaustive-deps', rule as any, casesJS);
}
