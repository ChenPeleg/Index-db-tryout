
import { dbAction } from '../models/db-actions.enumb';



export const translations: Partial<Record<string, string>> | any = {

    delete: 'מחק',
    put: 'עדכן',
    getAll: 'הצג הכל',
    get: 'שאילתה',
    add: 'הוסף',
    clear: 'נקה הכל',
    success: {
        delete: 'המחיקה התבצעה בהצלחה!',
        getAll: 'הנתונים מוצגים בהצלחה!',
        clear: 'הנתונים נמחקו בהצלחה!',
        query: 'השאילתה הופקה בהצלחה',
        add: 'הרשומה נוספה בהצלחה!',
    },
    details: 'פרטים: '

}