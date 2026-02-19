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
        });
    });
});