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
    private MAIN_STORE_NAME = "Sites";
    private MANAGMENT_STORE_NAME = "manageDd";
    private static instance: DataBase;
    private constructor() {
        console.log('db constractor')
        this.initDB().then((db) => {
            if (db instanceof Error) {
                this.dBError(db);
            }

        }, (e) => {
            this.dBError(e)
        });
    }
    private initDB(): Promise<IDBDatabase | Error> {
        const openReq: IDBOpenDBRequest = window.indexedDB.open(this.MAIN_DB_NAME, 1);
        return new Promise<IDBDatabase | Error>((reject, resolve) => {
            openReq.addEventListener('success', (event: DBOpenEvent) => {
                const db: IDBDatabase | undefined = event?.target?.result;
                if (!db) {

                    reject(new Error('Error open request failed'))
                    return;
                }
                try {
                    const trasaction: IDBTransaction = db.transaction(this.allStoreNames, 'readwrite')
                    resolve(trasaction);
                    const mainStore: IDBObjectStore = trasaction.objectStore(this.MAIN_STORE_NAME);
                    const request = mainStore.add({ id: this.newId, Name: 'chen', Age: '40' })

                } catch (e: any) {
                    reject(new Error(e.toString()))
                }


                //mainStore
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
                this.createObjectStoreOnUpgrade(db, this.MAIN_STORE_NAME)
                this.createObjectStoreOnUpgrade(db, this.MANAGMENT_STORE_NAME)
                console.log('upgradeneeded');
            })
            openReq.addEventListener('error', () => {
                this.dBError('Error open request failed');
            })


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
    private get allStoreNames(): string[] {
        const allNames: string[] = [this.MAIN_STORE_NAME, this.MANAGMENT_STORE_NAME];
        return allNames;
    }
    private get newId(): number {
        const rng = 100000
        return Math.floor(Math.random() * rng);

    }
    public createObjectStoreOnUpgrade(db: IDBDatabase, storeName: string): void {
        if (db.objectStoreNames.contains(storeName)) {
            return;
        }
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }

}