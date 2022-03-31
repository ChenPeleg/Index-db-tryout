
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
        const recordToString = <R extends object>(record: R): string => {
            const rec = JSON.stringify(record);
            const regex: RegExp = /["'{}]/g;
            return rec.replace(regex, " ");
        }
        const id = 'db-records';
        const recordsDiv = document.querySelector(`#${id}`);
        if (!recordsDiv) return
        let html = records.map(r => `<li data-item-id="${r.id}">${recordToString(r)}</li>`);
        recordsDiv.innerHTML = `<ol dir="ltr">${html}</ol>`;

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

        const idinput = document.createElement('input');
        idinput.id = 'id-input-id';
        idinput.placeholder = 'Id';
        idinput.addEventListener('input', (e) => {
            const ev = new CustomEvent('db_button', {
                detail: {
                    originalEvent: e,
                    action: 'id-type-text'
                }
            });
            controlPanelDiv.dispatchEvent(ev)
        })
        idinput.classList.add('db-action-input', 'db-action-id-input');
        controlPanelDiv.appendChild(idinput);


        const messageDiv = document.createElement('div');
        messageDiv.id = 'message-div-id';
        messageDiv.classList.add('db-message-div');
        controlPanelDiv.appendChild(messageDiv);

        controlPanelDiv.addEventListener('db_button', (e) => {
            this.#eventFunc(e)
        })
        const id = 'db-records';
        const recordsDiv = document.querySelector(`#${id}`);
        recordsDiv?.addEventListener('click', (e) => {
            const target = e.target as HTMLDListElement
            const itemId = target.getAttribute('data-item-id')
            console.log(itemId)
            const ev = new CustomEvent('db_button', {
                detail: {
                    originalEvent: e,
                    action: 'clicked-list-item',
                    itemId: itemId
                }
            });
            controlPanelDiv.dispatchEvent(ev)
        })



        return controlPanelDiv

    }

    #getRand(): string {
        return ' ' + EmojiHelper.randomImoji();
    }

}

