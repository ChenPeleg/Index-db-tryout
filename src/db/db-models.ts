export interface DBOpenEvent extends Event {
    target: (EventTarget & { result?: IDBDatabase | undefined }) | null | IDBOpenDBRequest
};
export interface DBRecord {
    id: string | number
};
export type StoreName = 'Sites' | 'Translations' | 'GeneralData';
// export interface Result {
//     success: boolean,
//     data: any
// }
export type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };