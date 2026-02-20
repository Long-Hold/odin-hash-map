export class HashMap {
    // The % capacity to be used before expanding capacity
    #loadFactor;
    #capacity;
    #bucketSet;

    constructor() {
        this.#loadFactor = 0.75;
        this.#capacity = 16;
        this.#bucketSet = Array.from({length: this.#capacity}, () => []);
    }

    get loadFactor() {
        return this.#loadFactor;
    }

    get capacity() {
        return this.#capacity;
    }

    get bucketSet() {
        return this.#bucketSet;
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

    set(key, value) {
        const trimmedKey = key.trim();
        const bucketIndex = this.hash(trimmedKey);

        const node = new Node(trimmedKey, value);
        if (!this.#bucketSet[bucketIndex]) {
            const bucketHead = node;
            this.#bucketSet[bucketIndex] = bucketHead;
        } else {
            let iterator = this.#bucketSet[bucketIndex];
            while (iterator.next) {
                iterator = iterator.next;
            }
            iterator.next = node;
        }
        return this;
    }

    get(key) {
        const trimmedKey = key.trim();
        const bucketIndex = this.hash(trimmedKey);

        if (this.#bucketSet[bucketIndex].length === 0) return null;
        let iterator = this.#bucketSet[bucketIndex];

        while (iterator.next) {
            if (iterator.key === trimmedKey) return iterator.value;
            else iterator = iterator.next;
        }

        return iterator.key === trimmedKey ? iterator.value : null;
    }
}

class Node {
    constructor(key = null, value = null, next = null) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}