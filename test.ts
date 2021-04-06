import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
  unreachable,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import {
  NoSuchElementException,
  NullPointerException,
  Optional,
  UnsupportedOperationException,
} from "./mod.ts";

Deno.test("empty", () => {
  const o1 = Optional.empty();
  const o2 = Optional.empty();

  assert(o1.isEmpty());
  assert(o2.isEmpty());
  assertEquals(o1, o2);
});

Deno.test("of", () => {
  const presentValue = {};
  const o1 = Optional.of(presentValue);

  assertEquals(o1.get(), presentValue);
  assertThrows(() => Optional.of(null), NullPointerException);
});

Deno.test("ofNullable", () => {
  const presentValue = {};
  const o1 = Optional.ofNullable(presentValue);
  const o2 = Optional.ofNullable(null);
  const o3 = Optional.empty();

  assertEquals(o1.get(), presentValue);
  assert(o2.isEmpty());
  assertEquals(o2, o3);
});

Deno.test("get", () => {
  const presentValue = {};
  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();

  assertEquals(o1.get(), presentValue);
  assertThrows(() => o2.get(), NoSuchElementException);
});

Deno.test("isPresent", () => {
  const o1 = Optional.of({});
  const o2 = Optional.empty();

  assert(o1.isPresent());
  assert(!o2.isPresent());
});

Deno.test("isEmpty", () => {
  const o1 = Optional.of({});
  const o2 = Optional.empty();

  assert(!o1.isEmpty());
  assert(o2.isEmpty());
});

Deno.test("ifPresent", () => {
  const presentValue = {};
  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();
  let r1: unknown = {};

  o1.ifPresent((v) => {
    r1 = v;
  });
  o2.ifPresent(() => {
    unreachable();
  });

  assertEquals(r1, presentValue);
  assertThrows(() => o1.ifPresent(null), NullPointerException);
});

Deno.test("ifPresentOrElse", () => {
  const presentValue = {};
  const defaultValue = {};

  const o2Present = {};
  const o1Empty = {};
  const o2Empty = {};

  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();

  let r1 = defaultValue;
  let r2 = defaultValue;

  o1.ifPresentOrElse((v) => {
    r1 = v;
  }, () => {
    r1 = o1Empty;
  });
  o2.ifPresentOrElse(() => {
    r2 = o2Present;
  }, () => {
    r2 = o2Empty;
  });

  assertEquals(r1, presentValue);
  assertEquals(r2, o2Empty);
  assertThrows(() => o1.ifPresentOrElse(null, () => {}), NullPointerException);
  assertThrows(() => o2.ifPresentOrElse(() => {}, null), NullPointerException);
});

Deno.test("filter", () => {
  const o1 = Optional.of({});
  const o2 = Optional.empty();

  const r1 = o1.filter(() => true);
  const r2 = o1.filter(() => false);
  const r3 = o2.filter(() => true);
  const r4 = o2.filter(() => false);

  assertEquals(r1, o1);
  assertNotEquals(r2, o1);
  assertEquals(r3, o2);
  assertEquals(r4, o2);

  assert(r1.isPresent());
  assert(r2.isEmpty());
  assert(r3.isEmpty());
  assert(r4.isEmpty());

  assertThrows(() => o1.filter(null), NullPointerException);
  assertThrows(() => o2.filter(null), NullPointerException);
});

Deno.test("map", () => {
  const presentValue = { v: "p" };
  const mappedValue = { v: "m" };
  const defaultValue = { v: "d" };
  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();
  const mapper = (_v: Record<string, unknown>) => mappedValue;

  const r1 = o1.map(mapper);
  const r2 = o1.map<unknown>(() => null);
  const r3 = o2.map(() => mappedValue);

  assertNotEquals(r1, o1);
  assertNotEquals(r2, o1);
  assertEquals(r3, o2);

  assertEquals(r1.orElse(defaultValue), mappedValue);
  assertEquals(r2.orElse(defaultValue), defaultValue);
  assertEquals(r3.orElse(defaultValue), defaultValue);

  assertThrows(() => o1.map(null), NullPointerException);
  assertThrows(() => o2.map(null), NullPointerException);
});

Deno.test("flatMap", () => {
  const o1 = Optional.of(2);
  const o2 = Optional.empty();
  const mappedPresent = Optional.of({});
  const mapperEmpty = Optional.empty();

  const r1 = o1.flatMap(() => mappedPresent);
  const r2 = o1.flatMap(() => mapperEmpty);
  const r3 = o2.flatMap(() => mappedPresent);
  const r4 = o2.flatMap(() => mapperEmpty);
  const r5 = o2.flatMap(() => null);

  assertNotEquals(r1, o1);
  assertNotEquals(r2, o1);
  assertEquals(r3, o2);
  assertEquals(r4, o2);
  assertEquals(r5, o2);

  assertEquals(r1, mappedPresent);
  assertEquals(r2, mapperEmpty);
  assertNotEquals(r3, mappedPresent);
  assertEquals(r4, mapperEmpty);
  assertNotEquals(r5, null);

  assert(r3.isEmpty());
  assert(r4.isEmpty());
  assert(r5.isEmpty());

  assertThrows(() => o1.flatMap(() => null), NullPointerException);
  assertThrows(() => o1.flatMap(null), NullPointerException);
  assertThrows(() => o2.flatMap(null), NullPointerException);
});

Deno.test("or", () => {
  const o1 = Optional.of({});
  const o2 = Optional.empty();
  const mappedPresent = Optional.of({});
  const mappedEmpty = Optional.empty<Record<string, unknown>>();

  const r1 = o1.or(() => mappedPresent);
  const r2 = o1.or(() => mappedEmpty);
  const r3 = o2.or(() => mappedPresent);
  const r4 = o2.or(() => mappedEmpty);

  assertEquals(r1, o1);
  assertEquals(r2, o1);
  assertEquals(r3, mappedPresent);
  assertEquals(r4, mappedEmpty);

  assertThrows(() => o1.or(null), NullPointerException);
  assertThrows(() => o2.or(() => null), NullPointerException);
});

Deno.test("orElse", () => {
  const presentValue = {};
  const defaultValue = {};

  const r1 = Optional.of(presentValue).orElse(defaultValue);
  const r2 = Optional.empty().orElse(defaultValue);
  const r3 = Optional.empty().orElse(null);
  const r4 = Optional.empty().orElse(undefined);

  assertEquals(r1, presentValue);
  assertEquals(r2, defaultValue);
  assertEquals(r3, null);
  assertEquals(r4, undefined);
});

Deno.test("orElseGet", () => {
  const presentValue = {};
  const defaultValue = {};

  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();

  const r1 = o1.orElseGet(() => defaultValue);
  const r2 = o2.orElseGet(() => defaultValue);
  const r3 = o2.orElseGet(() => null);
  const r4 = o2.orElseGet(() => undefined);

  assertEquals(r1, presentValue);
  assertEquals(r2, defaultValue);
  assertEquals(r3, null);
  assertEquals(r4, undefined);

  assertThrows(() => o2.orElseGet(null), NullPointerException);
});

Deno.test("orElseThrow", () => {
  const presentValue = {};
  const o1 = Optional.of(presentValue);
  const o2 = Optional.empty();

  class CustomError extends Error {}

  assertEquals(o1.orElseThrow(() => new CustomError()), presentValue);

  assertThrows(() => o2.orElseThrow(null), NullPointerException);
  assertThrows(() => o2.orElseThrow(() => null), NoSuchElementException);
  assertThrows(() => o2.orElseThrow(() => new CustomError()), CustomError);
});

Deno.test("equals", () => {
  const presentValue = {};
  const otherValue = {};
  const o1 = Optional.of(presentValue);
  const o2 = Optional.of(presentValue);
  const o3 = Optional.of(otherValue);
  const o4 = Optional.empty();
  const o5 = Optional.empty();

  assert(o1.equals(o1));
  assert(o2.equals(o2));
  assert(o3.equals(o3));
  assert(o4.equals(o4));
  assert(o5.equals(o5));
  assert(o1.equals(o2));
  assert(o4.equals(o5));
  assert(!o1.equals(o3));
  assert(!o2.equals(o3));
  assert(!o4.equals(o3));
  assert(!o5.equals(o3));
  assert(!o3.equals(o1));
  assert(!o3.equals(o2));
  assert(!o3.equals(o4));
  assert(!o3.equals(o5));
});

Deno.test("toString", () => {
  assertEquals(Optional.of("foo").toString(), "Optional[foo]");
  assertEquals(Optional.of(1).toString(), "Optional[1]");
  assertEquals(Optional.empty().toString(), "Optional.empty");
});

Deno.test("stream", () => {
  assertThrows(() => Optional.of(1).stream(), UnsupportedOperationException);
});

Deno.test("hashCode", () => {
  assertThrows(() => Optional.of(1).hashCode(), UnsupportedOperationException);
});
