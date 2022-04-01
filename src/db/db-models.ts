import { dbAction } from "../models/db-actions.enumb";

export interface DBOpenEvent extends Event {
    target: (EventTarget & { result?: IDBDatabase | undefined }) | null | IDBOpenDBRequest
};
export interface DBRecord {
    id: string | number
};
export type StoreName = 'Sites' | 'Translations' | 'GeneralData' | 'nonExisting';
export interface IndexDBRequest {
    actionType: dbAction,
    storeName: StoreName,
    data: any
}
export type IndexDBResult<T, E = Error> =
    { actionRequested?: IndexDBRequest; success: true; data: T; error?: E } |
    { actionRequested?: IndexDBRequest; success: false; data?: T; error: E }

export enum IDBStaus { 'pending', 'error', 'success' }