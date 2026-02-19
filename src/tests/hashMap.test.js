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
            })
            test.each([
                {input: 'hello', result: 2},
                {input: 'world', result: 2},
                {input: 'long-hold', result: 0},
                {input: 'ford', result: 11},
                {input: 'Pleasant Ave', result: 12},
            ])('returns hash: $result when passed input: $input', ({input, result}) => {
                // The hash should return the same value regardless of how often it is called
                expect(hashMap.hash(input)).toBe(result);
                expect(hashMap.hash(input)).toBe(result);
            });
        });
    });
});