import { repeatIfErrorLimited, doThenWait } from './utils';

const failedFunctionGenerator = (succeedsAfter) => {
    let executedCount = 0;
    return jest.fn(() => {
        if (executedCount >= succeedsAfter) {
            return 0;
        } else {
            executedCount++;
            throw Error();
        }
    })
}

describe('doThenWait', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    test(`it should execute the provided function and return its value after a given time`, async () => {
        const testFunction = failedFunctionGenerator(0);
        
        doThenWait(testFunction, 1000).then(value => {
            expect(value).toBe(0);
        });
        
        Promise.resolve().then(() => {
            expect(testFunction).toBeCalled();
            jest.advanceTimersByTime(1000);
            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        })
    })
})

describe('repeatIfErrorLimitedFunction', () => {
    beforeEach(() => {
        jest.useRealTimers();
    });
    
    test(`it should execute the provided function and return its value in a promise `, async () => {
        const testFunction = failedFunctionGenerator(0);
        const value = await repeatIfErrorLimited(testFunction);
        expect(value).toBe(0);
    });

    test(`it should repeat execution if fails by throwing an error`, async () => {
        const testFunction = failedFunctionGenerator(1);
        const value = await repeatIfErrorLimited(testFunction, 5, 0);
        expect(value).toBe(0);
    });

    test(`it should resolve with null if the execution fails more than a limit number of times`, async () => {
        const testFunction = failedFunctionGenerator(5);
        const value = await repeatIfErrorLimited(testFunction, 5, 0);
        expect(value).toBe(null);
    });
});