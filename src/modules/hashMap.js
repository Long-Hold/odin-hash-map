export class HashMap {
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
}