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
        });
        describe('set() and has()', () => {
            test('has() returns false if the bucket is empty', () => {
                expect(hashMap.has('this')).toBe(false);
                expect(hashMap.has('that')).toBe(false);
                expect(hashMap.has('those')).toBe(false);
            });
        });
    });
});