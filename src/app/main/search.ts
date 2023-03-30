import { map, OperatorFunction, pairwise, pipe } from 'rxjs';

export function withPreviousItem<T>(): OperatorFunction<
  T,
  {
    previous?: T;
    current: T;
  }
> {
  return pipe(
    pairwise(),
    map(([previous, current]) => ({
      previous,
      current: current!,
    })),
  );
}
