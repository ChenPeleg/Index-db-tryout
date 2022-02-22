import { PageBuilder } from './services/page-builder';

import './style/style.main.scss'

class App {
    constructor() {

    }
    start() {
        const renderer = new PageBuilder();
        renderer.Message('App started 2')

    }


}

const app: App = new App();
app.start();