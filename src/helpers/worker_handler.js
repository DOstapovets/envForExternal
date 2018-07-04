export default class WorkerHandler {
    constructor (workerSelf, invokeTarget) {
        workerSelf.onmessage = async event => {
            if (event.data.method) {
                const id = event.data.id;
                try {
                    const value = await invokeTarget[event.data.method](...event.data.args);
                    self.postMessage({id : event.data.id, method : 'resolve', value});
                } catch (error) {
                    self.postMessage({id, method : 'reject', value : error});
                }
            }
        };
    }
}
