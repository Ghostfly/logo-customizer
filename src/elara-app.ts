import { html, CSSResult, property, query, customElement } from 'lit-element';

import Root from './core/strategies/Root';

import './pages/home';
import './atoms/index';

@customElement('elara-app')
export class ElaraApp extends Root {
	public static readonly is: string = 'elara-app';

	@query('svg.logo') logoPath!: SVGElement;

	@property({type: String, reflect: false, noAccessor: true})
	public logo: string;

	public theme: 'dark' | 'light' = 'light';

	private _onSchemeChangeListener: (e: CustomEvent<{colorScheme: 'dark' | 'light'}>) => void;

	public constructor(){
		super(); 

		this._onSchemeChangeListener = this._onSchemeChange.bind(this);
		this.hasElaraRouting = true;
	}

	public firstUpdated(){
		this.init();
	}

	public connectedCallback(){
		super.connectedCallback();
		document.addEventListener('colorschemechange', this._onSchemeChangeListener);
	}

	public disconnectedCallback(){
		super.disconnectedCallback();
		document.removeEventListener('colorschemechange', this._onSchemeChangeListener);
	}

	private _onSchemeChange(e: CustomEvent<{colorScheme: 'dark' | 'light'}>){
		this.theme = e.detail.colorScheme;

		if(this.theme === 'dark'){
			document.documentElement.style.setProperty('--mdc-theme-primary', 'var(--elara-font-color)');
			document.documentElement.style.setProperty('--elara-placeholder-background', 'rgba(165,165,165,.5)');
			document.documentElement.style.setProperty('--elara-background-color', '#373737');
			document.documentElement.style.setProperty('--elara-font-color', '#f0f0f0');
			document.documentElement.style.setProperty('--elara-font-hover', '#9e9e9e');
		} else {
			document.documentElement.style.setProperty('--mdc-theme-primary', 'var(--elara-primary)');
			document.documentElement.style.setProperty('--elara-placeholder-background', 'rgba(67, 84, 128, 0.5)');
			document.documentElement.style.removeProperty('--elara-background-color');
			document.documentElement.style.removeProperty('--elara-font-color');
			document.documentElement.style.removeProperty('--elara-font-hover');
		}
	}

	/**
	 * Bootstrap is launched by boot.js
	 * Could contains any kind of promise who will be handled by global promise loader
	 *
	 * @readonly
	 * @memberof ElaraApp
	 */
	public get bootstrap(){		
		return Promise.all([
			// import(/* webpackChunkName: "mwc" */'./mwc'),
		]);
	}

	public static get styles(): CSSResult[] {
		return [];
	}
	
	public render() {
		return html`
			<main id="main" class="content"></main>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'elara-app': ElaraApp;
	}
}