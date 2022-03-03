import { WebComponentsUtils } from '../utils/web-cmp-utils';
import { CSS } from '../utils/css-types'
type Side = 'top' | 'bottom' | 'left' | 'right'
type LocationProp = Record<Side, (string)>;
type StatusType = 'ok' | 'error' | 'connecting'
interface ConsoleData {
  text?: string,
  log: unknown,
  pos?: number,
  showen?: boolean
}
class ScreenConsole extends HTMLElement {
  private readonly screenIdPrefix = 'grid-squer-'
  private consoleElement: HTMLElement;
  private consoleLogger: HTMLElement;
  private dataRows: ConsoleData[] = [];
  private MaxLogLength: number = 40;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.monkeyPatchConsoleLog();


    const backgroundColor = '#c5e6e3';
    const gradient1 = 'linear-gradient(90deg, rgba(87,212,233,1) 0%, rgba(144,212,230,1) 100%);'
    const shadowRoot: ShadowRoot = this.shadowRoot as ShadowRoot;
    const transitionDetails = '200ms ease-in-out'
    const cssObj: CSS = {
      "div#screen-console-div-id": {
        "position": 'fixed',
        top: '1px',
        "width": "30vw",
        "height": "30vw",
        "min-height": "10vw",
        "min-width": "10vw",
        "max-height": "90vw",
        "max-width": "40vw",
        "margin": "0px 20px",
        "padding": "10px",
        "font-family": 'consolas',
        "font-size": '14px',
        "display": "flex",
        "flex-direction": "column",
        "background-color": backgroundColor,
        "border-radius": "5px",

        'left': '1px',
        // "display": "inline-flex",

        "border": "2px solid grey",
        resize: 'both',
        overflow: 'auto',
        'transition': `top ${transitionDetails}, left ${transitionDetails}`,

      },
      '#screen-console-command-buttons': {
        display: 'flex',
        'min-width': '70px',
        'min-height': '50px',
        position: 'absolute',
        bottom: '0',
        right: '0',
        transition: "background-color 400ms ease-in-out"
      },
      '.command-buttons': {
        width: '40px',
        height: '40px',
        'line-height': '50%',
        "font-size": '22px',
        "font-weight": '550',
        color: 'black',
        'border-radius': '50%',
        'background-color': 'rgba(250,250,250,0.3)',
        'outline': 'none',
        'border': 'none',
        'margin-bottom': '4px',
        'transition': 'box-shadow 200ms ease-in-out',
        "box-shadow": '1px 1px 4px 6px rgba(0,0,0,0.05)'
      },
      '.command-buttons:hover': {
        "box-shadow": '1px 1px 7px 3px rgba(0,0,0,0.3)'
      },
      '.button-devider': {
        "min-height": '10px',
        "min-width": '10px'
      },
      '#console-logger': {
        overflow: 'auto',
        'max-height': '100%'
      },
      "#screen-console-locator": {
        display: 'grid',
        'grid-template-columns': 'auto auto auto',
        width: '120px',
        height: '50px',
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
    <div dir="ltr" id="screen-console-div-id">
      console 
      <div id="console-logger"></div> 
    
       <div id="screen-console-command-buttons">
       <button class="command-buttons" id="close-button">	&#10060;</button> 
             <div class="button-devider"></div>
             <button class="command-buttons" id="trash-button">&#128465;</button> 
             <div class="button-devider"></div>
             <button class="command-buttons" id="minify-button">_</button> 
             <div class="button-devider"></div>
       </div>  
      <div id="screen-console-locator">${gridOfDivs}</div> 
     
    </div>
    `

    const consoleLocators: NodeListOf<HTMLHtmlElement> | null = shadowRoot.querySelectorAll('.grid-locator-squer');
    if (consoleLocators) {
      consoleLocators.forEach((elem: HTMLElement) => {
        elem.addEventListener('click', this.clickedLocation.bind(this))
      })
    }
    this.consoleElement = shadowRoot.querySelector('#screen-console-div-id') as HTMLElement;
    this.consoleLogger = shadowRoot.querySelector('#console-logger') as HTMLElement;
    const deleteBtn = shadowRoot.querySelector('#trash-button') as HTMLElement;
    deleteBtn.addEventListener('click', this.clickedClear.bind(this))
    const closeBtn = shadowRoot.querySelector('#close-button') as HTMLElement;
    closeBtn.addEventListener('click', this.clickedClose.bind(this))
    const miniBtn = shadowRoot.querySelector('#minify-button') as HTMLElement;
    miniBtn.addEventListener('click', this.clickedMinify.bind(this))

  }
  clickedLocation(event: MouseEvent) {
    if (event?.target) {
      const elem = (<HTMLElement>event.target)
      const number = elem.id.replace(this.screenIdPrefix, '');
      const stl: LocationProp = this.getStyleFromNumber(Number(number));
      this.consoleElement.style.top = stl.top;
      this.consoleElement.style.bottom = stl.bottom;
      this.consoleElement.style.left = stl.left;
      this.consoleElement.style.right = stl.right;

    }
  }
  clickedClear(event: MouseEvent) {
    this.dataRows = [];
    this.showLogUpdateScreen(this.dataRows)

  }
  clickedClose(event: MouseEvent) {
    // this.dataRows = [];
    // this.showLogUpdateScreen(this.dataRows)

  }
  clickedMinify(event: MouseEvent) {
    // this.dataRows = [];
    // this.showLogUpdateScreen(this.dataRows)

  }
  private monkeyPatchConsoleLog(): void {
    const originalFN = window.console.log;
    if ((originalFN as any)['WAS_MANIPULATED']) {
      return
    }
    const patchedFN = (...args: any[]) => {
      originalFN(...args);
      this.showLogOnScreen(...args)
    };
    try {
      window.console.log = patchedFN;
      patchedFN['WAS_MANIPULATED'] = true
    } catch (e) {
      throw { message: 'cannot monkey patch console.log' }
    }


  }
  private showLogOnScreen(...args: any[]): void {
    const newDataRows = this.showLogupdateDataRows(...args);
    this.dataRows = this.dataRows.concat(newDataRows);
    this.showLogUpdateScreen(this.dataRows)
  }
  private showLogupdateDataRows(...args: any[]) {
    let formatedArgs: any[] = [];
    if (Array.isArray(args)) {
      formatedArgs = [...args]
    } else {
      formatedArgs = [args]
    }
    const newRows: ConsoleData[] = formatedArgs.map(f => {
      const rowData: ConsoleData = {
        log: f,
      }
      return rowData
    })
    return newRows



  }
  private showLogUpdateScreen(dataRows: ConsoleData[]) {
    console.dir(this.consoleLogger)
    if (!this.consoleLogger) {
      return
    }
    this.consoleLogger.innerHTML = this.showLogDataToString(dataRows)
  }
  private showLogDataToString(dataRows: ConsoleData[]): string {
    let HTML: string = '';
    dataRows.forEach((r: ConsoleData) => {
      r.text = '';//r.log.toString();
      switch (typeof r.log) {
        case 'number':
        case 'bigint':
          r.text = r.log.toString();
          break;
        case 'object':
          if (r.log)
            r.text = JSON.stringify(r.log).substring(0, this.MaxLogLength)
          else
            r.text = 'null'
          break;
        case 'boolean':
          r.text = r.log ? 'true' : 'false'
        case 'undefined':
          r.text = 'undefined'

      }

    })
    dataRows.forEach(r => {
      HTML += '<br><b>></b> ' + r.text;
    })
    return HTML
  }
  private getStyleFromNumber(number: number): LocationProp {
    const initialValue: string = 'initial';
    const initial: LocationProp = {
      bottom: initialValue,
      top: initialValue,
      left: initialValue,
      right: initialValue,
    }
    const extremeLeft = '70%'
    const extremeTop = '30%'
    switch (number) {
      case 1:
        return {
          ...initial,
          top: '1px', left: '1px'
        }; case 2:
        return {
          ...initial,
          top: '1px', left: '30%'
        }; case 3:
        return {
          ...initial,
          top: '1px', left: extremeLeft
        }; case 4:
        return { ...initial, top: '20%', left: '1px' };
        ; case 5:
        return {
          ...initial,
          top: '20%', left: '30%'
        }; case 6:
        return {
          ...initial,
          top: '20%', left: extremeLeft
        }; case 7:
        return {
          ...initial,
          top: extremeTop, left: '1px'
        }; case 8:
        return {
          ...initial,
          top: extremeTop, left: '30%'
        }
      case 9:
        return {
          ...initial,
          top: extremeTop, left: extremeLeft
        }



    }
    return initial
  }






}

customElements.define('screen-console', ScreenConsole);
