
import { dbAction } from '../models/db-actions.enumb';



export const translations: Record<string, any> = {

    delete: 'מחק',
    put: 'עדכן',
    getAll: 'הצג הכל',
    get: 'שאילתה',
    add: 'הוסף',
    clear: 'נקה הכל',
    console: 'קונסולה',
    success: {
        delete: 'המחיקה התבצעה בהצלחה!',
        getAll: 'הנתונים מוצגים בהצלחה!',
        clear: 'הנתונים נמחקו בהצלחה!',
        put: 'הנתונים עודכנו בהצלחה!',
        query: 'השאילתה הופקה בהצלחה',
        add: 'הרשומה נוספה בהצלחה!',
    },
    error: {
        musthaveId: "⚠️" + 'יש לציין מספר מזהה '
    },
    details: 'פרטים: '

}