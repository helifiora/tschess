interface ResultOk<T> {
  success: true;
  data: T;
}

interface ResultError<T> {
  success: false;
  error: T;
}

export type Result<T, TError> = ResultOk<T> | ResultError<TError>;
