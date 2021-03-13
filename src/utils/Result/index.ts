import { Result as ResultType } from './Result';

export { Success, Failure, success, failure } from './Result';
export type Result<T, E> = ResultType<T, E>;
