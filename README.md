# HashMap

A HashMap data structure implemented in JavaScript. Built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

## Overview

This HashMap uses separate chaining with linked lists for collision resolution. Buckets are stored in a fixed-size array that grows and shrinks automatically based on the number of entries relative to a load factor threshold of 75%.

Keys are hashed using a polynomial rolling hash function with a prime multiplier of 31 and modulo operations to keep values within the bucket range.

## Features

- Automatic capacity expansion when entries reach 75% of total buckets
- Automatic capacity reduction when entries drop below half the load threshold
- All entries are re-hashed when the capacity changes
- Bounds checking on bucket access to prevent out-of-range indexing
- Keys are trimmed of whitespace before hashing and storage

## API

| Method      | Returns          | Description                                        |
|-------------|------------------|----------------------------------------------------|
| `set(key, value)` | `this`    | Inserts or updates a key-value pair.               |
| `get(key)`        | `any`     | Returns the value for a key, or `null` if not found. |
| `has(key)`        | `boolean` | Returns whether a key exists in the map.           |
| `remove(key)`     | `boolean` | Removes a key-value pair. Returns `true` if found. |
| `length()`        | `number`  | Returns the total number of stored entries.        |
| `clear()`         | `this`    | Removes all entries and resets to default capacity. |
| `keys()`          | `array`   | Returns an array of all keys.                      |
| `values()`        | `array`   | Returns an array of all values.                    |
| `entries()`       | `array`   | Returns an array of `[key, value]` pairs.          |
| `hash(key)`       | `number`  | Returns the hash code (bucket index) for a key.    |

## Running Tests

```bash
npm install
npm run test
```

Tests are written with Jest and cover standard operations, collision handling, key overwriting, capacity expansion, capacity reduction, and re-hashing correctness.

## Project Structure

```
src/
  modules/
    hashMap.js       # HashMap and Node classes
  tests/
    hashMap.test.js  # Test suite
```

## Built With

- JavaScript (ES Modules)
- Jest
- ESLint + Prettier