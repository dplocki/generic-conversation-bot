const { INIT_STATE } = require('./constants');


class Bot {
    constructor(statesMap) {
        this.__actionsSource = [];
        this.__statesMap = statesMap;
        this.__response = null;
        this.__state = null;

        this.reset();
    }

    set state(state) {
        this.__state = state;
        this.__actionsSource.push(state.beforeMessage());
    }

    get state() {
        return this.__state;
    }

    set response(response) {
        this.__response = response;
    }

    get response() {
        return this.__response;
    }

    get isReset() {
        return this.state === this.__statesMap[INIT_STATE];
    }

    jumpToState(stateLabel) {
        this.state = this.__statesMap[stateLabel];
    }

    reset() {
        this.__response = null;
        this.jumpToState(INIT_STATE);
    }

    *nextAction() {
        while (this.__actionsSource.length > 0) {
            yield* (this.__actionsSource.shift());
        }
    }

    addAction(actionSource) {
        this.__actionsSource.push(actionSource);
    }

    message(message) {
        this.addAction(this.__state.analyse(message));
        for (let action of this.nextAction()) {
            action(this, message);
        }

        return {
            ...message,
            response: this.__response
        }
    }
}

module.exports = Bot;
