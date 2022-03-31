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
    private idInputText: string = "";
    private mainPage: PageBuilder | null = null;
    constructor() {
        this.db = DataBase.Instance;
        if (this.db.dbStatus) {
            console.log('dbinit sccess!')
        } else {
            console.error('db not succesfull')
        }
    }

    private buttonClicked = (event: any) => {
        const getAllFunc = () => {
            this.db.getAll(this.db.defaultStore).then(res => {
                const results = res.data.result;
                console.log(results)
                const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                this.mainPage?.printRecords(results)
            })
        }

        console.log(event.detail)
        switch (event.detail.action) {
            case 'add':
                const newRand = Math.floor(Math.random() * 100)
                const data = this.inputText || 'new data';
                const text = this.inputText || 'new data';
                this.db.add(this.db.defaultStore, { data, text, id: 0, randomNumber: newRand }).then(res => {
                    console.log(res)
                    const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                    this.mainPage?.showMessage(m);
                    getAllFunc();
                })
                break;
            case 'put':
                const idInput0 = document.querySelector('#id-input-id') as HTMLInputElement;
                const putid = idInput0.value

                if (!putid) {
                    const m = translations.error.musthaveId;
                    this.mainPage?.showMessage(m);
                    return
                }
                const textput = this.inputText || 'new data';
                this.db.put(this.db.defaultStore, { data: textput, textput, id: putid }).then(res => {
                    console.log(res)
                    const m = translations.success.put + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                    this.mainPage?.showMessage(m);
                    getAllFunc();
                })
                break;
            case 'getAll':
                getAllFunc();

                break;
            case 'clear':
                this.db.clear(this.db.defaultStore).then(res => {
                    const results = res.data.result;
                    const m = translations.success.clear;
                    this.mainPage?.showMessage(m);
                    this.mainPage?.printRecords([])
                })

                break;
            case 'type-text':
                const textInput = event.detail.originalEvent?.target?.value;
                this.inputText = textInput || this.inputText;
                break;
            case 'clicked-list-item':
                const idInput = document.querySelector('#id-input-id') as HTMLInputElement;
                console.log(idInput)
                const itemId = event.detail.itemId;
                idInput.value = itemId;
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