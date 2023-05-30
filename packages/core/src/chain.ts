export function* chain<T>(values: Iterable<T>[]): Iterable<T> {
  for (const item of values) {
    yield* item;
  }
}
