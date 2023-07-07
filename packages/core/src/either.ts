class Left<T> {
  constructor(readonly left: T) {}

  isLeft(): this is Left<T> {
    return true;
  }

  isRight(): this is Right<T> {
    return false;
  }
}

class Right<T> {
  constructor(readonly value: T) {}

  isLeft(): this is Left<T> {
    return true;
  }

  isRight(): this is Right<T> {
    return false;
  }
}

export type Either<TLeft, TRight> = Left<TLeft> | Right<TRight>;

export function right<T>(value: T): Either<never, T> {
  return new Right(value);
}

export function left<T>(value: T): Either<T, never> {
  return new Left(value);
}
