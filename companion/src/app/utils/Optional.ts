export class Optional<V> {
  private constructor(private readonly value: V | undefined | null) {
  }

  static of<V>(value: V | undefined | null): Optional<V> {
    return new Optional<any>(value);
  }

  isEmpty(): boolean {
    return this.value === null || this.value === undefined;
  }

  get(): V | undefined | null {
    return this.value;
  }

  getOrThrow(): V {
    if (this.value === null || this.value === undefined) {
      throw new Error('Content not set');
    }
    return this.value;
  }
}
