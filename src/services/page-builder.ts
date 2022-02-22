
import randomImoji from './randomImoji';
import { translations } from './translations';


export class PageBuilder {
    constructor() {

    }
    public Message(m: string) {
        this.#displayMessage(m)
    }

    #displayMessage(m: string) {
        const div: Element | null = document.querySelector('#main-div-id');
        const consola = translations.console;
        div ? div.innerHTML = `<div>${consola + this.#getRand()}</div>` + m + ' ' + '' : null;


        //  alert(m)

    }
    #getRand(): string {
        return ' ' + randomImoji();
    }

}

