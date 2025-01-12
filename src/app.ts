import { HelperUtils } from './services/helper-utils';
import { PageBuilder } from './page/page-builder';
import './scripts/web-componenet-modal.js'
import './scripts/web-componenet-staus-indicator.ts'
import './scripts/web-cmp-screen-console.ts'
import './style/style.main.scss'
import { DataBase } from './db/db-DataBase';
import { translations } from './services/translations';
import { ExtendedError } from './errors/extended-error';
import { StoreName } from './db/db-models';


console.log('asdf');



class App {

    private db: DataBase;
    private inputText: string = "";
    private idInputText: string = "";
    private mainPage: PageBuilder | null = null;
    constructor() {
        this.db = DataBase.Instance;

    }
    private get idInInput(): number {
        const idInput = document.querySelector('#id-input-id') as HTMLInputElement;
        const value = +idInput.value || 0;
        return value;
    }

    private buttonClicked = (event: any) => {
        const getAllFunc = () => {
            this.db.getAll(this.db.defaultStore).then(res => {

                const results = res.data.result;
                const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                this.mainPage?.printRecords(results)
            }, (e) => {
                throw new ExtendedError(e)
            }).catch(e => this.errorHandler(e))
        }


        switch (event.detail.action) {
            case 'add':
                const newRand = Math.floor(Math.random() * 100)
                const data = this.inputText || 'new data';

                this.db.add(this.db.defaultStore, { data, id: this.idInInput }).then(res => {

                    const m = translations.success.add + ' ' + translations.details + ' Id: ' + res.actionRequested?.data.id;
                    this.mainPage?.showMessage(m);
                    getAllFunc();
                }).catch((e) => {
                    return this.errorHandler(e)
                })
                break;
            case 'put':


                const putid = this.idInInput;
                if (!putid) {
                    const m = translations.error.musthaveId;
                    this.mainPage?.showMessage(m);
                    return
                }
                const textput = this.inputText || 'new data';
                this.db.put(this.db.defaultStore, { data: textput, textput, id: putid }).then(res => {

                    const m = translations.success.put + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                    this.mainPage?.showMessage(m);
                    getAllFunc();
                }).catch(e => this.errorHandler(e))
                break;
            case 'delete':
                {
                    const idInput0 = document.querySelector('#id-input-id') as HTMLInputElement;
                    const deleteId = idInput0.value

                    if (!deleteId) {
                        const m = translations.error.musthaveId;
                        this.mainPage?.showMessage(m);
                        return
                    }

                    this.db.delete(this.db.defaultStore, { id: deleteId }).then(res => {

                        const m = translations.success.delete + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                        this.mainPage?.showMessage(m);
                        getAllFunc();
                    }).catch(e => this.errorHandler(e))

                }

                break;
            case 'getAll':
                getAllFunc();

                break;
            case 'get':
                {

                    const idInput0 = document.querySelector('#id-input-id') as HTMLInputElement;
                    const getId = idInput0.value

                    if (!getId) {
                        const m = translations.error.musthaveId;
                        this.mainPage?.showMessage(m);
                        return
                    }
                    const storeName: StoreName = this.db.defaultStore
                    this.db.get(storeName, { id: getId }).then(res => {

                        const m = translations.success.query + ' ' + translations.details + ' Id: ' + res.actionRequested.data.id;
                        const results = res.data.result;
                        console.log(results)
                        const resArr = Array.isArray(results) ? results : results ? [results] : []
                        this.mainPage?.showMessage(m);
                        this.mainPage?.printRecords(resArr)
                    }).catch(e => this.errorHandler(e))
                }

                break;
            case 'clear':
                this.db.clear(this.db.defaultStore).then(res => {
                    const results = res.data.result;
                    const m = translations.success.clear;
                    this.mainPage?.showMessage(m);
                    this.mainPage?.printRecords([])
                }).catch(e => this.errorHandler(e))

                break;
            case 'type-text':
                const textInput = event.detail.originalEvent?.target?.value;
                this.inputText = textInput || this.inputText;
                break;
            case 'clicked-list-item':
                const idInput = document.querySelector('#id-input-id') as HTMLInputElement;
                const itemId = event.detail.itemId;
                idInput.value = itemId;
                break;
            default:
                break;
        }
    }

    private errorHandler(originalErr: any): any {
        console.error(originalErr);
    }
    start() {
        HelperUtils.monkeyPatchConsoleLog();
        this.mainPage = new PageBuilder(this.buttonClicked);
        this.mainPage.render('');
        setTimeout((_: any) => {
            this.buttonClicked({
                detail: { action: 'getAll' }
            });
            setTimeout((_: any) => {
                const item = document.querySelector('.list-item-with-data-item-id');
                if (item) {
                    const idInput = document.querySelector('#id-input-id') as HTMLInputElement;
                    const itemId = item.getAttribute('data-item-id') || '';
                    idInput.value = itemId;
                }
            }, 200);
        }
            , 200)
    }



}


const app: App = new App();



app.start();