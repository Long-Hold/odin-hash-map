export class HashMap {
    // The % capacity to be used before expanding capacity
    #loadFactor;
    #capacity;
    #bucketSet;

    constructor() {
        this.#loadFactor = 0.75;
        this.#capacity = 16;
        this.#bucketSet = new Array(this.#capacity).fill(null);
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
     * Private method to make sure the bucketSet is not being indexed out of bounds.
     * This helps enforce the size functionality so the HashMap only grows as needed, rather
     * than allowing Javascript's native array functionality to create indexes not in sequence.
     * 
     * @param {number} index - The index of the bucket being requested.
     * @returns {array} The indexed bucket.
     */
    #getBucket(index) {
        if (index < 0 || index >= this.#bucketSet.length) {
            throw new Error('Trying to access index out of bounds.');
        }

        return this.#bucketSet[index];
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
        let bucket = this.#getBucket(bucketIndex);
        if (!bucket) {
            this.#bucketSet[bucketIndex] = node;
        } else {
            let iterator = bucket;
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
        const bucket = this.#getBucket(bucketIndex);
        if (!bucket) return null;
        let iterator = bucket;

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