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
        div?.innerHTML ? div.innerHTML = 'works' : null;
        console.log('workds')
        //   alert(m)

    }

}

const rendere: DOMRender = new DOMRender();
rendere.alertMessage('alert message');