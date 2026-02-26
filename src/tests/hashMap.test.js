import { HashMap } from '../modules/hashMap';

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
      test.each([1, 2.3, {}, [], new String()])(
        'throws TypeError when passed a non string value: %s',
        (input) => {
          expect(() => hashMap.hash(input)).toThrow(TypeError);
        }
      );
      test.each(['', '   ', '    '])(
        'Throws an error when passed empty or whitespace only string',
        (input) => {
          expect(() => hashMap.hash(input)).toThrow(Error);
        }
      );
      test.each([
        { input: 'hello', result: 2 },
        { input: 'world', result: 2 },
        { input: 'world  ', result: 2 },
        { input: 'long-hold', result: 0 },
        { input: 'ford', result: 11 },
        { input: '   ford', result: 11 },
        { input: 'Pleasant Ave', result: 12 },
        { input: '    Pleasant Ave ', result: 12 },
      ])(
        'returns hash: $result when passed input: $input',
        ({ input, result }) => {
          // The hash should return the same value regardless of how often it is called
          expect(hashMap.hash(input)).toBe(result);
          expect(hashMap.hash(input)).toBe(result);
        }
      );
    });
    describe('set() and get()', () => {
      test('get() returns null when the bucket is empty', () => {
        expect(hashMap.get('Apple')).toBeNull();
        expect(hashMap.get('banana')).toBeNull();
        expect(hashMap.get('oranges')).toBeNull();
      });
      test.each([
        { key: 'first', value: 1, result: 1 },
        { key: 'second', value: 2, result: 2 },
        { key: 'third', value: 3, result: 3 },
      ])(
        'get("$key") returns "$result" after using set("$key", $value)',
        ({ key, value, result }) => {
          hashMap.set(key, value);
          expect(hashMap.get(key)).toBe(result);
        }
      );
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
      });
    });
    describe('set() and has()', () => {
      test('has() returns false if the bucket is empty', () => {
        expect(hashMap.has('this')).toBe(false);
        expect(hashMap.has('that')).toBe(false);
        expect(hashMap.has('those')).toBe(false);
      });
      test.each([
        { key: 'Matthew', value: 25 },
        { key: 'Emily', value: 26 },
        { key: 'Dinner', value: 'Salmon' },
      ])(
        'has("$key") returns true after set("$key", $value) is called',
        ({ key, value }) => {
          hashMap.set(key, value);
          expect(hashMap.has(key)).toBe(true);
        }
      );
      test('returns true when checking for keys in buckets with collisions', () => {
        hashMap.set('hello', 1);
        hashMap.set('world', 1);
        hashMap.set('olleh', 1);
        expect(hashMap.has('olleh')).toBe(true);
        expect(hashMap.has('hello')).toBe(true);
        expect(hashMap.has('world')).toBe(true);
      });
      test('returns false when the bucket is not empty, but does not contain the key', () => {
        hashMap.set('hello', 1);
        hashMap.set('world', 1);
        expect(hashMap.has('olleh')).toBe(false);
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
      test('has() returns false after remove() returns true when passed an existing node', () => {
        const keys = ['hello', 'world', 'hlleo', 'llheo'];
        keys.forEach((key) => hashMap.set(key, 1));
        keys.forEach((key) => expect(hashMap.has(key)).toBe(true));

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
        keys.forEach((key) => hashMap.set(key, 1));
        keys.forEach((key) => expect(hashMap.has(key)).toBe(true));

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
          expect(hashMap.remove(key)).toBe(true);
          expect(hashMap.has(key)).toBe(false);
        });

        keys.forEach((key) =>
          expect(hashMap.bucketSet[hashMap.hash(key)]).toBeNull()
        );
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
        { keys: ['hello'], result: 1 },
        { keys: ['hello', 'world', 'olleh'], result: 3 },
        { keys: ['ford', 'matthew', 'food', 'occurence'], result: 4 },
      ])('returns $result after setting $keys', ({ keys, result }) => {
        keys.forEach((key) => hashMap.set(key, 1));
        expect(hashMap.length()).toBe(result);
      });
      test('returns updated length() after some entries have been removed', () => {
        const keys = [
          'something',
          'hello',
          'world',
          'ford',
          'matthew',
          'elloh',
          'names',
        ];
        keys.forEach((key) => hashMap.set(key, 1));

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
        const keys = [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
        ];
        const collisionKeys = [
          'hello',
          'hlleo',
          'llheo',
          'world',
          'this',
          ' ford',
          'matthew',
        ];

        keys.forEach((key) => hashMap.set(key, 1));
        collisionKeys.forEach((key) => hashMap.set(key, 1));

        keys.forEach((key) => expect(hashMap.has(key)).toBe(true));
        collisionKeys.forEach((key) => expect(hashMap.has(key)).toBe(true));

        hashMap.clear();
        expect(hashMap.capacity).toBe(16);
        hashMap.bucketSet.forEach((bucket) => expect(bucket).toBeNull());
      });
    });
    describe('keys()', () => {
      test('returns an array', () => {
        expect(hashMap.keys()).toBeInstanceOf(Array);
      });
      test('returns an empty array when the Hash Map is empty', () => {
        expect(hashMap.keys().length).toBe(0);
      });
      test('returns an array containing inserted keys', () => {
        const keys = [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'hello',
          'matthew',
          'tim',
          'bob',
        ];
        keys.forEach((key) => hashMap.set(key, 1));

        const result = hashMap.keys();
        keys.sort();
        result.sort();

        expect(result.length).toBe(keys.length);
        for (let i = 0; i < result.length; ++i) {
          expect(result[i]).toBe(keys[i]);
        }
      });
      test('returns keys as trimmed strings', () => {
        hashMap.set('  hello  ', 1);
        hashMap.set(' world', 2);

        const result = hashMap.keys();
        expect(result).toContain('hello');
        expect(result).toContain('world');
        expect(result).not.toContain('  hello  ');
        expect(result).not.toContain(' world');
      });
      test('does not include duplicate keys after overwriting an existing entry', () => {
        hashMap.set('hello', 1);
        hashMap.set('hello', 99);

        const result = hashMap.keys();
        const helloOccurrences = result.filter((k) => k === 'hello').length;
        expect(helloOccurrences).toBe(1);
      });
      test('reflects removal of keys', () => {
        const keys = ['hello', 'world', 'ford'];
        keys.forEach((key) => hashMap.set(key, 1));

        hashMap.remove('world');
        const result = hashMap.keys();

        expect(result).toContain('hello');
        expect(result).toContain('ford');
        expect(result).not.toContain('world');
        expect(result.length).toBe(2);
      });
      test('returns all keys across buckets with collisions', () => {
        // 'hello', 'world', 'olleh' all hash to bucket 2
        const collisionKeys = ['hello', 'world', 'olleh'];
        collisionKeys.forEach((key) => hashMap.set(key, 1));

        const result = hashMap.keys();
        collisionKeys.forEach((key) => expect(result).toContain(key));
        expect(result.length).toBe(collisionKeys.length);
      });
      test('returns all keys correctly after capacity expansion', () => {
        const keys = [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'one more',
        ];
        keys.forEach((key) => hashMap.set(key, 1));
        expect(hashMap.capacity).toBe(32);

        const result = hashMap.keys();
        expect(result.length).toBe(keys.length);
        keys.forEach((key) => expect(result).toContain(key));
      });
    });
    describe('values()', () => {
      test('returns an array', () => {
        expect(hashMap.values()).toBeInstanceOf(Array);
      });
      test('returns an array containing all set values passed to Hash Map', () => {
        const keys = [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
        ];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        for (let i = 0; i < 15; ++i) {
          hashMap.set(keys[i], values[i]);
        }

        const hashValues = hashMap.values();
        expect(hashValues.length).toBe(values.length);

        values.sort((a, b) => a - b);
        hashValues.sort((a, b) => a - b);
        for (let i = 0; i < values.length; ++i) {
          expect(values[i]).toBe(hashValues[i]);
        }
      });
      test('returned array correctly updates after values CRUD operations on Nodes', () => {
        hashMap.set('hello', 1);
        hashMap.set('hlleo', 2);
        hashMap.set('name', 3);

        let results = hashMap.values();
        results.sort((a, b) => a - b);
        expect(results.length).toBe(3);
        expect(results[0]).toBe(1);
        expect(results[1]).toBe(2);
        expect(results[2]).toBe(3);

        hashMap.remove('hlleo');
        results = hashMap.values();
        results.sort((a, b) => a - b);

        expect(results.length).toBe(2);
        ``;
        expect(results[1]).not.toBe(2);

        hashMap.set('something Else', 1000);
        results = hashMap.values();
        results.sort((a, b) => a - b);
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
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'hello',
          'hlleo',
          'world',
          'matthew',
          'ford',
          'ontario',
          'texas',
          'toronto',
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
        const keys = ['a', 'b', 'c', 'd', 'e'];
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

  describe('methods with expansion and shrinking capacity', () => {
    //11 keys is 1 less than what will trigger an expansion
    const elevenKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

    //23 keys if 1 less than 75% of the next expansion size, 32.
    const twentyThreeKeys = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
    ];

    describe('set() expands capacity when load factor is at 75%', () => {
      test('does not expand when under 75% of loadFactor', () => {
        for (let i = 0; i < elevenKeys.length; ++i) {
          hashMap.set(elevenKeys[i], 1);
        }

        expect(hashMap.capacity).toBe(16);
        expect(hashMap.bucketSet.length).toBe(16);
      });
      test('set() causes an expansion at 75% loadFactor or greater from default size', () => {
        for (let i = 0; i < elevenKeys.length; ++i) {
          hashMap.set(elevenKeys[i], 1);
        }
        hashMap.set('one more', 1);
        expect(hashMap.capacity).toBe(32);
        expect(hashMap.bucketSet.length).toBe(32);
      });
      test('set() triggers multiple expansions, and clear() reverts hash to default state', () => {
        for (let i = 0; i < elevenKeys.length; ++i) {
          hashMap.set(elevenKeys[i], 1);
        }
        hashMap.set('one more', 1);
        expect(hashMap.capacity).toBe(32);
        expect(hashMap.bucketSet.length).toBe(32);
        hashMap.clear();
        expect(hashMap.capacity).toBe(16);
        expect(hashMap.bucketSet.length).toBe(16);

        for (let i = 0; i < twentyThreeKeys.length; ++i) {
          hashMap.set(twentyThreeKeys[i], 1);
        }
        hashMap.set('one more');
        expect(hashMap.capacity).toBe(64);
        expect(hashMap.bucketSet.length).toBe(64);
        hashMap.clear();
        expect(hashMap.capacity).toBe(16);
        expect(hashMap.bucketSet.length).toBe(16);
      });
    });
    describe('increaseCapacity() re-hashes existing entries', () => {
      test('a tracked key lands in a different bucket after expansion', () => {
        const trackedKey = 'hello';
        hashMap.set(trackedKey, 'world');

        const oldIndex = hashMap.hash(trackedKey); // capacity is still 16
        expect(oldIndex).toBe(2);

        // Trigger expansion (need 12 total entries for 75% of 16)
        elevenKeys.forEach((key) => hashMap.set(key, 1));
        expect(hashMap.capacity).toBe(32);

        const newIndex = hashMap.hash(trackedKey); // now uses capacity 32
        expect(newIndex).toBe(18);
        expect(newIndex).not.toBe(oldIndex);
      });

      test('re-hashed entries are placed in the correct new bucket', () => {
        hashMap.set('hello', 'world');
        const oldIndex = hashMap.hash('hello'); // 2

        elevenKeys.forEach((key) => hashMap.set(key, 1));

        const newIndex = hashMap.hash('hello'); // 18

        // Old bucket should NOT contain 'hello'
        let found = false;
        let node = hashMap.bucketSet[oldIndex];
        while (node) {
          if (node.key === 'hello') found = true;
          node = node.next;
        }
        expect(found).toBe(false);

        // New bucket SHOULD contain 'hello'
        found = false;
        node = hashMap.bucketSet[newIndex];
        while (node) {
          if (node.key === 'hello') found = true;
          node = node.next;
        }
        expect(found).toBe(true);
      });

      test('all entries remain accessible after expansion', () => {
        hashMap.set('hello', 'world');
        elevenKeys.forEach((key) => hashMap.set(key, 1));

        expect(hashMap.capacity).toBe(32);
        expect(hashMap.get('hello')).toBe('world');
        elevenKeys.forEach((key) => expect(hashMap.has(key)).toBe(true));
        expect(hashMap.length()).toBe(12);
      });
    });
    describe('#decreaseCapacity() via remove()', () => {
      // Trigger expansion first: 12 entries pushes capacity to 32
      const expansionKeys = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'one more',
      ];

      test('does not shrink when length stays at or above shrink threshold', () => {
        expansionKeys.forEach((key) => hashMap.set(key, 1));
        hashMap.set('extra', 1); // 13 total entries, capacity is 32
        expect(hashMap.capacity).toBe(32);

        // Shrink threshold at capacity 32: length < (0.75 * 32) / 2 = 12
        // Removing 1 entry leaves 12, which is NOT < 12
        hashMap.remove('one more');
        expect(hashMap.capacity).toBe(32);
        expect(hashMap.bucketSet.length).toBe(32);
      });

      test('capacity halves when length drops below shrink threshold', () => {
        expansionKeys.forEach((key) => hashMap.set(key, 1));
        expect(hashMap.capacity).toBe(32);

        // Remove entries until length < 12 (threshold for capacity 32)
        ['a', 'b'].forEach((key) => hashMap.remove(key));
        expect(hashMap.capacity).toBe(16);
        expect(hashMap.bucketSet.length).toBe(16);
      });

      test('a tracked key lands in a different bucket after shrink', () => {
        expansionKeys.forEach((key) => hashMap.set(key, 1));
        hashMap.set('hello', 'world');
        expect(hashMap.capacity).toBe(32);

        const expandedIndex = hashMap.hash('hello'); // hash under capacity 32
        expect(expandedIndex).toBe(18);

        ['a', 'b'].forEach((key) => hashMap.remove(key));
        expect(hashMap.capacity).toBe(16);

        const shrunkIndex = hashMap.hash('hello'); // hash under capacity 16
        expect(shrunkIndex).toBe(2);
        expect(shrunkIndex).not.toBe(expandedIndex);
      });

      test('re-hashed entries are placed in the correct new bucket after shrink', () => {
        expansionKeys.forEach((key) => hashMap.set(key, 1));
        hashMap.set('hello', 'world');
        expect(hashMap.capacity).toBe(32);

        const oldIndex = hashMap.hash('hello'); // 18

        ['a', 'b'].forEach((key) => hashMap.remove(key));
        expect(hashMap.capacity).toBe(16);

        const newIndex = hashMap.hash('hello'); // 2

        // 'hello' should NOT be in the old bucket
        let found = false;
        let node = hashMap.bucketSet[oldIndex];
        while (node) {
          if (node.key === 'hello') found = true;
          node = node.next;
        }
        expect(found).toBe(false);

        // 'hello' SHOULD be in the new bucket
        found = false;
        node = hashMap.bucketSet[newIndex];
        while (node) {
          if (node.key === 'hello') found = true;
          node = node.next;
        }
        expect(found).toBe(true);
      });

      test('all remaining entries are accessible after shrink', () => {
        expansionKeys.forEach((key) => hashMap.set(key, 1));
        hashMap.set('hello', 'world');

        ['a', 'b'].forEach((key) => hashMap.remove(key));
        expect(hashMap.capacity).toBe(16);

        expect(hashMap.get('hello')).toBe('world');
        const remainingKeys = expansionKeys.filter(
          (k) => k !== 'a' && k !== 'b'
        );
        remainingKeys.forEach((key) => expect(hashMap.has(key)).toBe(true));
        expect(hashMap.length()).toBe(remainingKeys.length + 1); // +1 for 'hello'
      });
    });
  });
});
