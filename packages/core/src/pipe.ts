type Mapper<TInput, TOutput> = (input: TInput) => TOutput;

export function pipe<A, B>(value: A, ab: Mapper<A, B>): B;
export function pipe<A, B, C>(value: A, ab: Mapper<A, B>, bc: Mapper<B, C>): C;
export function pipe<A, B, C, D>(value: A, ab: Mapper<A, B>, bc: Mapper<B, C>, cd: Mapper<C, D>): D;
export function pipe<A, B, C, D, E>(
  value: A,
  ab: Mapper<A, B>,
  bc: Mapper<B, C>,
  cd: Mapper<C, D>,
  de: Mapper<D, E>
): E;
export function pipe<A, B, C, D, E, F>(
  value: A,
  ab: Mapper<A, B>,
  bc: Mapper<B, C>,
  cd: Mapper<C, D>,
  de: Mapper<D, E>,
  ef: Mapper<E, F>
): F;
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  ab: Mapper<A, B>,
  bc: Mapper<B, C>,
  cd: Mapper<C, D>,
  de: Mapper<D, E>,
  ef: Mapper<E, F>,
  fg: Mapper<F, G>
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  ab: Mapper<A, B>,
  bc: Mapper<B, C>,
  cd: Mapper<C, D>,
  de: Mapper<D, E>,
  ef: Mapper<E, F>,
  fg: Mapper<F, G>,
  gh: Mapper<G, H>
): H;
export function pipe(value: unknown, ...operators: Mapper<unknown, unknown>[]) {
  return operators.reduce((s, c) => c(s), value);
}
