import { html, TemplateResult } from 'lit-html';
import { css, customElement, query, queryAll, property } from 'lit-element';
import Canvg from 'canvg';

import '@material/mwc-icon';
import '@material/mwc-button';

import Page from '../core/strategies/Page';
import { fadeWith } from '../core/animations';

@customElement('ui-home')
export class HomeController extends Page {
    public static get styles(){
        return [
            ... super.styles,
            css`
            @use "@material/elevation/mdc-elevation";

            .page {
                display: grid;
                grid-gap: 1rem;
                height: calc(100vh - 15px);
                padding: 5px;
            }

            @media (min-width: 600px) {
                .page { grid-template-columns: 2fr 1fr; }
            }

            svg {
                min-width: 200px;
                max-width: 90vw;
            }

            .scene {
                position: relative;
                padding: 1em;
            }

            .field {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 5px;
                width: calc(100% - 15px);
            }

            .field.right {
                justify-content: flex-end;
            }

            .controls {
                position: relative;
                padding: 0 20px;
                margin: -10px;

                display: flex;
                flex-direction: column;
                align-items: flex-start;

                background-color: #808080;
                color: white;
            }
            
            .controls > .status {
                position: absolute;
                width: calc(100% - 22px);
                bottom: 10px;

                display: flex;
                align-items: flex-start;
                flex-direction: column;
            }

            .controls > .status > .item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            [data-object]{
                transition: fill .3s;
            }

            .controls-title {
                display: flex;
                width: 100%;
                justify-content: flex-end;
            }

            .my-location {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
            }

            .render-container {
                position: relative;
            }

            .render-container mwc-icon {
                position: absolute;
                bottom: 0;
                right: 0;
            }
            `
        ];
    }

    @query('#hoverColorSelector')
    public hoverColorSelector: HTMLInputElement;

    @query('.current-field-color')
    public currentFieldColorSelector: HTMLInputElement;

    @query('svg#object')
    public scene: SVGElement;

    @queryAll('[data-object]')
    public objects: NodeListOf<SVGElement>;

    @property({type: Object, reflect: false})
    public hoveredObject: SVGGElement;
    @property({type: Object, reflect: false})
    public hoveredChild: SVGPathElement | SVGPolygonElement;

    @property({type: Object, reflect: false})
    public selectedObject: SVGGElement;
    @property({type: Object, reflect: false})
    public selectedChild: SVGPathElement | SVGPolygonElement;

    @property({type: String, reflect: false})
    private _hoverColor = 'rgb(255, 192, 203)';
    @property({type: String, reflect: false})
    private _currentSelectedColor: string;

    @property({type: Date, reflect: false})
    private _renderTime: Date;
    @property({type: String, reflect: false})
    private _renderURL: string;

    private _sceneListener = this._onSceneLeaved.bind(this);
    private _enterListener = this._onObjectEnter.bind(this);
    private _clickListener = this._onObjectClick.bind(this);

    public firstUpdated(){
        this.scene.addEventListener('mouseleave', this._sceneListener);
        for(const logoObject of Array.from(this.objects)){
            logoObject.addEventListener('mouseover', this._enterListener);
            logoObject.addEventListener('click', this._clickListener);
        }
    }

    private _onSceneLeaved(_e: Event){
        if(this.hoveredChild){
            this.hoveredChild.style.fill = null;
        }
        
        this.hoveredChild = null;
        this.hoveredObject = null;
    }
    private _onObjectEnter(e: Event){
        const ancestor = e.currentTarget as SVGPathElement;
        const target = e.target as SVGPathElement;

        if(this.selectedChild !== target && (!target.style.fill || target.style.fill == this._hoverColor)){
            target.style.fill = this._hoverColor;
        }

        if(this.hoveredChild === target){
            return;
        }

        if(this.hoveredChild){
            this._resetHoverStatus();
        }

        this.hoveredObject = ancestor;
        this.hoveredChild = target;
    }

    private _resetHoverStatus(){
        const previous = this.hoveredChild;
        if(previous.style.fill === this._hoverColor){
            previous.style.fill = null;
        }
    }

    private _onObjectClick(e: Event){
        const ancestor = e.currentTarget as SVGPathElement;
        const target = e.target as SVGPathElement;

        this.selectedObject = ancestor;
        this.selectedChild = target;

        if(this.hoveredChild){
            this._resetHoverStatus();
        }

        this._currentSelectedColor = getComputedStyle(this.selectedChild).fill;
        const rgb = this._currentSelectedColor.replace('rgb(', '').replace(')', '').split(',').map(c => parseInt(c, 10));
        if(rgb.length === 3){
            this._currentSelectedColor = this._rgbToHex(rgb[0], rgb[1], rgb[2]);
        }

        this.hoveredObject = null;
        this.hoveredChild = null;
     }

     public _rgbToHex(r: number, g: number, b: number){
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
     }

    public render(): void | TemplateResult {
        return html`
        <div id="page" class="page" role="main">
            <div class="scene">
                <svg id="object" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.08 46.78">
                    <defs><style>.text { fill: #003865; }</style></defs>

                    <g data-object="Logotype">
                        <path data-child="B" d="M79.82,44.52h3.5c2.85,0,4.53,1.06,4.53,3.38a3,3,0,0,1-2.45,3V51c2,.3,3.3,1.43,3.3,3.36,0,2.67-1.91,4.05-5.11,4.05H79.82Zm3.12,6.1c2.84,0,4-.91,4-2.68s-1.24-2.58-3.84-2.58H80.78v5.26Zm.4,7c2.81,0,4.4-1,4.4-3.21,0-2-1.57-2.93-4.4-2.93H80.78v6.14Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="e" d="M93.73,53.37a5.06,5.06,0,0,1,5-5.33c2.76,0,4.51,1.78,4.51,4.69a5,5,0,0,1-.05.77h-9v-.79h8.64l-.39.37c0-2.87-1.49-4.24-3.65-4.24a4.2,4.2,0,0,0-4.11,4.5,4.24,4.24,0,0,0,4.42,4.52,5.73,5.73,0,0,0,3.38-1.09l.39.71A6.54,6.54,0,0,1,99,58.67,5.08,5.08,0,0,1,93.73,53.37Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="s" d="M108.54,57.07l.49-.68a6.89,6.89,0,0,0,4.57,1.48c2.05,0,3.11-.93,3.11-2,0-.91-.36-1.65-3.56-2.29-2.55-.52-4-1.35-4-2.84s1.24-2.7,3.94-2.7a7,7,0,0,1,3.87,1.25l-.5.67A5.69,5.69,0,0,0,113,48.84c-2.2,0-2.9.89-2.9,1.84s1,1.61,3.32,2.08c3.48.74,4.26,1.55,4.26,3.05s-1.51,2.86-4.17,2.86A8.57,8.57,0,0,1,108.54,57.07Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="t" d="M126.24,54.63V49.11h-3v-.73l3.07-.09.12-3.35h.79v3.35h5.36v.82h-5.36V54.7c0,2,.56,3.15,2.81,3.15a7,7,0,0,0,2.68-.52l.26.72a8,8,0,0,1-3.07.62C127.08,58.67,126.24,57,126.24,54.63Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="L" d="M144.35,44.67h2V56.61h6.31v1.77h-8.3Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="o" d="M156.94,53.28c0-3.42,2.3-5.38,4.87-5.38s4.87,2,4.87,5.38-2.29,5.35-4.87,5.35S156.94,56.67,156.94,53.28Zm7.7,0c0-2.2-1.1-3.67-2.83-3.67S159,51.08,159,53.28s1.1,3.64,2.83,3.64S164.64,55.47,164.64,53.28Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="d" d="M170.94,53.28c0-3.33,2.1-5.38,4.36-5.38a3.88,3.88,0,0,1,2.82,1.25h0l-.09-1.8V43.54h2V58.38h-1.63l-.16-1.27h-.06a4.46,4.46,0,0,1-3.07,1.52C172.62,58.63,170.94,56.68,170.94,53.28Zm7.13,2.25V50.69a3.2,3.2,0,0,0-2.32-1c-1.52,0-2.77,1.38-2.77,3.62s1,3.63,2.62,3.63A3.21,3.21,0,0,0,178.07,55.53Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="g" d="M185.15,60.22A2.71,2.71,0,0,1,186.73,58v-.08a1.89,1.89,0,0,1-1-1.7,2.53,2.53,0,0,1,1.17-1.92v-.08a3.27,3.27,0,0,1-1.23-2.65,3.68,3.68,0,0,1,3.93-3.67,4,4,0,0,1,1.49.25h4v1.63h-2.38a3,3,0,0,1,.72,1.87c0,2.23-1.7,3.49-3.85,3.49a4.26,4.26,0,0,1-1.57-.33,1.27,1.27,0,0,0-.68,1.06c0,.74.69,1.08,1.94,1.08h2.09c2.53,0,3.79.69,3.79,2.45,0,2-2.16,3.6-5.54,3.6C186.86,63,185.15,62,185.15,60.22Zm8.09-.49c0-.88-.71-1.12-2.1-1.12h-1.73a5.35,5.35,0,0,1-1.49-.16,1.78,1.78,0,0,0-1.1,1.52c0,1,1.07,1.59,3,1.59S193.24,60.69,193.24,59.73Zm-1.59-8.16a2.06,2.06,0,1,0-2.05,2.24A2.06,2.06,0,0,0,191.65,51.57Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="e" d="M199.1,53.25a5.06,5.06,0,0,1,5-5.35c2.86,0,4.5,2,4.5,4.83a7.94,7.94,0,0,1-.09,1.13h-8.05V52.33h6.8l-.43.51c0-2.21-1-3.32-2.68-3.32s-3.11,1.32-3.11,3.73,1.5,3.75,3.6,3.75a5.18,5.18,0,0,0,2.86-.9l.7,1.32a6.75,6.75,0,0,1-3.81,1.21A5.07,5.07,0,0,1,199.1,53.25Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="r" d="M214.56,48.15h1.65l.17,2.37h.05a5,5,0,0,1,4.26-2.62,4,4,0,0,1,1.92.42l-.44,1.77a4.75,4.75,0,0,0-1.79-.33c-1.4,0-2.75.75-3.83,2.82v5.8h-2Z" transform="translate(-22.53 -25.25)" />
                    </g>

                    <g data-object="Pictogram">
                        <path data-child="B" d="M50.16,46.59c-5.41,0-8.13,2.7-9.42,9.45H40.5c-4-10.47-18-7.88-18,6V72h39V61.22C61.53,52.08,56.57,46.59,50.16,46.59ZM39.53,70h-15V63.66C24.46,48,40.21,48.37,39.53,64Zm19,0h-17V62.86c0-18.26,17-17.92,17,0Z" transform="translate(-22.53 -25.25)" />
                        <polygon data-child="L" points="11.27 0 0 19.53 1.99 20.68 11.98 3.38 43.08 21.34 44.37 19.11 11.27 0" />
                        <path data-child="left-eye" d="M35.48,64.89c-.65,0-1,.45-1,1.18v1.72a1.28,1.28,0,0,0,2,0V66.07A1,1,0,0,0,35.48,64.89Z" transform="translate(-22.53 -25.25)" />
                        <path data-child="right-eye" d="M54.52,64.89a1,1,0,0,0-1,1.18v1.72a1.28,1.28,0,0,0,2,0V66.07A1,1,0,0,0,54.52,64.89Z" transform="translate(-22.53 -25.25)" />
                    </g>
                </svg>
            </div>
            <div class="controls mdc-elevation--z1">
                <h4 class="controls-title">Editeur</h4>
                ${this.selectedObject ? html`
                <h3 class="my-location"><mwc-icon>my_location</mwc-icon> ${this.name(this.selectedObject, this.selectedChild)}</h3>
                <div class="field">
                    <label>Couleur</label>
                    <input class="current-field-color" type="color" .value=${this._currentSelectedColor} @change=${() => {
                        this._currentSelectedColor = this.currentFieldColorSelector.value;
                        this.selectedChild.style.fill = this._currentSelectedColor;
                    }} />
                </div>
                ` : html``}

                <div class="field right">
                    <mwc-button raised toggles label="Générer" @click=${() => { this._dump(); }}></mwc-button>
                </div>

                ${this._renderTime ? html`
                Rendu
                ` : html``}
                <div class="render-container">
                    <canvas id="dump"></canvas>
                    ${this._renderURL ? html`<a class="button" .href="${this._renderURL}" download="best-lodger-${this._renderTime.getTime()}.png"><mwc-icon>save</mwc-icon></a>`: html``}
                </div>

                <div class="status">
                    ${this.hoveredChild !== this.selectedChild ? html`
                        <span class="item">${this.hoveredObject ? html`<mwc-icon>mouse</mwc-icon> ${this.name(this.hoveredObject, this.hoveredChild)}` : html``}</span>
                    ` : html``}
                    <span class="item">${this.selectedObject ? html`<mwc-icon>check</mwc-icon> ${this.name(this.selectedObject, this.selectedChild)}` : html``}</span>
                </div>
            </div>
        </div>
        `;
    }

    private async _dump(){
        const canvas = this.shadowRoot.querySelector('canvas#dump') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        this._renderTime = new Date();
        
        const v = await Canvg.from(ctx, this.scene.outerHTML);
        await v.render();

        this._renderURL = canvas.toDataURL('image/png');

        const fade = fadeWith(300, true);

        canvas.animate(fade.effect, fade.options);
    }

    private name(item: SVGGElement, child: SVGPathElement | SVGPolygonElement){
        return html`${item.getAttribute('data-object')} : ${child.getAttribute('data-child')}`;
    }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-home': HomeController;
	}
}