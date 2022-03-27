/**
 * @description This is a singelton DB, only one copy per app can be
 * produced.
 */

export class DataBase {
    /**
     * 
     */
    private static instance: DataBase;
    private constructor() {
        console.log('db constractor')

    }
    public static get Instance(): DataBase {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase();
        }
        return DataBase.instance;
    }
}