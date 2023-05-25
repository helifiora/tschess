type Predicate<T> = (item: T) => boolean;

export function* filter<T>(values: Generator<T>, predicate: Predicate<T>): Generator<T> {
  for (const item of values) {
    if (predicate(item)) {
      yield item;
    }
  }
}