import { pipe } from "@effect/data/Function";
import * as S from "@effect/schema/Schema";

declare const NumberFromString: S.Schema<string, number>

// ---------------------------------------------
// Primitives
// ---------------------------------------------

// $ExpectType Schema<void, void>
S.void;

// $ExpectType Schema<undefined, undefined>
S.undefined;

// $ExpectType Schema<string, string>
S.string;

// $ExpectType Schema<number, number>
S.number;

// $ExpectType Schema<boolean, boolean>
S.boolean;

// $ExpectType Schema<bigint, bigint>
S.bigint;

// $ExpectType Schema<symbol, symbol>
S.symbol;

// $ExpectType Schema<unknown, unknown>
S.unknown;

// $ExpectType Schema<any, any>
S.any;

// $ExpectType Schema<object, object>
S.object;

// ---------------------------------------------
// literals
// ---------------------------------------------

// $ExpectType Schema<null, null>
S.null;

// $ExpectType Schema<never, never>
S.literal();

// $ExpectType Schema<"a", "a">
S.literal("a");

// $ExpectType Schema<"a" | "b" | "c", "a" | "b" | "c">
S.literal("a", "b", "c");

// $ExpectType Schema<1, 1>
S.literal(1);

// $ExpectType Schema<2n, 2n>
S.literal(2n); // bigint literal

// $ExpectType Schema<true, true>
S.literal(true);

// ---------------------------------------------
// strings
// ---------------------------------------------

// $ExpectType Schema<string, string>
pipe(S.string, S.maxLength(5));

// $ExpectType Schema<string, string>
pipe(S.string, S.minLength(5));

// $ExpectType Schema<string, string>
pipe(S.string, S.length(5));

// $ExpectType Schema<string, string>
pipe(S.string, S.pattern(/a/));

// $ExpectType Schema<string, string>
pipe(S.string, S.startsWith('a'));

// $ExpectType Schema<string, string>
pipe(S.string, S.endsWith('a'));

// $ExpectType Schema<string, string>
pipe(S.string, S.includes('a'));

// $ExpectType Schema<number, number>
pipe(S.number, S.greaterThan(5));

// $ExpectType Schema<number, number>
pipe(S.number, S.greaterThanOrEqualTo(5));

// $ExpectType Schema<number, number>
pipe(S.number, S.lessThan(5));

// $ExpectType Schema<number, number>
pipe(S.number, S.lessThanOrEqualTo(5));

// $ExpectType Schema<number, number>
pipe(S.number, S.int());

// $ExpectType Schema<number, number>
pipe(S.number, S.nonNaN()); // not NaN

// $ExpectType Schema<number, number>
pipe(S.number, S.finite()); // value must be finite, not Infinity or -Infinity

// ---------------------------------------------
// Native enums
// ---------------------------------------------

enum Fruits {
  Apple,
  Banana,
}

// $ExpectType Schema<Fruits, Fruits>
S.enums(Fruits);

//
// Nullables
//

// $ExpectType Schema<string | null, string | null>
S.nullable(S.string)

// $ExpectType Schema<string | null, number | null>
S.nullable(NumberFromString)

// ---------------------------------------------
// Unions
// ---------------------------------------------

// $ExpectType Schema<string | number, string | number>
S.union(S.string, S.number);

// $ExpectType Schema<string | boolean, number | boolean>
S.union(S.boolean, NumberFromString);

// ---------------------------------------------
// keyof
// ---------------------------------------------

// $ExpectType Schema<"a" | "b", "a" | "b">
S.keyof(S.struct({ a: S.string,  b: NumberFromString }));

// ---------------------------------------------
// Tuples
// ---------------------------------------------

// $ExpectType Schema<readonly [string, number], readonly [string, number]>
S.tuple(S.string, S.number);

// $ExpectType Schema<readonly [string, string], readonly [string, number]>
S.tuple(S.string, NumberFromString);

// ---------------------------------------------
// rest
// ---------------------------------------------

// $ExpectType Schema<readonly [string, number, ...boolean[]], readonly [string, number, ...boolean[]]>
pipe(S.tuple(S.string, S.number), S.rest(S.boolean))

// $ExpectType Schema<readonly [string, string, ...string[]], readonly [string, number, ...number[]]>
pipe(S.tuple(S.string, NumberFromString), S.rest(NumberFromString))

// ---------------------------------------------
// element
// ---------------------------------------------

// $ExpectType Schema<readonly [string, number, boolean], readonly [string, number, boolean]>
pipe(S.tuple(S.string, S.number), S.element(S.boolean))

// $ExpectType Schema<readonly [string, string, string], readonly [string, number, number]>
pipe(S.tuple(S.string, NumberFromString), S.element(NumberFromString))

// ---------------------------------------------
// optionalElement
// ---------------------------------------------

// $ExpectType Schema<readonly [string, number, boolean?], readonly [string, number, boolean?]>
pipe(S.tuple(S.string, S.number), S.optionalElement(S.boolean))

// $ExpectType Schema<readonly [string, string, string?], readonly [string, number, number?]>
pipe(S.tuple(S.string, NumberFromString), S.optionalElement(NumberFromString))

// ---------------------------------------------
// Arrays
// ---------------------------------------------

// $ExpectType Schema<readonly number[], readonly number[]>
S.array(S.number);

// $ExpectType Schema<readonly string[], readonly number[]>
S.array(NumberFromString);

// $ExpectType Schema<readonly [number, ...number[]], readonly [number, ...number[]]>
S.nonEmptyArray(S.number);

// $ExpectType Schema<readonly [string, ...string[]], readonly [number, ...number[]]>
S.nonEmptyArray(NumberFromString);

// ---------------------------------------------
// Structs
// ---------------------------------------------

// $ExpectType Schema<{ readonly a: string; readonly b: number; }, { readonly a: string; readonly b: number; }>
S.struct({ a: S.string,  b: S.number });

// $ExpectType Schema<{ readonly a: string; readonly b: string; }, { readonly a: string; readonly b: number; }>
const MyModel = S.struct({ a: S.string,  b: NumberFromString });

// $ExpectType { readonly a: string; readonly b: string; }
export type MyModelFrom = S.From<typeof MyModel>

// $ExpectType { readonly a: string; readonly b: number; }
export type MyModelTo = S.To<typeof MyModel>

// ---------------------------------------------
// optional
// ---------------------------------------------

// $ExpectType Schema<{ readonly a: string; readonly b: number; readonly c?: boolean; }, { readonly a: string; readonly b: number; readonly c?: boolean; }>
S.struct({ a: S.string, b: S.number, c: S.optional(S.boolean) });

// $ExpectType Schema<{ readonly a: string; readonly b: number; readonly c?: string; }, { readonly a: string; readonly b: number; readonly c?: number; }>
S.struct({ a: S.string, b: S.number, c: S.optional(NumberFromString) });

// ---------------------------------------------
// Pick
// ---------------------------------------------

// $ExpectType Schema<{ readonly a: string; }, { readonly a: string; }>
pipe(S.struct({ a: S.string,  b: S.number }), S.pick('a'));

// $ExpectType Schema<{ readonly b: string; }, { readonly b: number; }>
pipe(S.struct({ a: S.string,  b: NumberFromString }), S.pick('b'));

// ---------------------------------------------
// Omit
// ---------------------------------------------

// $ExpectType Schema<{ readonly b: number; }, { readonly b: number; }>
pipe(S.struct({ a: S.string,  b: S.number }), S.omit('a'));

// $ExpectType Schema<{ readonly b: string; }, { readonly b: number; }>
pipe(S.struct({ a: S.string,  b: NumberFromString }), S.omit('a'));

// ---------------------------------------------
// getPropertySignatures
// ---------------------------------------------

// $ExpectType { readonly a: Schema<string, string>; readonly b: Schema<number, number>; }
S.getPropertySignatures(S.struct({ a: S.string,  b: S.number }))

// $ExpectType { readonly a: Schema<string, string>; readonly b: Schema<string, number>; }
S.getPropertySignatures(S.struct({ a: S.string,  b: NumberFromString }))

// ---------------------------------------------
// brand
// ---------------------------------------------

// $ExpectType BrandSchema<number, number & Brand<"Int">>
pipe(S.number, S.int(), S.brand('Int'))

// $ExpectType BrandSchema<string, number & Brand<"Int">>
pipe(NumberFromString, S.int(), S.brand('Int'))

// ---------------------------------------------
// Partial
// ---------------------------------------------

// $ExpectType Schema<Partial<{ readonly a: string; readonly b: number; }>, Partial<{ readonly a: string; readonly b: number; }>>
S.partial(S.struct({ a: S.string,  b: S.number }));

// $ExpectType Schema<Partial<{ readonly a: string; readonly b: string; }>, Partial<{ readonly a: string; readonly b: number; }>>
S.partial(S.struct({ a: S.string,  b: NumberFromString }));

// ---------------------------------------------
// Records
// ---------------------------------------------

// $ExpectType Schema<{ readonly [x: string]: string; }, { readonly [x: string]: string; }>
S.record(S.string, S.string)

// $ExpectType Schema<{ readonly [x: string]: string; }, { readonly [x: string]: number; }>
S.record(S.string, NumberFromString)

// $ExpectType Schema<{ readonly [x: string]: string; }, { readonly [x: string]: string; }>
S.record(pipe(S.string, S.minLength(2)), S.string)

// $ExpectType Schema<{ readonly a: string; readonly b: string; }, { readonly a: string; readonly b: string; }>
S.record(S.union(S.literal('a'), S.literal('b')), S.string)

// $ExpectType Schema<{ readonly [x: symbol]: string; }, { readonly [x: symbol]: string; }>
S.record(S.symbol, S.string)

// $ExpectType Schema<{ readonly [x: `a${string}`]: string; }, { readonly [x: `a${string}`]: string; }>
S.record(S.templateLiteral(S.literal('a'), S.string), S.string)

// ---------------------------------------------
// Extend
// ---------------------------------------------

// $ExpectType Schema<{ readonly a: string; readonly b: string; readonly c: string; }, { readonly a: string; readonly b: string; readonly c: string; }>
pipe(
  S.struct({ a: S.string, b: S.string }),
  S.extend(S.struct({ c: S.string })),
);

// $ExpectType Schema<{ [x: string]: string; readonly a: string; readonly b: string; readonly c: string; }, { [x: string]: string; readonly a: string; readonly b: string; readonly c: string; }>
pipe(
  S.struct({ a: S.string, b: S.string }),
  S.extend(S.struct({ c: S.string })),
  S.extend(S.record(S.string, S.string))
);

// ---------------------------------------------
// lazy
// ---------------------------------------------

interface LazyTo1 {
  readonly a: number
  readonly as: ReadonlyArray<LazyTo1>
}
const lazy1: S.Schema<LazyTo1> = S.lazy(() =>
  S.struct({
    a: S.number,
    as: S.array(lazy1)
  })
)

interface LazyFrom2 {
  readonly a: string
  readonly as: ReadonlyArray<LazyFrom2>
}
interface LazyTo2 {
  readonly a: number
  readonly as: ReadonlyArray<LazyTo2>
}
const lazy2: S.Schema<LazyFrom2, LazyTo2> = S.lazy(() =>
  S.struct({
    a: NumberFromString,
    as: S.array(lazy2)
  })
)

// ---------------------------------------------
// optionFromSelf
// ---------------------------------------------

// $ExpectType Schema<Option<number>, Option<number>>
S.optionFromSelf(S.number)

// $ExpectType Schema<Option<string>, Option<number>>
S.optionFromSelf(NumberFromString)

// ---------------------------------------------
// optionsFromOptionals
// ---------------------------------------------

// $ExpectType Schema<{ readonly a: string; readonly b?: number; }, { readonly a: string; readonly b: Option<number>; }>
pipe(S.struct({ a: S.string }), S.optionsFromOptionals({ b: S.number }))

// $ExpectType Schema<{ readonly a: string; readonly b?: string; }, { readonly a: string; readonly b: Option<number>; }>
pipe(S.struct({ a: S.string }), S.optionsFromOptionals({ b: NumberFromString }))

// ---------------------------------------------
// instanceOf
// ---------------------------------------------

class Test {
  constructor(readonly name: string) {}
}

// $ExpectType Schema<Test, Test>
S.instanceOf(Test);

// ---------------------------------------------
// Template literals
// ---------------------------------------------

// $ExpectType Schema<`a${string}`, `a${string}`>
S.templateLiteral(S.literal('a'), S.string)

// example from https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
const EmailLocaleIDs = S.literal("welcome_email", "email_heading")
const FooterLocaleIDs = S.literal("footer_title", "footer_sendoff")

// $ExpectType Schema<"welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id", "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id">
S.templateLiteral(S.union(EmailLocaleIDs, FooterLocaleIDs), S.literal("_id"))

// ---------------------------------------------
// attachPropertySignature
// ---------------------------------------------

// $ExpectType Schema<{ readonly radius: number; }, { readonly radius: number; readonly kind: "circle"; }>
pipe(S.struct({ radius: S.number }), S.attachPropertySignature("kind", "circle"))

// $ExpectType Schema<{ readonly radius: string; }, { readonly radius: number; readonly kind: "circle"; }>
pipe(S.struct({ radius: NumberFromString }), S.attachPropertySignature("kind", "circle"))
