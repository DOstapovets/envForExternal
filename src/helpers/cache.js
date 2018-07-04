export default class Cache {
    constructor () {
        this.reset();
    }
    get (name, loader = () => null) {
        // eslint-disable-next-line no-return-assign
        return this._cache[name] || (this._cache[name] = Promise.try(() => loader(name)));
    }
    del (name) {
        delete this._cache[name];
    }
    set (name, value) {
        this._cache[name] = Promise.resolve(value);
    }
    reset () {
        this._cache = {};
    }
}
