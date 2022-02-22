
import randomImoji from './randomImoji';


export class DomRender {
    constructor() {

    }
    public Message(m: string) {
        this.#displayMessage(m)
    }

    #displayMessage(m: string) {
        const div: Element | null = document.querySelector('#main-div-id');
        console.log(div)
        div ? div.innerHTML = m + ' ' + this.#getRand() : null;


        //  alert(m)

    }
    #getRand(): string {
        return '<br><br>' + randomImoji();
    }

}

