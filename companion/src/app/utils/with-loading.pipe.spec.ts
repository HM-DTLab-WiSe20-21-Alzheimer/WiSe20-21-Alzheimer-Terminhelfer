import { WithLoadingPipe } from './with-loading.pipe';
import { Observable, of, Subject } from 'rxjs';
import { Optional } from './Optional';

describe('WithLoadingPipe', () => {
  let pipe: WithLoadingPipe;

  beforeEach(() => {
    pipe = new WithLoadingPipe();
  });

  describe('Constructor', () => {
    it('should create', () => {
      expect(pipe).toBeDefined();
    });
  });

  describe('transform', () => {

    it('should set loading state', async (done) => {
      const observable$ = new Observable();
      const piped$ = pipe.transform(observable$);

      piped$.subscribe(result => {
        expect(result).toEqual({ loading: true });
        done();
      });
    });

    it('should pipe value', async (done) => {
      const value = 1;
      const observable$ = new Subject();
      const piped$ = pipe.transform(observable$);

      let lastEmitted: any;
      piped$.subscribe({
        next: result => {
          lastEmitted = result;
        },
        complete: () => {
          expect(lastEmitted).toEqual({ loading: false, value: expect.any(Optional) });
          expect(lastEmitted.value.get()).toEqual(value);
          done();
        },
      });

      observable$.next(1);
      observable$.complete();
    });

    it('should pipe error', async (done) => {
      const error = 'error';
      const observable$ = new Subject();
      const piped$ = pipe.transform(observable$);

      let lastEmitted: any;
      piped$.subscribe({
        next: result => {
          lastEmitted = result;
        },
        complete: () => {
          expect(lastEmitted).toEqual({ loading: false, error: expect.any(String) });
          expect(lastEmitted.error).toEqual(error);
          done();
        },
      });

      observable$.error(error);
      observable$.complete();
    });

  });

});
