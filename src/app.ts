import { HelperUtils } from './services/helper-utils';
import { PageBuilder } from './services/page-builder';
import './scripts/web-componenet-modal.js'
import './scripts/web-componenet-staus-indicator.ts'
import './scripts/web-cmp-screen-console.ts'
import './style/style.main.scss'
import { DataBase } from './db/db-DataBase';






class App {
    private db: DataBase;
    constructor() {
        this.db = DataBase.Instance;
    }
    public buttonClicked = (event: any) => {
        console.log(event.detail)
        switch (event.detail.action) {
            case 'add':
                const newRand = Math.floor(Math.random() * 100)
                this.db.add({ name: "chen", id: 0, randomNumber: newRand })
                break;
            default:
                break;
        }
    }
    start() {
        HelperUtils.monkeyPatchConsoleLog();
        const renderer = new PageBuilder(this.buttonClicked);
        renderer.render('');


    }


}
const app: App = new App();



app.start();