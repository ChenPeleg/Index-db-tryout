import { HelperUtils } from './services/helper-utils';
import { PageBuilder } from './services/page-builder';
import './scripts/web-componenet-modal.js'

import './style/style.main.scss'




class App {
    constructor() {

    }
    public buttonClicked = (event: any) => {
        console.log(event.detail)
    }
    start() {
        HelperUtils.monkeyPatchConsoleLog();
        const renderer = new PageBuilder(this.buttonClicked);
        renderer.render('');

    }


}
const app: App = new App();
app.start();