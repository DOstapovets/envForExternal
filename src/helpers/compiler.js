import worker from './compiler.worker';
import WorkerInvoker from './worker_invoker';

class Compiler extends WorkerInvoker {
    constructor () {
        super(worker);
    }

    async load (name, root) {
        return this._invoke('load', name, root);
    }

    async compileSass (wrapperId, content, options) {
        return this._invoke('compileSass', wrapperId, content, options);
    }
}

export default new Compiler();
