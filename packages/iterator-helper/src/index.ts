type Mapper<TInput, TOutput> = (input: TInput) => TOutput;
type Predicate<T> = (input: T) => boolean;
type UnaryFunction<I, O> = Mapper<I, O>;

export function every<T>(
  predicate: Predicate<T>
): UnaryFunction<Iterable<T>, boolean> {
  return (data) => {
    for (const item of data) {
      if (!predicate(item)) {
        return false;
      }
    }

    return true;
  };
}

export function filter<T>(
  predicate: Predicate<T>
): UnaryFunction<Iterable<T>, Generator<T>> {
  return function* (data) {
    for (const item of data) {
      if (predicate(item)) {
        yield item;
      }
    }
  };
}

export function flatMap<I, O>(
  mapper: Mapper<I, Iterable<O>>
): UnaryFunction<Iterable<I>, Generator<O>> {
  return function* (data) {
    for (const itemEntry of data) {
      for (const item of mapper(itemEntry)) {
        yield item;
      }
    }
  };
}

export function flatMapWithEntry<I, O>(
  mapper: Mapper<I, Iterable<O>>
): UnaryFunction<Iterable<I>, Generator<[O, I]>> {
  return function* (data) {
    for (const itemEntry of data) {
      for (const item of mapper(itemEntry)) {
        yield [item, itemEntry];
      }
    }
  };
}

export function isEmpty<T>(): UnaryFunction<Iterable<T>, boolean> {
  return (data) => Array.from(data).length === 0;
}

export function map<I, O>(
  mapper: Mapper<I, O>
): UnaryFunction<Iterable<I>, Generator<O>> {
  return function* (data) {
    for (const item of data) {
      yield mapper(item);
    }
  };
}

export function some<T>(
  predicate: Predicate<T>
): UnaryFunction<Iterable<T>, boolean> {
  return (data) => {
    for (const item of data) {
      if (predicate(item)) {
        return true;
      }
    }

    return false;
  };
}

export function take<T>(
  limit: number
): UnaryFunction<Iterable<T>, Generator<T>> {
  return function* (data) {
    let counter = 1;
    for (const item of data) {
      if (counter > limit) {
        break;
      }

      counter++;
      yield item;
    }
  };
}

export function tap<I>(
  callback: (input: I) => void
): UnaryFunction<Iterable<I>, Generator<I>> {
  return function* (data) {
    for (const item of data) {
      callback(item);
      yield item;
    }
  };
}

export function toArray<T>(): Mapper<Iterable<T>, T[]> {
  return (values) => Array.from(values);
}

export function toMap<T, K, V>(
  mapper: Mapper<T, [key: K, value: V]>
): Mapper<Iterable<T>, Map<K, V>> {
  return (values) => {
    const result = Array.from(values).map(mapper);
    return new Map(result);
  };
}

export function toObject<T, K extends string | symbol | number, V>(
  mapper: Mapper<T, [key: K, value: V]>
): Mapper<Iterable<T>, Record<K, V>> {
  return (values) => {
    const result = Array.from(values).map(mapper);
    return Object.fromEntries(result) as Record<K, V>;
  };
}
