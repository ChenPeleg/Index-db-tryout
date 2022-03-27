/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

import { DBOpenEvent, DBRecord, StoreName } from "./db-models";

export class DataBase {
    /**
     * 
     */
    private MAIN_DB_NAME = "TextValues";
    private readonly MAIN_STORE_NAME: StoreName = "Sites";
    private MANAGMENT_STORE_NAME = "manageDd";
    private mainStore: IDBObjectStore | null = null;
    private mainDb: IDBDatabase | null = null;
    private dbTransaction: IDBTransaction | null = null;
    private static instance: DataBase;
    private constructor() {
        console.log('db constractor');

        this.initDB().then((db) => {
            if (db instanceof Error) {
                this.dBError(db);
                return;
            }
            this.mainDb = db;
            //  console.log('this.dbTransaction', this.dbTransaction);

            // this.mainStore = db.objectStore(this.MAIN_STORE_NAME);

        }, (e) => {
            this.dBError(e)
        })
            ;
    }

    private initDB(): Promise<IDBDatabase | Error> {
        const openReq: IDBOpenDBRequest = window.indexedDB.open(this.MAIN_DB_NAME, 1);
        return new Promise<IDBDatabase | Error>((resolve, reject) => {
            openReq.addEventListener('success', (event: DBOpenEvent) => {
                const db: IDBDatabase | undefined = event?.target?.result;
                if (!db) {

                    reject(new Error('Error open request failed'))
                    return;
                }
                try {
                    // const trasaction: IDBTransaction = db.transaction(this.allStoreNames, 'readwrite');

                    resolve(db);
                } catch (e: any) {
                    reject(new Error(e.toString()))
                }


                //mainStore
                // mainStore.transaction.oncomplete = (event: Event) => {
                //     const transaction: IDBTransaction = db.transaction(this.MAIN_DB_NAME, 'readwrite');
                //     const mainStore: IDBObjectStore = transaction.objectStore(this.MAIN_DB_NAME)

                // }

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
        let e = error
        if (typeof error !== 'string') {
            e = error.toString();
        }
        throw new Error(e)

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
    private getTrasaction(): IDBTransaction | Error {

        if (!this.mainDb) {
            return new Error('No DB Object');
        }
        return this.mainDb.transaction(this.allStoreNames, 'readwrite');

    }
    private getStore(storeName: StoreName | undefined, transaction: IDBTransaction): IDBObjectStore | Error {
        if (!storeName) {
            storeName = this.MAIN_STORE_NAME;
        }
        if (!this.mainDb) {

            return new Error('No DB Object');
        }

        const store: IDBObjectStore = transaction.objectStore(storeName);
        return store;
    }
    public createObjectStoreOnUpgrade(db: IDBDatabase, storeName: string): void {
        if (db.objectStoreNames.contains(storeName)) {
            return;
        }
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }
    public add<R extends DBRecord>(record: R, storeName?: StoreName) {
        const transaction: IDBTransaction | Error = this.getTrasaction();
        if (transaction instanceof Error) {
            this.dBError(transaction);
            return;
        }
        const store = this.getStore(storeName, transaction);
        if (store instanceof Error) {
            this.dBError(store);
            return
        }
        if (!record.id) {
            record.id = this.newId;
        }
        const request: IDBRequest = store.add(record);
        transaction.commit();


    }

}