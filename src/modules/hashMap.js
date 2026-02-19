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
        const trimmedKey = key.trim();
        if (!trimmedKey) throw new Error('Key cannot be empty or whitespace only');
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;
        }

        return hashCode;
    }
}