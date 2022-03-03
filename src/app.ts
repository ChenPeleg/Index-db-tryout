import { HelperUtils } from './services/helper-utils';
import { PageBuilder } from './services/page-builder';
import './scripts/web-componenet-modal.js'
import './scripts/web-componenet-staus-indicator.ts'
import './scripts/web-cmp-screen-console.ts'
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
setTimeout(_ => {
    for (let i = 0; i < 20; i++) {
        console.log('asdfasdfasdfasdf')
    }
}, 2000)


app.start();