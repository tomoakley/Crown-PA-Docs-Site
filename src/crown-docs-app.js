import {Element as PolymerElement} from "../node_modules/@polymer/polymer/polymer-element.js";

import "../node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "../node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";
import "../node_modules/@polymer/app-layout/app-header/app-header.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";

import "./github-docs-list.js";

import GithubAPI from "./github-api.js";

const template = `
<style>
  :host {
    --app-drawer-width: 300px;
  }
  app-drawer {
    box-shadow: 1px 0 2px slategrey;
  }
  app-drawer-layout:not([narrow]) [drawer-toggle] {
    display: none;
  }
  app-header {
    font-weight: bold;
    color: white;
    background-color: limegreen;
    box-shadow: 0 1px 2px slategrey;
  }
  #spinner {
    width: 100%;
    height: 100vh;
  
    background-color: limegreen;
    opacity: 0;
    transition: opacity 0.3s;
    
    position: absolute;
  }
  #spinner.spin {
    opacity: 0.3;
    animation-delay: 0.3s;
    animation-duration: 1.5s;
    animation-name: fadeIn;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0.3
    }
    50% {
      opacity: 0.6
    }
    to {
      opacity: 0.3
    }
  }
</style>
<app-drawer-layout>
  <app-drawer slot="drawer">
    <github-docs-list on-open-doc="openDoc"></github-docs-list>
  </app-drawer>
  <app-header-layout>
    <app-header effects="waterfall">
      <app-toolbar>
        <paper-icon-button icon="crown-icons:menu" drawer-toggle></paper-icon-button>
        <div main-title>Docs for [[location]]</div>
      </app-toolbar>
    </app-header>
    <div id="spinner"></div>
    <div id="docs"></div>
  </app-header-layout>
</app-drawer-layout>
<iron-iconset-svg size="24" name="crown-icons">
<svg><defs>
<g id="menu"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g>
</defs></svg>
</iron-iconset-svg>`;

export class CrownDocsApp extends PolymerElement {
  
  static get template() {
    return template;
  }

  constructor() {
    super();
    
    this.github = new GithubAPI();
    this.github.user = 'tobyroworth';
    this.github.repo = 'LivingRoomPADocs';
  }
  
  ready() {
    super.ready();
  }

  static get properties() {
    return {
      location: {
        type: String
      }
    };
  }
  
  async openDoc(e) {
    this.$.spinner.classList.add('spin');
    let url = this.github.getContentsURL(e.detail.path);
    let response = await this.github.getFromGithub(url, 'HTML');
    this.$.docs.innerHTML = response;
    this.$.spinner.classList.remove('spin');
  }
}

customElements.define('crown-docs-app', CrownDocsApp);