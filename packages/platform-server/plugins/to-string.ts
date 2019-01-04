import { InDiv } from '@indiv/core';
import { _document } from '../renderer';
// todo
/**
 *
 *
 * @export
 * @param {string} url
 * @param {InDiv} indiv
 * @returns
 */
export function renderToString(url: string, indiv: InDiv) {
  const returnString = _document.getElementById('root').innerHTML;
  return returnString.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
