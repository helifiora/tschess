type Mapper<K, V> = (input: K) => V;
type Predicate<T> = (input: T) => boolean;

class Stream<T> {
  #data: Iterable<T>;

  constructor(data: Iterable<T>) {
    this.#data = data;
  }

  flatMap<K>(mapper: Mapper<T, Iterable<K>>): Stream<K> {
    this.#data = flatMap(this.#data, mapper) as any;
    return this as unknown as Stream<K>;
  }

  flatMapWithEntryValue<K>(mapper: Mapper<T, Iterable<K>>): Stream<[K, T]> {
    this.#data = flatMapWithEntryValue(this.#data, mapper) as any;
    return this as unknown as Stream<[K, T]>;
  }

  map<K>(mapper: Mapper<T, K>): Stream<K> {
    this.#data = map(this.#data, mapper) as any;
    return this as unknown as Stream<K>;
  }

  filter<K = T>(predicate: Predicate<T>): Stream<K> {
    this.#data = filter(this.#data, predicate);
    return this as unknown as Stream<K>;
  }

  some(predicate: Predicate<T>): boolean {
    for (const item of this.#data) {
      if (predicate(item)) {
        return true;
      }
    }

    return false;
  }

  every(predicate: Predicate<any>): boolean {
    for (const item of this.#data) {
      if (!predicate(item)) {
        return false;
      }
    }

    return true;
  }

  tap(callback: (value: T) => void): Stream<T> {
    this.#data = tap(this.#data, callback);
    return this;
  }

  toArray(): T[] {
    return Array.from(this.#data);
  }

  toMap<K, V>(fn: (input: T) => [K, V]): Map<K, V> {
    const entries = Array.from(this.#data).map(fn);
    return new Map(entries);
  }
}

function* tap<T>(values: Iterable<T>, fn: (v: T) => void): Generator<T> {
  for (const value of values) {
    fn(value);
    yield value;
  }
}

function* flatMap<K, V>(
  values: Iterable<K>,
  mapper: Mapper<K, Iterable<V>>
): Generator<V> {
  for (const value of values) {
    for (const result of mapper(value)) {
      yield result;
    }
  }
}

function* flatMapWithEntryValue<K, V>(
  values: Iterable<K>,
  mapper: Mapper<K, Iterable<V>>
): Generator<[V, K]> {
  for (const value of values) {
    for (const result of mapper(value)) {
      yield [result, value];
    }
  }
}

function* map<K, V>(values: Iterable<K>, mapper: Mapper<K, V>): Generator<V> {
  for (const item of values) {
    yield mapper(item);
  }
}

function* filter<T>(
  values: Iterable<T>,
  predicate: Predicate<T>
): Generator<T> {
  for (const item of values) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export function iter<T>(value: Iterable<T>): Stream<T> {
  return new Stream<T>(value);
}
