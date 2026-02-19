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

    /**
     * Hashes a passed string into a value that determines which bucket in the map the Key: Value
     * pair is inserted in.
     * 
     * @param {string} key - The string that is hashed to determine where to place the Key:Value pair.
     * @returns {number} The hash code that directs which bucket to set the pair into.
     */
    hash(key) {
        if (typeof key !== 'string') throw new TypeError('Key must be a string.');

        const trimmedKey = key.trim();
        if (!trimmedKey) throw new Error('Key cannot be empty or whitespace only');

        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < trimmedKey.length; i++) {
            hashCode = (primeNumber * hashCode + trimmedKey.charCodeAt(i)) % this.#capacity;
        }

        return hashCode;
    }
}

class Node {
    constructor(key = null, value = null, next = null) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}