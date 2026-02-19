export class HashMap {
    // The % capacity to be used before expanding capacity
    #loadFactor;
    #capacity;

    constructor() {
        this.#loadFactor = 0.75;
        this.#capacity = 16;
    }

    get loadFactor() {
        return this.#loadFactor;
    }

    get capacity() {
        return this.#capacity;
    }

    hash(key) {
        if (typeof key !== 'string') throw new TypeError('Key must be a string.');        
    }
}