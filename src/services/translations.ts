
import { dbAction } from '../models/db-actions.enumb';
import randomImoji from './randomImoji';


export const translations: Partial<Record<dbAction, string>> | any = {
    console: 'ניהול',
    open: 'פתח חדש',
    delete: 'מחק',
    view: 'צפייה',
    query: 'שאילתה',
    add: 'הוסף',

}