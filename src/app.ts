import { HelperUtils } from './services/helper-utils';
import { PageBuilder } from './page/page-builder';
import './scripts/web-componenet-modal.js'
import './scripts/web-componenet-staus-indicator.ts'
import './scripts/web-cmp-screen-console.ts'
import './style/style.main.scss'
import { DataBase } from './db/db-DataBase';
import { translations } from './services/translations';






class App {
    private db: DataBase;
    private inputText: string = "";
    private mainPage: PageBuilder | null = null;
    constructor() {
        this.db = DataBase.Instance;
    }

    private buttonClicked = (event: any) => {
        console.log(event.detail.action)
        switch (event.detail.action) {
            case 'add':
                const newRand = Math.floor(Math.random() * 100)
                const data = this.inputText || 'new data';
                const text = this.inputText || 'new data';
                this.db.add(this.db.defaultStore, { data, text, id: 0, randomNumber: newRand }).then(res => {
                    console.log(res)
                    const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                    this.mainPage?.showMessage(m)
                })
                break;
            case 'getAll':
                this.db.getAll(this.db.defaultStore).then(res => {
                    const results = res.data.result;
                    console.log(results)
                    const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                    this.mainPage?.printRecords(results)
                })

                break;
            case 'view':
                // this.db.get({ id: 30 })



                break;
            default:
                break;
        }
    }
    private showMessage(text: string) {

    }
    start() {
        HelperUtils.monkeyPatchConsoleLog();
        this.mainPage = new PageBuilder(this.buttonClicked);
        this.mainPage.render('');


    }


}
const app: App = new App();



app.start();