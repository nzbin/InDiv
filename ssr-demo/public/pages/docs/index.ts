import { Component } from '@indiv/core';
import { RouteChange } from '@indiv/router'


@Component({
  selector: 'docs-container',
  template: (`
      <div class="page-container">
        <router-render></router-render>
      </div>
  `),
})
export default class DocsContainer implements RouteChange {
  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    console.log('DocsContainer nvRouteChange', lastRoute, newRoute);
  }
}
