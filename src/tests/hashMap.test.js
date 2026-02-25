import { HashMap } from "../modules/hashMap";

describe('class HashMap', () => {
    let hashMap;
    beforeEach(() => {
        hashMap = new HashMap();
    });

    describe('getters', () => {
        test('loadFactor returns its value', () => {
            expect(hashMap.loadFactor).toBe(0.75);
        });
        test('capacity returns its default size', () => {
            expect(hashMap.capacity).toBe(16);
        });
        test('bucketSet returns an array containing the default amount of buckets', () => {
            expect(hashMap.bucketSet.length).toBe(16);
        });
    });

    describe('methods', () => {
        describe('hash()', () => {
            test.each(
                [1, 2.3, {}, [], new String()]
            )('throws TypeError when passed a non string value: %s', (input) => {
                expect(() => hashMap.hash(input)).toThrow(TypeError);
            });
            test.each(
                ['','   ', '    ']
            )('Throws an error when passed empty or whitespace only string', (input) => {
                expect(() => hashMap.hash(input)).toThrow(Error);
            });
            test.each([
                {input: 'hello', result: 2},
                {input: 'world', result: 2},
                {input: 'world  ', result: 2},
                {input: 'long-hold', result: 0},
                {input: 'ford', result: 11},
                {input: '   ford', result: 11},
                {input: 'Pleasant Ave', result: 12},
                {input: '    Pleasant Ave ', result: 12},
            ])('returns hash: $result when passed input: $input', ({input, result}) => {
                // The hash should return the same value regardless of how often it is called
                expect(hashMap.hash(input)).toBe(result);
                expect(hashMap.hash(input)).toBe(result);
            });
        });
        describe('set() and get()', () => {
            test('get() returns null when the bucket is empty', () => {
                expect(hashMap.get('Apple')).toBeNull();
                expect(hashMap.get('banana')).toBeNull();
                expect(hashMap.get('oranges')).toBeNull();
            });
            test.each([
                {key: 'first', value: 1, result: 1},
                {key: 'second', value: 2, result: 2},
                {key: 'third', value: 3, result: 3},
            ])('get("$key") returns "$result" after using set("$key", $value)', ({key, value, result}) => {
                hashMap.set(key, value);
                expect(hashMap.get(key)).toBe(result);
            });
            test('get() returns the requests value if there is a collision within a bucket', () => {
                hashMap.set('hello', 1);
                expect(hashMap.get('hello')).toBe(1);
                hashMap.set('world', 1);
                expect(hashMap.get('world')).toBe(1);
                hashMap.set('olleh', 1);
                expect(hashMap.get('olleh')).toBe(1);
                expect(hashMap.get('hello')).toBe(1);
                expect(hashMap.get('world')).toBe(1);
            });
            test('set() overwrites existing nodes with new values', () => {
                hashMap.set('hello', 1);
                hashMap.set('elloh', 1);
                hashMap.set('name', 1);

                expect(hashMap.get('hello')).toBe(1);
                expect(hashMap.get('elloh')).toBe(1);
                expect(hashMap.get('name')).toBe(1);

                hashMap.set('hello', 'world');
                expect(hashMap.get(' hello ')).toBe('world');
            })
        });
        describe('set() and has()', () => {
            test('has() returns false if the bucket is empty', () => {
                expect(hashMap.has('this')).toBe(false);
                expect(hashMap.has('that')).toBe(false);
                expect(hashMap.has('those')).toBe(false);
            });
            test.each([
                {key: 'Matthew', value: 25},
                {key: 'Emily', value: 26},
                {key: 'Dinner', value: 'Salmon'},
            ])('has("$key") returns true after set("$key", $value) is called', ({key, value}) => {
                hashMap.set(key, value);
                expect(hashMap.has(key)).toBe(true);
            });
            test('returns true when checking for keys in buckets with collisions', () => {
                hashMap.set('hello', 1);
                hashMap.set('world', 1);
                hashMap.set('olleh', 1);
                expect(hashMap.has('olleh')).toBe(true)
                expect(hashMap.has('hello')).toBe(true);
                expect(hashMap.has('world')).toBe(true);
            });
            test('returns false when the bucket is not empty, but does not contain the key', () => {
                hashMap.set('hello', 1);
                hashMap.set('world', 1);
                expect(hashMap.has('olleh')).toBe(false)
                expect(hashMap.has('hello')).toBe(true);
                expect(hashMap.has('world')).toBe(true);
            });
        }); 
        describe('set(), remove(), and has()', () => {
            test('returns false if the bucket is empty', () => {
                expect(hashMap.remove('someKey')).toBe(false);
                expect(hashMap.remove('anotherKey')).toBe(false);

                hashMap.set('key', 1);
                expect(hashMap.remove('anotherOne')).toBe(false);
            });
            test('returns false if the key cannot be found within a bucket', () => {
                hashMap.set('hello', 1);
                hashMap.set('world', 2);
                hashMap.set('elloh', 2);
                expect(hashMap.remove('hlleo')).toBe(false);
            });
            test('has() returns false after remove() returns true when passed an existing node', () =>{
                const keys = ['hello', 'world', 'hlleo', 'llheo'];
                keys.forEach(key => hashMap.set(key, 1));
                keys.forEach(key => expect(hashMap.has(key)).toBe(true));

                expect(hashMap.remove(keys[2])).toBe(true);
                expect(hashMap.has(keys[2])).toBe(false);

                expect(hashMap.has(keys[0])).toBe(true);
                expect(hashMap.has(keys[1])).toBe(true);
                expect(hashMap.has(keys[3])).toBe(true);

                expect(hashMap.remove(keys[3])).toBe(true);
                expect(hashMap.has(keys[3])).toBe(false);
                expect(hashMap.has(keys[1])).toBe(true);
            });
            test('remove() re-links a new head if the first node in the list is removed', () => {
                const keys = ['hello', 'world', 'hlleo', 'llheo'];
                keys.forEach(key => hashMap.set(key, 1));
                keys.forEach(key => expect(hashMap.has(key)).toBe(true));

                expect(hashMap.remove(keys[0])).toBe(true);
                expect(hashMap.has(keys[0])).toBe(false);
                for (let i = 1; i < keys.length; ++i) {
                    expect(hashMap.has(keys[i])).toBe(true);
                }
            });
            test('remove() returns true and bucket becomes null when all nodes are removed', () => {
                hashMap.set('ford', 1);
                expect(hashMap.has('ford')).toBe(true);
                expect(hashMap.remove('ford')).toBe(true);
                expect(hashMap.has('ford')).toBe(false);
                expect(hashMap.bucketSet[hashMap.hash('ford')]).toBeNull();

                const keys = ['hello', 'world', 'hlleo', 'llheo'];
                keys.forEach((key) => {
                    hashMap.set(key, 1);
                    expect(hashMap.has(key)).toBe(true);
                    expect(hashMap.bucketSet[hashMap.hash(key)]).not.toBeNull();
                });

                keys.forEach((key) => {
                    expect(hashMap.remove(key)).toBe(true)
                    expect(hashMap.has(key)).toBe(false);
                });

                keys.forEach(key => expect(hashMap.bucketSet[hashMap.hash(key)]).toBeNull());
            });
            test('remove() matches trimmed keys', () => {
                hashMap.set('hello', 1);
                expect(hashMap.remove('  hello  ')).toBe(true);
                expect(hashMap.has('hello')).toBe(false);
            });
        });
        describe('length(), set(), and remove()', () => {
            test('returns 0 when called on an empty Hash Map', () => {
                expect(hashMap.length()).toBe(0);
            });
            test.each([
                {keys: ['hello'], result: 1},
                {keys: ['hello', 'world', 'olleh'], result: 3},
                {keys: ['ford', 'matthew', 'food', 'occurence'], result: 4},
            ])('returns $result after setting $keys', ({keys, result}) => {
                keys.forEach(key => hashMap.set(key, 1));
                expect(hashMap.length()).toBe(result); 
            });
            test('returns updated length() after some entries have been removed', () => {
                const keys = ['something', 'hello', 'world', 'ford', 'matthew', 'elloh', 'names'];
                keys.forEach(key => hashMap.set(key, 1));

                expect(hashMap.length()).toBe(7);
                hashMap.remove(keys[2]);
                hashMap.remove(keys[1]);
                hashMap.remove(keys[6]);
                expect(hashMap.length()).toBe(4);

                hashMap.remove(keys[0]);
                expect(hashMap.length()).toBe(3);

                hashMap.remove(keys[3]);
                hashMap.remove(keys[4]);
                hashMap.remove(keys[5]);
                expect(hashMap.length()).toBe(0);
            });
            test('returns updated length() after entries have been removed or inserted', () => {
                hashMap.set('something', 1);
                hashMap.set('nothing', 1);
                expect(hashMap.length()).toBe(2);

                hashMap.set('another thing', 1);
                hashMap.set('hello', 1);
                expect(hashMap.length()).toBe(4);

                hashMap.remove('hello');
                expect(hashMap.length()).toBe(3);

                hashMap.set('elloh', 1);
                expect(hashMap.length()).toBe(4);
            });
        });
        describe('clear()', () => {
            test('properly resets the hashMap to its default state when called', () => {
                const keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p']
                const collisionKeys = ['hello', 'hlleo', 'llheo', 'world', 'this',' ford', 'matthew'];

                keys.forEach(key => hashMap.set(key, 1));
                collisionKeys.forEach(key => hashMap.set(key, 1));

                keys.forEach(key => expect(hashMap.has(key)).toBe(true));
                collisionKeys.forEach(key => expect(hashMap.has(key)).toBe(true));

                hashMap.clear();
                expect(hashMap.capacity).toBe(16);
                hashMap.bucketSet.forEach(bucket => expect(bucket).toBeNull());
            });
        });
        describe('values()', () => {
            test('returns an array', () => {
                expect(hashMap.values()).toBeInstanceOf(Array);
            });
            test('returns an array containing all set values passed to Hash Map', () => {
                const keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];
                const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

                for (let i = 0; i < 15; ++i) {
                    hashMap.set(keys[i], values[i]);
                }

                const hashValues = hashMap.values();
                expect(hashValues.length).toBe(values.length);

                values.sort((a, b) => a - b);;
                hashValues.sort((a, b) => a - b);;
                for (let i = 0; i < values.length; ++i) {
                    expect(values[i]).toBe(hashValues[i]);
                }
            });
            test('returned array correctly updates after values CRUD operations on Nodes', () => {
                hashMap.set('hello', 1);
                hashMap.set('hlleo', 2);
                hashMap.set('name', 3);

                let results = hashMap.values();
                results.sort((a, b) => a - b);;
                expect(results.length).toBe(3);
                expect(results[0]).toBe(1);
                expect(results[1]).toBe(2);
                expect(results[2]).toBe(3);

                hashMap.remove('hlleo');
                results = hashMap.values();
                results.sort((a, b) => a - b);;

                expect(results.length).toBe(2);``
                expect(results[1]).not.toBe(2);

                hashMap.set('something Else', 1000);
                results = hashMap.values();
                results.sort((a, b) => a - b);;
                expect(results.length).toBe(3);
                expect(results[2]).toBe(1000);
            });
        });
        describe('entries()', () => {
            test('returns an array', () => {
                expect(hashMap.entries()).toBeInstanceOf(Array);
            });
            test('returns an empty array when Hash Map is empty', () => {
                expect(hashMap.entries().length).toBe(0);
            });
            test('returns an array with the entries added to the hash map', () => {
                const keys = [
                    'a','b','c','d','e','f','g','h',
                    'i','j','k','l','m','n','o','p',
                    'hello','hlleo','world','matthew',
                    'ford','ontario','texas','toronto'
                ];

                for (let i = 0; i < keys.length; ++i) {
                    hashMap.set(keys[i], 1);
                }
                expect(hashMap.length()).toBe(keys.length);

                const entries = hashMap.entries();
                for (const [key, value] of entries) {
                    expect(keys.includes(key)).toBe(true);
                    expect(value).toBe(1);
                }
            });
            test('returns an array that reflects entries after some are added / removed', () => {
                const keys = ['a','b','c','d','e'];
                for (let i = 0; i < keys.length; ++i) {
                    hashMap.set(keys[i], 1);
                }
                hashMap.remove('e');
                hashMap.remove('d');
                let entries = hashMap.entries();
                expect(entries.length).toBe(keys.length - 2);
                for (const [key, value] of entries) {
                    expect(keys.includes(key)).toBe(true);
                }
                hashMap.set('hello', 1);
                hashMap.set('world', 1);
                entries = hashMap.entries();
                expect(entries.length).toBe(5);

                keys.splice(3, 2, 'hello', 'world');
                for (const [key, value] of entries) {
                    expect(keys.includes(key)).toBe(true);
                }
            });
        });
    });
});