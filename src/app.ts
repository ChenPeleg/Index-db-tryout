class DOMRender {
    constructor() {

    }
    public alertMessage(m: string) {
        this.#alertMessage(m)
    }
    #render() {
        let s: string = 'asdf'
    }
    #alertMessage(m: string) {
        alert(m)

    }

}

const rendere: DOMRender = new DOMRender();
rendere.alertMessage('alert message');