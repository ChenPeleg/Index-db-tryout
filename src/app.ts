import { DomRender } from './services/dom-render';

import './style/style.main.scss'

class App {
    constructor() {

    }
    start() {
        const renderer = new DomRender();
        renderer.Message('App started 2')

    }


}

const app: App = new App();
app.start();