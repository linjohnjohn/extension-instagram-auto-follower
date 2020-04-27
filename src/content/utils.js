export const fuzzNumber = (baseNumber, percentage = 20) => {
    const delta = Math.floor(baseNumber * (percentage / 100));
    const lowerBound = baseNumber - delta;
    return lowerBound + Math.floor(Math.random() * (2 * delta + 1));
}

export const waitThenDo = (fn, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                resolve(fn())
            } catch (err) {
                console.log(err)
            }
        }, delay)
    })
}

/**
 * executes a function and then waits a delay amount of time before
 * resolving that return of that execution in a Promise;
 * 
 * @param {*} fn 
 * @param {*} delay 
 */
export const doThenWait = (fn = () => {}, delay) => {
    return new Promise(async (resolve) => {
        let ret;
        try {
            ret = await fn();
        } catch (err) {
            console.log(err)
        }
        setTimeout(() => {
            resolve(ret)
        }, delay)
    })
}

export const repeatIfError = (fn, repeatTimeout = 1000) => {
    return new Promise(async (resolve) => {
        try {
            const ret = await fn();
            resolve(ret)
        } catch (err) {
            console.log(err)
            setTimeout(() => {
                resolve(repeatIfError(fn))
            }, repeatTimeout)
        }
    });
}

/**
 * executes a function fn and resolves the return value of that execution in a
 * Promise; if the execution fails then function execution is repeated for up to
 * limit times with a timeout in between each execution; if it still fails after
 * the limit then it will resolve the promise with null;
 *
 * @param {*} fn 
 * @param {*} limit 
 * @param {*} repeatTimeout milliseconds
 * @return a promise that resolves with the return value of the function execution 
 */
export const repeatIfErrorLimited = (fn, limit = 10, repeatTimeout = 1000) => {
    return new Promise(async (resolve) => {
        for (let i = 0; i < limit; i++) {
            try {
                const ret = await fn();
                resolve(ret);
                return;
            } catch (err) {
                console.log(err);
                await doThenWait(undefined, repeatTimeout)
            }
        }
        resolve(null);
    });
}