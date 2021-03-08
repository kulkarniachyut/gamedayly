/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

export type Result<T, E> = Success<T, E> | Failure<T, E>;

export const success = <T, E>(value: T): Success<T, E> => new Success(value);

export const failure = <T, E>(error: E): Failure<T, E> => new Failure(error);

export class Success<T, E> {
  constructor(private readonly _value: T) {}

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return !this.isSuccess();
  }

  value(): T {
    return this._value;
  }
}

export class Failure<T, E> {
  constructor(private readonly _error: E) {}

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return !this.isSuccess();
  }

  error(): E {
    return this._error;
  }
}
