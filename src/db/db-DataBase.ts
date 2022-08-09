/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

import { ExtendedError, ExtendedErrorOptions } from "../errors/extended-error";
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
        createIdIfMissing: false,
        IdsCanOnlyBeStrings: true
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
                console.info('upgradeneeded');
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
    private get newId(): number | string {
        const rng = 1000;
        let numId = Math.floor(Math.random() * rng);
        if (DataBase.Config.IdsCanOnlyBeStrings) {
            return numId.toString();
        }
        console.log([, 1, 1, 1]);
        return numId;


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
    private makeRequest<R extends DBRecord>(store: IDBObjectStore, reqType: dbAction, record: Partial<R>): Promise<IndexDBResult<IDBRequest, Error>> {
        const requestForDebuging: IndexDBRequest = {
            actionType: dbAction.add,
            storeName: store.name as StoreName,
            data: record,
        }
        return new Promise((res, rej) => {
            let key: IDBValidKey | undefined = record.id;
            if (DataBase.Config.IdsCanOnlyBeStrings && key && +key > 0) {
                key = key.toString();
            }
            let request: IDBRequest;
            switch (reqType) {
                case dbAction.add:
                    if (!record.id) {
                        record.id = this.newId;
                    } else if (DataBase.Config.IdsCanOnlyBeStrings) {
                        record.id = record.id.toString()
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

                    break;
                case dbAction.put:
                    if (!record.id) {
                        record.id = this.newId;
                    } else if (DataBase.Config.IdsCanOnlyBeStrings) {
                        record.id = record.id.toString()
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



            }


            request.onsuccess = (ev: Event) => {
                console.log('gotit', ev, request)
                res({
                    actionRequested: requestForDebuging,
                    success: true,
                    data: request
                })
            }
            request.onerror = (ev: Event) => {
                const err = new Error((ev as any)['target']['error']['message']);
                const errorEvent = { target: { error: err } }
                rej({
                    actionRequested: requestForDebuging,
                    success: false, error: errorEvent
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
    private indexDbAction<R>(actionParams: IndexDBRequest): Promise<IndexDBResult<IDBRequest, Error>> {
        const { storeName, data, actionType } = actionParams;
        return this.getTrasaction(this.mainDb!)
            .then(trans => this.getStore(storeName, trans))
            .then((store: IDBObjectStore) => this.makeRequest(store, actionType, data))
            .then((res: IndexDBResult<IDBRequest, Error>) => res
            ).catch((originalErr: Error | { actionRequested?: any; success: false; data?: any; error: Error }) => {
                let errorTothrow: Error | { actionRequested?: any; success: false; data?: any; error: Error } = originalErr;
                let extendedErr: { actionRequested?: any; success: false; data?: any; error: any };
                if (originalErr instanceof Error) {
                    extendedErr = {
                        success: false,
                        error: {
                            target: {
                                error: originalErr
                            }
                        },

                    }


                } else {
                    extendedErr = originalErr
                }
                try {
                    const errorEvent: any = extendedErr.error;
                    const onlyError: Error = errorEvent.target.error;
                    extendedErr = Object.assign(extendedErr, { actionRequested: actionParams })

                    extendedErr.actionRequested['dataBase'] = this.MAIN_DB_NAME;
                    const errorData = this.buildExtendedErrorData(extendedErr);
                    errorTothrow = new ExtendedError(onlyError, errorData);

                    throw errorTothrow
                } catch (e) {
                    throw errorTothrow
                }

            })


    }
    buildExtendedErrorData(data: IndexDBResult<IDBRequest, Error>): ExtendedErrorOptions {
        const extendedErrorOp: ExtendedErrorOptions = {};
        try {


            if (data.actionRequested) {
                const actionRequested: IndexDBRequest = data.actionRequested;
                const id = actionRequested.data?.id || '';
                const actionType = actionRequested.actionType;
                const store = actionRequested.storeName;
                let verb = 'from';
                switch (actionType) {
                    case "add":
                        verb = 'to'
                        break;
                    case "put":
                        verb = 'in'
                        break;
                    case "get":
                        verb = 'from'
                        break;
                    case "clear":
                        verb = ' '
                        break;
                }
                if (actionType === 'add' || 'put') {

                }
                const idData = id ? "id: " + id : ""
                extendedErrorOp.postMessage = ` ('${actionType}' ${verb} store '${store}' ${idData})`

            }
            const moreinfo: any = {}
            Object.keys(data).forEach(key => {

                if (key !== 'error') {
                    moreinfo[key] = (data as any)[key]
                }

            })
            extendedErrorOp.info = moreinfo
        } catch (e) {
            extendedErrorOp.info = {
                message: 'internal error in the buildExtendedErrorData function',
                err: e
            }
        }

        return extendedErrorOp
    }
    public add<R extends DBRecord>(storeName: StoreName, data: R): Promise<IndexDBResult<IDBRequest, Error>> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        const requestForDebuging: IndexDBRequest = {
            actionType: dbAction.add,
            storeName: storeName,
            data: data,
        }
        return this.indexDbAction({
            actionType: dbAction.add,
            data: data,
            storeName: storeName
        })

    }

    public get<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            actionType: dbAction.get,
            data: data,
            storeName: storeName
        })

    }
    public getAll<R extends DBRecord>(storeName: StoreName, data?: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            actionType: dbAction.getAll,
            data: data || {},
            storeName: storeName
        })

    }
    public clear<R extends DBRecord>(storeName: StoreName, data?: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            actionType: dbAction.clear,
            data: data || {},
            storeName: storeName
        })

    }
    public delete<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            actionType: dbAction.delete,
            data: data,
            storeName: storeName
        })

    }
    public put<R extends DBRecord>(storeName: StoreName, data: R): Promise<any> {
        const db: IDBDatabase = this.mainDb as IDBDatabase;
        return this.indexDbAction({
            actionType: dbAction.put,
            data: data,
            storeName: storeName
        })

    }


}