import { pipe } from "@effect/data/Function"
import * as A from "@effect/schema/Arbitrary"
import * as S from "@effect/schema/Schema"
import * as fc from "fast-check"

export const propertyTo = <I, A>(schema: S.Schema<I, A>) => {
  const arbitrary = A.to(schema)
  const is = S.is(schema)
  fc.assert(fc.property(arbitrary(fc), (a) => is(a)))
}

export const propertyFrom = <I, A>(schema: S.Schema<I, A>) => {
  const arbitrary = A.from(schema)
  const is = S.is(S.from(schema))
  fc.assert(fc.property(arbitrary(fc), (a) => is(a)))
}

describe.concurrent("Arbitrary", () => {
  it("exports", () => {
    expect(A.ArbitraryHookId).exist
  })

  it("to", () => {
    const schema = S.numberFromString(S.string)
    propertyTo(schema)
  })

  it("from", () => {
    const NumberFromString = S.numberFromString(S.string)
    const schema = S.struct({
      a: NumberFromString,
      b: S.tuple(NumberFromString),
      c: S.union(NumberFromString, S.boolean),
      d: pipe(NumberFromString, S.positive()),
      e: S.optionFromSelf(NumberFromString)
    })
    propertyFrom(schema)
  })

  it("from/ lazy", () => {
    const NumberFromString = S.numberFromString(S.string)
    interface I {
      readonly a: string | I
    }
    interface A {
      readonly a: number | A
    }
    const schema: S.Schema<I, A> = S.lazy(() =>
      S.struct({
        a: S.union(NumberFromString, schema)
      })
    )
    propertyFrom(schema)
  })

  it("templateLiteral. a", () => {
    const schema = S.templateLiteral(S.literal("a"))
    propertyTo(schema)
  })

  it("templateLiteral. a b", () => {
    const schema = S.templateLiteral(S.literal("a"), S.literal(" "), S.literal("b"))
    propertyTo(schema)
  })

  it("templateLiteral. a${string}", () => {
    const schema = S.templateLiteral(S.literal("a"), S.string)
    propertyTo(schema)
  })

  it("templateLiteral. a", () => {
    const schema = S.templateLiteral(S.literal("a"))
    propertyTo(schema)
  })

  it("templateLiteral. ${string}", () => {
    const schema = S.templateLiteral(S.string)
    propertyTo(schema)
  })

  it("templateLiteral. a${string}b", () => {
    const schema = S.templateLiteral(S.literal("a"), S.string, S.literal("b"))
    propertyTo(schema)
  })

  it("never", () => {
    expect(() => A.to(S.never)(fc)).toThrowError(
      new Error("cannot build an Arbitrary for `never`")
    )
  })

  it("string", () => {
    propertyTo(S.string)
  })

  it("void", () => {
    propertyTo(S.void)
  })

  it("number", () => {
    propertyTo(S.number)
  })

  it("boolean", () => {
    propertyTo(S.boolean)
  })

  it("bigint", () => {
    propertyTo(S.bigint)
  })

  it("symbol", () => {
    propertyTo(S.symbol)
  })

  it("object", () => {
    propertyTo(S.object)
  })

  it("literal 1 member", () => {
    const schema = S.literal(1)
    propertyTo(schema)
  })

  it("literal 2 members", () => {
    const schema = S.literal(1, "a")
    propertyTo(schema)
  })

  it("uniqueSymbol", () => {
    const a = Symbol.for("@effect/schema/test/a")
    const schema = S.uniqueSymbol(a)
    propertyTo(schema)
  })

  it("empty enums should throw", () => {
    enum Fruits {}
    const schema = S.enums(Fruits)
    expect(() => A.to(schema)(fc)).toThrowError(
      new Error("cannot build an Arbitrary for an empty enum")
    )
  })

  it("Numeric enums", () => {
    enum Fruits {
      Apple,
      Banana
    }
    const schema = S.enums(Fruits)
    propertyTo(schema)
  })

  it("String enums", () => {
    enum Fruits {
      Apple = "apple",
      Banana = "banana",
      Cantaloupe = 0
    }
    const schema = S.enums(Fruits)
    propertyTo(schema)
  })

  it("Const enums", () => {
    const Fruits = {
      Apple: "apple",
      Banana: "banana",
      Cantaloupe: 3
    } as const
    const schema = S.enums(Fruits)
    propertyTo(schema)
  })

  it("tuple. empty", () => {
    const schema = S.tuple()
    propertyTo(schema)
  })

  it("tuple. required element", () => {
    const schema = S.tuple(S.number)
    propertyTo(schema)
  })

  it("tuple. required element with undefined", () => {
    const schema = S.tuple(S.union(S.number, S.undefined))
    propertyTo(schema)
  })

  it("tuple. optional element", () => {
    const schema = pipe(S.tuple(), S.optionalElement(S.number))
    propertyTo(schema)
  })

  it("tuple. optional element with undefined", () => {
    const schema = pipe(S.tuple(), S.optionalElement(S.union(S.number, S.undefined)))
    propertyTo(schema)
  })

  it("tuple. e + e?", () => {
    const schema = pipe(S.tuple(S.string), S.optionalElement(S.number))
    propertyTo(schema)
  })

  it("tuple. e + r", () => {
    const schema = pipe(S.tuple(S.string), S.rest(S.number))
    propertyTo(schema)
  })

  it("tuple. e? + r", () => {
    const schema = pipe(S.tuple(), S.optionalElement(S.string), S.rest(S.number))
    propertyTo(schema)
  })

  it("tuple. r", () => {
    const schema = S.array(S.number)
    propertyTo(schema)
  })

  it("tuple. r + e", () => {
    const schema = pipe(S.array(S.string), S.element(S.number))
    propertyTo(schema)
  })

  it("tuple. e + r + e", () => {
    const schema = pipe(S.tuple(S.string), S.rest(S.number), S.element(S.boolean))
    propertyTo(schema)
  })

  it("lazy", () => {
    type A = readonly [number, A | null]
    const schema: S.Schema<A> = S.lazy<A>(
      () => S.tuple(S.number, S.union(schema, S.literal(null)))
    )
    propertyTo(schema)
  })

  describe.concurrent("struct", () => {
    it("required property signature", () => {
      const schema = S.struct({ a: S.number })
      propertyTo(schema)
    })

    it("required property signature with undefined", () => {
      const schema = S.struct({ a: S.union(S.number, S.undefined) })
      propertyTo(schema)
    })

    it("optional property signature", () => {
      const schema = S.struct({ a: S.optional(S.number) })
      propertyTo(schema)
    })

    it("optional property signature with undefined", () => {
      const schema = S.struct({ a: S.optional(S.union(S.number, S.undefined)) })
      propertyTo(schema)
    })

    it("baseline", () => {
      const schema = S.struct({ a: S.string, b: S.number })
      propertyTo(schema)
    })
  })

  it("union", () => {
    const schema = S.union(S.string, S.number)
    propertyTo(schema)
  })

  it("record(string, string)", () => {
    const schema = S.record(S.string, S.string)
    propertyTo(schema)
  })

  it("record(symbol, string)", () => {
    const schema = S.record(S.symbol, S.string)
    propertyTo(schema)
  })

  describe.concurrent("partial", () => {
    it("struct", () => {
      const schema = pipe(S.struct({ a: S.number }), S.partial)
      propertyTo(schema)
    })

    it("tuple", () => {
      const schema = S.partial(S.tuple(S.string, S.number))
      propertyTo(schema)
    })

    it("array", () => {
      const schema = pipe(S.array(S.number), S.partial)
      propertyTo(schema)
    })

    it("union", () => {
      const schema = pipe(S.union(S.string, S.array(S.number)), S.partial)
      propertyTo(schema)
    })
  })

  describe.concurrent("nullables", () => {
    it("nullable (1)", () => {
      /* Schema<{ readonly a: number | null; }> */
      const schema = S.struct({ a: S.union(S.number, S.literal(null)) })
      propertyTo(schema)
    })

    it("nullable (2)", () => {
      /* Schema<{ readonly a: number | null | undefined; }> */
      const schema = S.struct({ a: S.union(S.number, S.literal(null), S.undefined) })
      propertyTo(schema)
    })

    it("nullable (3)", () => {
      /*Schema<{ readonly a?: number | null | undefined; }> */
      const schema = S.struct({ a: S.optional(S.union(S.number, S.literal(null))) })
      propertyTo(schema)
    })

    it("nullable (4)", () => {
      /* Schema<{ readonly a?: number | null | undefined; }> */
      const schema = S.struct({ a: S.optional(S.union(S.number, S.literal(null), S.undefined)) })
      propertyTo(schema)
    })
  })

  it("minLength", () => {
    const schema = pipe(S.string, S.minLength(1))
    propertyTo(schema)
  })

  it("maxLength", () => {
    const schema = pipe(S.string, S.maxLength(2))
    propertyTo(schema)
  })

  it("lessThanOrEqualTo", () => {
    const schema = pipe(S.number, S.lessThanOrEqualTo(1))
    propertyTo(schema)
  })

  it("greaterThanOrEqualTo", () => {
    const schema = pipe(S.number, S.greaterThanOrEqualTo(1))
    propertyTo(schema)
  })

  it("lessThan", () => {
    const schema = pipe(S.number, S.lessThan(1))
    propertyTo(schema)
  })

  it("greaterThan", () => {
    const schema = pipe(S.number, S.greaterThan(1))
    propertyTo(schema)
  })

  it("startsWith", () => {
    const schema = pipe(S.string, S.startsWith("a"))
    propertyTo(schema)
  })

  it("endsWith", () => {
    const schema = pipe(S.string, S.endsWith("a"))
    propertyTo(schema)
  })

  it("int", () => {
    const schema = pipe(S.number, S.int())
    propertyTo(schema)
  })

  it("nonNaN", () => {
    const schema = pipe(S.number, S.nonNaN())
    propertyTo(schema)
  })

  it("finite", () => {
    const schema = pipe(S.number, S.finite())
    propertyTo(schema)
  })

  it("extend/ struct + record", () => {
    const schema = pipe(
      S.struct({ a: S.string }),
      S.extend(S.record(S.string, S.union(S.string, S.number)))
    )
    propertyTo(schema)
  })
})
