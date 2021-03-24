import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { Optional } from './Optional';


type Result<T> = Observable<{
  loading: boolean,
  error?: any,
  value?: Optional<T>
}>;

@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  transform<V>(val: Observable<V | null | undefined>): Result<V> {
    return val.pipe(
      map(value => ({ loading: false, value: Optional.of(value) })),
      startWith({ loading: true }),
      catchError(error => of({ loading: false, error })),
    );
  }
}
