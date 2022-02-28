import { CSS, CSSObejct } from './css-types'

export class WebComponentsUtils {
    constructor() {

    }
    public static objectToCssString(obj: CSS): string {
        let s: string = '';
        for (const record in obj as CSS) {
            let r: string = `${record} {\n`;
            const onePropCollection = obj[record];
            for (let prop in onePropCollection) {
                const propValue: string = (onePropCollection as any)[prop];
                r += `  ${prop}: ${propValue.toString()};\n`
            }
            r += '}\n'
            s += r
        }
        return s
    }

}