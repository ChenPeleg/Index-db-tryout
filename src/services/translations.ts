
import { dbAction } from '../models/db-actions.enumb';



export const translations: Partial<Record<string, string>> | any = {
    console: 'ניהול',
    open: 'פתח חדש',
    delete: 'מחק',
    view: 'צפייה',
    query: 'שאילתה',
    add: 'הוסף',
    success: {
        delete: 'המחיקה התבצעה בהצלחה!',
        view: 'הנתונים מוצגים בהצלחה!',
        query: 'השאילתה הופקה בהצלחה',
        add: 'הרשומה נוספה בהצלחה!',
    },
    details: 'פרטים: '

}