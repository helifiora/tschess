type Predicate<T> = (item: T) => boolean;
type Mapper<TInput, TOutput> = (input: TInput) => TOutput;

type Key = string | number | symbol;

export namespace Generator {
  export function filter<T>(
    predicate: Predicate<T>
  ): Mapper<Iterable<T>, Generator<T>> {
    return function* (values) {
      for (const item of values) {
        if (predicate(item)) {
          yield item;
        }
      }
    };
  }

  export function flatMap<TInput, TOutput>(
    mapper: Mapper<TInput, Iterable<TOutput>>
  ): Mapper<Iterable<TInput>, Generator<TOutput>> {
    return function* (values) {
      for (const value of values) {
        for (const result of mapper(value)) {
          yield result;
        }
      }
    };
  }

  export function map<TInput, TOutput>(
    mapper: Mapper<TInput, TOutput>
  ): Mapper<Iterable<TInput>, Generator<TOutput>> {
    return function* (values) {
      for (const item of values) {
        yield mapper(item);
      }
    };
  }

  export function any<T>(
    predicate: Predicate<T>
  ): Mapper<Iterable<T>, boolean> {
    return function (values) {
      for (const item of values) {
        if (predicate(item)) {
          return true;
        }
      }

      return false;
    };
  }

  export function anyTrue(): Mapper<Iterable<boolean>, boolean> {
    return (values) => {
      for (const item of values) {
        if (item) {
          return true;
        }
      }

      return false;
    };
  }

  export function allMatch<T>(
    predicate: Predicate<T>
  ): Mapper<Iterable<T>, boolean> {
    return (values) => {
      for (const item of values) {
        if (predicate(item)) {
          return false;
        }
      }

      return true;
    };
  }

  export function first<T>(): Mapper<Generator<T>, T | null> {
    return (values) => values.next().value ?? null;
  }

  export function toObject<T, V>(
    mapper: Mapper<T, [key: Key, value: V]>
  ): Mapper<Iterable<T>, Record<Key, V>> {
    return (values) => {
      const result = Array.from(values).map(mapper);
      return Object.fromEntries(result);
    };
  }

  export function toMap<T, K, V>(
    mapper: Mapper<T, [key: K, value: V]>
  ): Mapper<Iterable<T>, Map<K, V>> {
    return (values) => {
      const result = Array.from(values).map(mapper);
      return new Map(result);
    };
  }

  export function toArray<T>(): Mapper<Iterable<T>, T[]> {
    return (values) => Array.from(values);
  }
}
