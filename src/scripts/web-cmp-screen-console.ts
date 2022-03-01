import { WebComponentsUtils } from '../utils/web-cmp-utils';
import { CSS } from '../utils/css-types'

type StatusType = 'ok' | 'error' | 'connecting'
class ScreenConsole extends HTMLElement {
  private readonly screenIdPrefix = 'grid-squer-'

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const backgroundColor = '#c5e6e3';
    const gradient1 = 'linear-gradient(90deg, rgba(87,212,233,1) 0%, rgba(144,212,230,1) 100%);'
    const shadowRoot: ShadowRoot = this.shadowRoot as ShadowRoot;
    const cssObj: CSS = {
      "div#screen-console-div-id": {
        "position": 'fixed',
        top: '100px',
        "width": "30vw",
        "min-height": "30vw",
        "margin": "0px 20px",
        "padding": "10px",
        "background-color": backgroundColor,
        "border-radius": "5px",
        "display": "inline-flex",
        "font-size": "17px",
        "border": "2px solid grey",
      },
      "#screen-console-locator": {
        display: 'grid',
        'grid-template-columns': 'auto auto auto',
        width: '200px',
        height: '100px',
        position: 'absolute',
        bottom: '0',
        left: '0',
        "border-radius": "5px",
        'background': gradient1,
        transition: "background-color 400ms ease-in-out"
      },
      'div.grid-locator-squer': {
        transition: "background-color 200ms ease-in-out",
        cursor: 'pointer',
        "border-radius": '10px'
      },
      'div.grid-locator-squer:hover': {
        "background": 'linear-gradient(90deg, rgba(202,87,233,1) 0%, rgba(238,8,156,1) 100%);'
      }
    }
    const cssAsStr: string = WebComponentsUtils.objectToCssString(cssObj)
    let gridOfDivs = '';
    for (let i = 1; i < 10; i++) {
      gridOfDivs += `<div class="grid-locator-squer" id="${this.screenIdPrefix}${i.toString()}"></div>`
    }
    shadowRoot.innerHTML = ` 
    <style>${cssAsStr}</style>
    <div id="screen-console-div-id">קונסולה <div id="console-logger"></div> 
    <div id="screen-console-locator">${gridOfDivs}</div> 
    </div>
    `
    const consoleLocators: NodeListOf<HTMLHtmlElement> | null = shadowRoot.querySelectorAll('.grid-locator-squer');
    if (consoleLocators) {
      consoleLocators.forEach((elem: HTMLElement) => {
        elem.addEventListener('click', this.clickedLocation.bind(this))
      })
    }

  }
  clickedLocation(event: MouseEvent) {
    if (event?.target) {
      const elem = (<HTMLElement>event.target)
      const number = elem.id.replace(this.screenIdPrefix, '');
      this.getStyleFromNumber(Number(number))

    }
  }
  private getStyleFromNumber(number: number): string {
    switch (number) {
      case 1:
        return 'top: 0; left:0'
      case 2:
        return 'top: 0; left:0'
      case 3:
        return 'top: 0; left:0'
      case 4:
        return 'top: 0; left:0'
      case 5:
        return 'top: 0; left:0'
      case 6:
        return 'top: 0; left:0'
      case 7:
        return 'top: 0; left:0'
      case 8:
        return 'top: 0; left:0'
      case 9:
        return 'top: 0; left:0'



    }
    return ''
  }



}

customElements.define('screen-console', ScreenConsole);
