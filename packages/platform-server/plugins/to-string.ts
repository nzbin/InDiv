import { InDiv } from '@indiv/core';
import { TRouter } from '@indiv/router';
import { _document } from '../renderer';
import { PlatformServer } from './platform-server';

/**
 * render a Indiv app to string
 *
 * @export
 * @param {InDiv} indiv
 * @param {string} [url]
 * @param {TRouter[]} [router]
 * @returns {Promise<string>}
 */
export async function renderToString(indiv: InDiv, url?: string, router?: TRouter[]): Promise<string> {
  indiv.use(PlatformServer);
  await indiv.init();
  // todo render
  const returnString = _document.getElementById('root').innerHTML;
  return returnString.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
