export function* chain<T>(values: Generator<T>[]): Generator<T> {
  for (const item of values) {
    yield* item;
  }
}
