import randomImoji from './services/randomImoji';
import './style/style.main.scss'

class DOMRender {
    constructor() {

    }
    public alertMessage(m: string) {
        this.#alertMessage(m)
    }
    #render() {
        let s: string = 'asdf';


    }
    #alertMessage(m: string) {
        const div: Element | null = document.querySelector('#main-div-id');
        console.log(div)
        div ? div.innerHTML = 'this works 4' + this.#getRand() : null;


        //  alert(m)

    }
    #getRand(): string {
        return '<br><br>' + randomImoji();
    }

}

const rendere: DOMRender = new DOMRender();
rendere.alertMessage('alert message');