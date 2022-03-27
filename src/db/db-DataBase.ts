/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

import { DBOpenEvent } from "./db-models";

export class DataBase {
    /**
     * 
     */
    private MAIN_DB_NAME = "TextValues";
    private static instance: DataBase;
    private constructor() {
        console.log('db constractor')
        this.initDB();
    }
    private initDB() {
        const openReq: IDBOpenDBRequest = window.indexedDB.open(this.MAIN_DB_NAME, 1);
        console.log('openReq', openReq);
        openReq.addEventListener('success', (event: DBOpenEvent) => {
            const db: IDBDatabase | undefined = event?.target?.result;
            if (!db) {
                this.dBError('Error open request failed');
                return;
            }


            // mainStore.transaction.oncomplete = (event: Event) => {
            //     const transaction: IDBTransaction = db.transaction(this.MAIN_DB_NAME, 'readwrite');
            //     const mainStore: IDBObjectStore = transaction.objectStore(this.MAIN_DB_NAME)

            // }
            console.log('success');
        })
        openReq.addEventListener('upgradeneeded', (event: DBOpenEvent) => {
            const db: IDBDatabase | undefined = event?.target?.result;
            if (!db) {
                this.dBError('Error open request failed');
                return;
            }
            const mainStore: IDBObjectStore | null = db.createObjectStore('Sites', { keyPath: 'id', autoIncrement: true });
            console.log('upgradeneeded');
        })
        openReq.addEventListener('error', () => {
            this.dBError('Error open request failed');
        })

    }
    private dBError(error: any) {

    }
    public static get Instance(): DataBase {
        if (!DataBase.instance || true) {
            DataBase.instance = new DataBase();
        }
        return DataBase.instance;
    }
}