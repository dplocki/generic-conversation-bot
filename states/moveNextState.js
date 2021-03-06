const { response } = require('../actions');

class MoveNextState {
    constructor(text, actions) {
        this.text = text;
        this.actions = actions;
    }

    *beforeMessage() {
        yield response(this.text);
    }

    *analyse() {
        yield* this.actions;
    }
}

module.exports = MoveNextState;
