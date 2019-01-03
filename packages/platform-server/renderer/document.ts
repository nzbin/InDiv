import { JSDOM } from 'jsdom';

export const _document = (new JSDOM('')).window.document;
