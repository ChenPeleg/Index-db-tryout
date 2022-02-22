import { PageBuilder } from './services/page-builder';

import './style/style.main.scss'

const monkeyPatchConsoleLog = () => {
    const Log = console.log;
    console.log = (...args) => {
        Log(...args);
        setTimeout(_ => {
            const logger = document.getElementById('console-logger');
            if (!logger) {
                return
            }
            logger.innerHTML += '\n' + args.toString();
        })
    }

}


class App {
    constructor() {

    }
    start() {
        const renderer = new PageBuilder();
        renderer.render('');
        console.log('asdfasdf')
        console.log('asdfasdf')
        console.log('asdfasdf')
        console.log('asdfasdf')
        console.log('asdfasdf')

    }


}
monkeyPatchConsoleLog();
const app: App = new App();
app.start();