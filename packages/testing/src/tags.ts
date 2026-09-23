import {
  codeBlock as originalCodeBlock,
  createTag,
  splitStringTransformer,
  removeNonPrintingValuesTransformer,
  inlineArrayTransformer,
  stripIndent,
} from 'common-tags';
import { removeNonPrintingValuesTransformer } from 'common-tags/es/removeNonPrintingValuesTransformer/index.js';

export const codeBlock = createTag(
  splitStringTransformer('\n'),
  removeNonPrintingValuesTransformer(),
  inlineArrayTransformer(),
  stripIndent,
);
