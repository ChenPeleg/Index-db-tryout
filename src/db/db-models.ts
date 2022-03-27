export interface DBOpenEvent extends Event {
    target: (EventTarget & { result?: IDBDatabase | undefined }) | null | IDBOpenDBRequest
};
export interface DBRecord {
    id: string | number
};
export type StoreName = 'Sites' | 'Translations' | 'GeneralData';
