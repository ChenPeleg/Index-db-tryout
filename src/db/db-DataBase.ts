/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

import { DBOpenEvent, DBRecord, Result, StoreName } from "./db-models";

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
        this.initDB().then(db => {
            this.mainDb = db as IDBDatabase;
        }, (e) => {
            this.dBError(e)
        });
    }

    private initDB(): Promise<IDBDatabase | Error> {
        //const openReq: IDBOpenDBRequest = window.indexedDB.open(this.MAIN_DB_NAME, 1);
        return this.openDBRequest(this.MAIN_DB_NAME);

    }
    private openDBRequest(dbName: string): Promise<IDBDatabase | Error> {
        const openReq: IDBOpenDBRequest = window.indexedDB.open(dbName, 1);
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
    private getTrasaction(db: IDBDatabase): Promise<IDBTransaction> {
        return new Promise((res, rej) => {
            if (!db) {
                throw new Error('No DB Object');
            }
            res(db.transaction(this.allStoreNames, 'readwrite'));

        })

    }
    private getStore(storeName: StoreName | undefined, transaction: IDBTransaction): Promise<IDBObjectStore> {
        return new Promise((res, rej) => {
            if (!storeName) {
                storeName = this.MAIN_STORE_NAME;
            }
            if (!this.mainDb) {
                return new Error('No DB Object');
            }

            const store: IDBObjectStore = transaction.objectStore(storeName);
            res(store)

        })



    }
    private makeRequest<R extends DBRecord>(store: IDBObjectStore, reqType: 'add' | 'get', record: R): Promise<Result<any>> {
        return new Promise((res, rej) => {
            if (!record.id) {
                record.id = this.newId;
            }
            let request: IDBRequest;
            request = store.add(record);

            request.onsuccess = (ev: Event) => {
                res({
                    success: true,
                    data: request
                })
            }
            request.onerror = (ev: Event) => {
                rej({
                    success: false, error: ev
                })
            }


        })

    }
    public createObjectStoreOnUpgrade(db: IDBDatabase, storeName: string): void {
        if (db.objectStoreNames.contains(storeName)) {
            return;
        }
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }
    public add<R extends DBRecord>(record: R, storeName?: StoreName): void | Promise<any> {
        const db = this.mainDb;
        this.getTrasaction(db!)
            .then(trans => this.getStore(storeName, trans))
            .then((store: IDBObjectStore) => this.makeRequest(store, 'add', record))
            .then((res: Result<any>) => console.log(res))
            .catch(e => {
                console.error("Cought Error: ", e);
            });


    }

}