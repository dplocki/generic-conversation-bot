const Bot = require('../../Bot');
const MoveNextState = require('../../states/MoveNextState');
const { jumpToState, endConversation } = require('../../actions');
const { assertBotResponse } = require('../utils');

it('should move to next state no matter the message', function() {
    const textA = 'Hello, you are on beginning';
    const textB = 'You are on B';
    const textC = 'You are on C';

    const bot = new Bot({
        'start': new MoveNextState({ text: textA, actions: [jumpToState('first')] }),
        'first': new MoveNextState({ text: textB, actions: [jumpToState('second')] }),
        'second': new MoveNextState({ text: textC, actions: [endConversation()] })
    });

    assertBotResponse(bot, 'ok', textB);
    assertBotResponse(bot, 'not-ok', textC);
});