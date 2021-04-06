export class NoSuchElementException extends Error {}
export class NullPointerException extends Error {}
export class UnsupportedOperationException extends Error {}

export type Empty = null | undefined;
export type Nullable<T> = T | Empty;

export class Optional<T> {
  private static readonly EMPTY: Optional<unknown> = new Optional(null);

  private value: Nullable<T>;

  private constructor(value: T) {
    this.value = value;
  }

  static empty<T>(): Optional<Nullable<T>> {
    return <Optional<Nullable<T>>> Optional.EMPTY;
  }

  static of<T>(value: Nullable<T>): Optional<T> {
    if (value == null) throw new NullPointerException();
    return new Optional(value);
  }

  static ofNullable<T>(value: Nullable<T>): Optional<Nullable<T>> {
    return value == null
      ? Optional.empty<T>()
      : <Optional<Nullable<T>>> Optional.of<T>(value);
  }

  get(): T {
    if (this.value == null) {
      throw new NoSuchElementException("No value present");
    }
    return this.value;
  }

  isPresent(): boolean {
    return this.value != null;
  }

  isEmpty(): boolean {
    return this.value == null;
  }

  ifPresent(action: Empty | ((value: T) => void)): void {
    if (this.value == null) return;
    if (action == null) throw new NullPointerException();
    action(this.value);
  }

  ifPresentOrElse(
    action: Empty | ((value: T) => void),
    emptyAction: Empty | (() => void),
  ): void {
    if (this.value == null) {
      if (emptyAction != null) {
        emptyAction();
      } else {
        throw new NullPointerException();
      }
    } else {
      if (action != null) {
        action(this.value);
      } else {
        throw new NullPointerException();
      }
    }
  }

  filter(predicate: Empty | ((value: T) => boolean)): Optional<Nullable<T>> {
    if (predicate == null) throw new NullPointerException();

    return (this.value == null || predicate(this.value))
      ? this
      : Optional.empty<T>();
  }

  map<U>(mapper: Empty | ((value: T) => Nullable<U>)): Optional<Nullable<U>> {
    if (mapper == null) throw new NullPointerException();

    return this.value == null
      ? Optional.empty<U>()
      : Optional.ofNullable(mapper(this.value));
  }

  flatMap<U>(
    mapper: Empty | ((value: T) => Empty | Optional<Nullable<U>>),
  ): Optional<Nullable<U>> {
    if (mapper == null) throw new NullPointerException();
    if (this.value == null) return Optional.empty<U>();

    const result = mapper(this.value);
    if (result == null) throw new NullPointerException();

    return result;
  }

  or(
    supplier: Empty | (() => Empty | Optional<Nullable<T>>),
  ): Optional<Nullable<T>> {
    if (supplier == null) throw new NullPointerException();
    if (this.value != null) return this;

    const result = supplier();
    if (result == null) throw new NullPointerException();

    return result;
  }

  orElse(other: Nullable<T>): Nullable<T> {
    return this.value == null ? other : this.value;
  }

  orElseGet(supplier: Empty | (() => Nullable<T>)): Nullable<T> {
    if (this.value != null) this.value;
    if (supplier == null) throw new NullPointerException();

    return supplier();
  }

  orElseThrow<X extends Error>(
    exceptionSupplier: Empty | (() => Empty | X),
  ): T {
    if (this.value != null) return this.value;
    if (exceptionSupplier == null) throw new NullPointerException();

    throw exceptionSupplier() ?? new NoSuchElementException("No value present");
  }

  equals(obj: unknown): boolean {
    if (this === obj) return true;
    if (!(obj instanceof Optional)) return false;
    if (this.isEmpty() || obj.isEmpty()) return false;
    if (this.get() == obj.get()) return true;

    return false;
  }

  toString(): string {
    return this.value == null ? "Optional.empty" : `Optional[${this.value}]`;
  }

  stream(): void {
    throw new UnsupportedOperationException();
  }

  hashCode(): void {
    throw new UnsupportedOperationException();
  }
}
