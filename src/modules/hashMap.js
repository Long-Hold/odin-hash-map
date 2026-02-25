export class HashMap {
    static #defaultCapacity = 16;
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

    /**
     * Inserts a Key:Value pair into the Hash Map.
     * Key's are strictly strings and allow querying for CRUD operations on the node.
     * 
     * @param {string} key - The key that is assigned to the node to be used for CRUD later.
     * @param {any} value - The value stored in the node.
     * @returns {this} An instance of the object to allow chaining.
     */
    set(key, value) {
        const trimmedKey = key.trim();
        const bucketIndex = this.hash(trimmedKey);
        const node = new Node(trimmedKey, value);

        // If the bucket is empty, this while loop never runs.
        let iterator = this.#getBucket(bucketIndex);
        while (iterator) {
            if (iterator.key === trimmedKey) {
                iterator.value = value;
                return this;
            }
            else if (iterator.next === null) {
                iterator.next = node;
                return this;
            }
            else iterator = iterator.next;
        }

        // If the bucket is empty, while loop is skipped and a new head is assigned.
        this.#bucketSet[bucketIndex] = node;
        return this;
    }

    /**
     * Retrieves the value of a Node that matches the passed key parameter.
     * If no node can be found, returns null.
     * 
     * @param {string} key - The key of the Node's value to retrieve and return.
     * @returns {any} The value of the specified Node, or null if it could not be found.
     */
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

    /**
     * Checks the Hash Map for to see if the specified Node with the matching key exists.
     * If it can be found, return true, otherwise false.
     * 
     * @param {string} key - The key of the Node to check for.
     * @returns {boolean} The result of the query for the Node.
     */
    has(key) {
        const trimmedKey = key.trim();
        const bucketIndex = this.hash(trimmedKey);
        const bucket = this.#getBucket(bucketIndex);

        if (!bucket) return false;
        let iterator = bucket;
        while (iterator) {
            if (iterator.key === trimmedKey) return true;
            iterator = iterator.next;
        }
        return false;
    }

    /**
     * Removes the Node that matches the specified Key from the Hash Map.
     * 
     * If the node was located and removed, returns true.
     * If the node could not be found, or if the bucket is empty, returns false.
     * 
     * @param {string} key - The key of the Node to remove.
     * @returns {boolean} A bool indicating whether the Node was removed (true) or not (false).
     */
    remove(key) {
        const trimmedKey = key.trim();
        const bucketIndex = this.hash(trimmedKey);
        const bucket = this.#getBucket(bucketIndex);

        let leftLink = null;
        let iterator = bucket;
        while (iterator) {
            if (iterator.key === trimmedKey) {
                /**
                 * If leftLink is null, then that means the head node is being removed.
                 * So I have to assign the bucket to the next node in the list, or just null.
                 */
                if (!leftLink) this.#bucketSet[bucketIndex] = iterator.next;
                else leftLink.next = iterator.next;
                break;
            }
            leftLink = iterator;
            iterator = iterator.next;
        }

        return iterator !== null;
    }

    /**
     * Returns the total number of Nodes stored in all buckets.
     * 
     * @returns {number} The total number of Nodes stored across all buckets.
     */
    length() {
        let entryCount = 0;
        this.#bucketSet.forEach((bucket) => {
            if (bucket !== null) {
                let iterator = bucket;
                while (iterator) {
                    ++entryCount;
                    iterator = iterator.next;
                }
            }
        });

        return entryCount;
    }

    /**
     * Removes all entries in the Hash Map and resets it to it's original capacity.
     * 
     * @returns {this} An instance of the object for chaining.
     */
    clear() {
        this.#capacity = HashMap.#defaultCapacity;
        this.#bucketSet = new Array(this.#capacity).fill(null);
        return this;
    }
    
    /**
     * Returns an array containing all stored values.
     * 
     * @returns {[any]} An array containing all values stored by the Nodes in the hash map.
     */
    values() {
        const valuesArr = [];

        for (let i = 0; i < this.#bucketSet.length; ++i) {
            if (this.#bucketSet[i] === null) continue;

            let iterator = this.#bucketSet[i];
            while (iterator) {
                valuesArr.push(iterator.value);
                iterator = iterator.next;
            }
        }

        return valuesArr;
    }

    /**
     * Returns an array where each index is an array of the Key:Value pairs in the Hash Map.
     * 
     * @returns {Array<Array>}
     */
    entries() {
        const entriesArr = [];

        for (let i = 0; i < this.#bucketSet.length; ++i) {
            if (this.#bucketSet[i] === null) continue;

            let iterator = this.#bucketSet[i];
            while (iterator) {
                entriesArr.push([iterator.key, iterator.value]);
                iterator = iterator.next;
            }
        }

        return entriesArr;
    }
}

class Node {
    constructor(key = null, value = null, next = null) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
