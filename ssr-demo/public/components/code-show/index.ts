import { Component, OnInit, HasRender, Input } from '@indiv/core';
import hljs from 'highlight.js';

@Component({
    selector: 'code-shower',
    template: (`
        <div nv-on:click="show()" class="code-show-container">
            <blockquote>
                <pre><code nv-class="type">{{codes}}</code></pre>
            </blockquote>
        </div>
    `),
})
export default class CodeShower implements OnInit, HasRender {
    @Input() public codes: string;
    @Input() public type: string;

    public nvOnInit() {
        this.type = this.type || 'typescript';
        if (!this.type) this.type = 'typescript';
    }

    public show() {
        console.log(this.codes);
    }

    public nvHasRender() {
        document.querySelectorAll('pre code').forEach((dom) => {
            hljs.highlightBlock(dom);
        });
    }
}
