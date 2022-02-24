
import { dbAction } from '../models/db-actions.enumb';



export const translations: Partial<Record<dbAction, string>> | any = {
    console: 'ניהול',
    open: 'פתח חדש',
    delete: 'מחק',
    view: 'צפייה',
    query: 'שאילתה',
    add: 'הוסף',

}