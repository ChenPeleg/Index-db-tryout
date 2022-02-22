
import { dbAction } from '../models/db-actions.enumb';
import randomImoji from './randomImoji';
import { translations } from './translations';


export class PageBuilder {
    constructor() {

    }
    public render(m: string) {
        this.#renderScreen(m)
    }

    #renderScreen(m: string) {
        const mainDiv: Element | null = document.querySelector('#main-div-id');
        const consola = translations.console;
        mainDiv ? mainDiv.innerHTML = `<div>${consola + this.#getRand()}</div>` + m + ' ' + '' : null;
        const button = document.createElement('button');
        button.innerHTML = translations.openDB
        button.classList.add('db-action-button');

        const dbActions = dbAction;
        for (const action in dbAction) {
            console.log(action)
        }

        mainDiv?.appendChild(button);



        //  alert(m)

    }
    #getRand(): string {
        return ' ' + randomImoji();
    }

}

