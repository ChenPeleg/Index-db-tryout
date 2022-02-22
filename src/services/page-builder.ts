
import { dbAction } from '../models/db-actions.enumb';
import randomImoji from './randomImoji';
import { translations } from './translations';


export class PageBuilder {

    #eventFunc: (event: any) => void;

    constructor(eventFunc: (event: any) => void) {

        this.#eventFunc = eventFunc;
    }
    public render(m: string) {
        this.#renderScreen(m)
    }

    #renderScreen(m: string): HTMLElement {
        const controlPanelDiv: HTMLElement = document.querySelector('#main-div-id') as HTMLElement;

        const controlePanelText = translations.console;
        controlPanelDiv ? controlPanelDiv.innerHTML = `<div>${controlePanelText + this.#getRand()}</div>` + m + ' ' + '' : null;


        const dbActions = dbAction;
        for (const action in dbAction) {
            const button = document.createElement('button');
            const translationString = action
            const text = (translations[action]) || '' as string;
            button.innerHTML = text;
            button.id = action + '-button-id';
            button.addEventListener('click', (e) => {
                const ev = new CustomEvent('db_button', {

                    detail: {
                        originalEvent: e,
                        action: action
                    }
                });
                controlPanelDiv.dispatchEvent(ev)
            })

            button.classList.add('db-action-button');
            controlPanelDiv?.appendChild(button);
        }
        controlPanelDiv.addEventListener('db_button', (e) => {
            this.#eventFunc(e)
        })

        return controlPanelDiv

    }

    #getRand(): string {
        return ' ' + randomImoji();
    }

}
