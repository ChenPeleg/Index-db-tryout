export interface DBOpenEvent extends Event {
    target: (EventTarget & { result?: IDBDatabase | undefined }) | null | IDBOpenDBRequest
}