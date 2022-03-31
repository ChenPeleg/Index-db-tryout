/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

import { dbAction } from "../models/db-actions.enumb";
import { DBOpenEvent, DBRecord, IDBStaus, IndexDBRequest, IndexDBResult, StoreName } from "./db-models";

export class DataBase {
    /**
     * @settings:
     * 
     */
    private static readonly Config = {
        mainDbName: "appDB",
        StoreNames: [],
        createIdIfMissing: false
    }
    private MAIN_DB_NAME = DataBase.Config.mainDbName;
    private readonly MAIN_STORE_NAME: StoreName = "Sites";
    private MANAGMENT_STORE_NAME = "manageDd";
    private mainStore: IDBObjectStore | null = null;
    private mainDb: IDBDatabase | null = null;
    private dbTransaction: IDBTransaction | null = null;
    private static instance: DataBase;
    private idbStatus: IDBStaus = IDBStaus.pending;
    public get dbStatus(): IDBStaus { return this.idbStatus };
    private constructor() {
        if (!('indexedDB' in window)) {
            console.warn('IndexedDB not supported')
            this.idbStatus = IDBStaus.error;
        } else {
            this.initDB().then(db => {
                this.mainDb = db as IDBDatabase;
                this.idbStatus = IDBStaus.success;
            }, (err) => {
                this.idbStatus = IDBStaus.error;
                this.dBError(err)
            });
        }

    }

    private initDB(): Promise<IDBDatabase | Error> {
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
            const trans = db.transaction(this.allStoreNames, 'readwrite');
            trans.onerror = e => rej(e);
            res(trans);

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
    private makeRequest<R extends DBRecord>(store: IDBObjectStore, reqType: dbAction, record: Partial<R>): Promise<IndexDBResult<IDBRequest | any>> {
        const requestForDebuging: IndexDBRequest = {
            type: dbAction.add,
            store: store.name,
            data: record
        }
        return new Promise((res, rej) => {


            const key: IDBValidKey | undefined = record.id;
            let request: IDBRequest;
            switch (reqType) {
                case dbAction.add:
                    if (!record.id) {
                        record.id = this.newId;
                    }
                    request = store.add(record);
                    break;
                case dbAction.delete:
                    if (!key) {
                        throw new Error("No key was found for delete")
                    }
                    request = store.delete(key);
                    break;
                case dbAction.clear:
                    request = store.clear();
                    console.log('cleared')
                    break;
                case dbAction.put:
                    if (!record.id) {
                        record.id = this.newId;
                    }
                    request = store.put(record);
                    break;
                case dbAction.get:
                    if (!key) {
                        throw new Error("No key was found for get")
                    }
                    request = store.get(key);
                    break;
                case dbAction.getAll:
                    request = store.getAll();
                    break;
                //  default:
                //   throw new Error("No proper action  type was found.  "  


            }


            request.onsuccess = (ev: Event) => {
                res({
                    actionRequested: requestForDebuging,
                    success: true,
                    data: request
                })
            }
            request.onerror = (ev: Event) => {
                rej({
                    request: requestForDebuging,
                    success: false, error: ev
                })
            }


        })

    }
    private createObjectStoreOnUpgrade(db: IDBDatabase, storeName: string): void {
        if (db.objectStoreNames.contains(storeName)) {
            return;
        }
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }
    public get defaultStore(): StoreName {
        return this.MAIN_STORE_NAME;
    }
    private indexDbAction<R>(actionParams: { db: IDBDatabase, storeName: StoreName, data: R, actionType: dbAction }): Promise<any> {
        const { db, storeName, data, actionType } = actionParams;

        return this.getTrasaction(db!)
            .then(trans => this.getStore(storeName, trans))
            .then((store: IDBObjectStore) => this.makeRequest(store, actionType, data))
            .then((res: IndexDBResult<IDBRequest>) => res
            )
            .catch(e => {
                console.error("Cought Error: ", e);
            });

    }
    public add<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.add,
            data: data,
            storeName: storeName
        })

    }

    public get<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.add,
            data: data,
            storeName: storeName
        })

    }
    public getAll<R extends DBRecord>(storeName: StoreName, data?: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.getAll,
            data: data || {},
            storeName: storeName
        })

    }
    public clear<R extends DBRecord>(storeName: StoreName, data?: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.clear,
            data: data || {},
            storeName: storeName
        })

    }
    public delete<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.delete,
            data: data,
            storeName: storeName
        })

    }
    public put<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            db: db,
            actionType: dbAction.put,
            data: data,
            storeName: storeName
        })

    }


}