const Assert = require('assert');
const Bot = require('../Bot');

it('should run all analise actions', function() {
    let yieldCounter = 0;
    const expectedYieldCount = 10;
    const bot = new Bot({
        'start': {
            *beforeMessage() {
            },

            *analise() {
                yield () => yieldCounter += 2;
                yield () => yieldCounter += 3;
                yield () => yieldCounter += 5;
            }
        }
    });

    bot.message('');

    Assert.strictEqual(yieldCounter, expectedYieldCount, `All actions after message should be called (result: ${yieldCounter}/${expectedYieldCount})`);
});


it('should run all analise actions and beforeMessage actions', function() {
    let correctYieldCounter = 0;
    let incorrectYieldCounter = 0;

    const expectedYieldCount = 12;
    const bot = new Bot({
        'start': {
            *beforeMessage() {
                yield () => incorrectYieldCounter++;
            },

            *analise() {
                yield () => correctYieldCounter += 2;
                yield () => correctYieldCounter += 3;
                yield bot => bot.setState({
                    *beforeMessage() {
                        yield () => correctYieldCounter += 7;
                    },

                    *analise() {
                        yield () => incorrectYieldCounter++;
                    }
                });
            }
        }
    });

    bot.message('');

    Assert.strictEqual(incorrectYieldCounter, 0, `Some action has been called, but they should not (number: ${incorrectYieldCounter})`);
    Assert.strictEqual(correctYieldCounter, expectedYieldCount, `All actions after message should be called (result: ${correctYieldCounter}/${expectedYieldCount})`);
});