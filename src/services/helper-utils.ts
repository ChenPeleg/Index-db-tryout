export class HelperUtils {
    public static monkeyPatchConsoleLog = (): any => {
        const Log = console.log;
        console.log = (...args) => {
            Log(...args);
            setTimeout(_ => {
                const logger = document.getElementById('console-logger');
                if (!logger) {
                    return
                }
                logger.innerHTML += '\n' + args.toString();
            })
        }

    }
}