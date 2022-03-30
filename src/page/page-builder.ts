
import { dbAction } from '../models/db-actions.enumb';
import EmojiHelper from '../services/EmojiHelper';
import randomImoji from '../services/EmojiHelper';
import { translations } from '../services/translations';


export class PageBuilder {

    #eventFunc: (event: any) => void;

    constructor(eventFunc: (event: any) => void) {

        this.#eventFunc = eventFunc;
    }
    public render(m: string) {
        this.#renderScreen(m)
    }
    public showMessage(m: string) {
        this.#showMessage(m)
    }
    public printRecords(records: any[]) {
        const id = 'db-records';
        const recordsDiv = document.querySelector(`#${id}`);
        if (!recordsDiv) return
        let html = records.map(r => `<li>${r.id + " " + (r.name || '')}</li>`);
        recordsDiv.innerHTML = `<ol>${html}</ol>`
    }
    #showMessage(m: string) {
        const messageDiv = document.querySelector('#message-div-id');
        const html = `<div class="message-text">${m}</div>`
        if (!messageDiv) return;
        messageDiv.innerHTML = html;

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

        const input = document.createElement('input');

        input.id = 'text-input-id';
        input.addEventListener('input', (e) => {
            const ev = new CustomEvent('db_button', {
                detail: {
                    originalEvent: e,
                    action: 'type-text'
                }
            });
            controlPanelDiv.dispatchEvent(ev)
        })
        input.classList.add('db-action-input');
        controlPanelDiv.appendChild(input);
        const messageDiv = document.createElement('div');
        messageDiv.id = 'message-div-id';
        messageDiv.classList.add('db-message-div');
        controlPanelDiv.appendChild(messageDiv);
        controlPanelDiv.addEventListener('db_button', (e) => {
            this.#eventFunc(e)
        })

        return controlPanelDiv

    }

    #getRand(): string {
        return ' ' + EmojiHelper.randomImoji();
    }

}

