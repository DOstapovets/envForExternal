import * as _ from 'lodash';

export default class WorkerInvoker {
    constructor (workerFactory, methods) {
        this._worker = workerFactory();
        this._worker.onmessage = event => {
            this._tasks[event.data.id][event.data.method](event.data.value);
        };
        this._id = 0;
        this._tasks = {};

        // TODO: create a Proxy?
        _.forEach(methods, method => {
            this[method] = (...args) => this._invoke(method, ...args);
        });
    }

    async _invoke (method, ...args) {
        return new Promise((resolve, reject) => {
            const id = this._id += 1;
            this._tasks[id] = {resolve, reject};
            this._worker.postMessage({id, method, args});
        });
    }
}
