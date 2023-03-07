import * as E from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import type { NonEmptyReadonlyArray } from "@effect/data/ReadonlyArray"
import * as Effect from "@effect/io/Effect"
import * as annotations from "@effect/schema/annotation/AST"
import * as A from "@effect/schema/Arbitrary"
import * as AST from "@effect/schema/AST"
import type { ParseOptions } from "@effect/schema/AST"
import { formatActual, formatErrors, formatExpected } from "@effect/schema/formatter/Tree"
import type { ParseError } from "@effect/schema/ParseError"
import * as P from "@effect/schema/Parser"
import type { Schema } from "@effect/schema/Schema"
import * as fc from "fast-check"

export const property = <A>(schema: Schema<A>) => {
  const arbitrary = A.arbitrary(schema)
  const is = P.is(schema)
  fc.assert(fc.property(arbitrary(fc), (a) => {
    if (!is(a)) {
      return false
    }
    const roundtrip = pipe(
      a,
      P.encodeEffect(schema),
      Effect.flatMap(P.decodeEffect(schema)),
      Effect.runSyncEither
    )
    if (E.isLeft(roundtrip)) {
      return false
    }
    return is(roundtrip.right)
  }))
}

export const expectDecodingSuccess = <A>(
  schema: Schema<A>,
  u: unknown,
  a: A = u as any,
  options?: ParseOptions
) => {
  const t = Effect.runSyncEither(P.decodeEffect(schema)(u, options))
  expect(t).toStrictEqual(E.right(a))
}

export const expectDecodingFailure = <A>(
  schema: Schema<A>,
  u: unknown,
  message: string,
  options?: ParseOptions
) => {
  const t = pipe(P.decodeEffect(schema)(u, options), Effect.runSyncEither, E.mapLeft(formatAll))
  expect(t).toStrictEqual(E.left(message))
}

export const expectEncodingSuccess = <A>(
  schema: Schema<A>,
  a: A,
  o: unknown,
  options?: ParseOptions
) => {
  const t = Effect.runSyncEither(P.encodeEffect(schema)(a, options))
  expect(t).toStrictEqual(E.right(o))
}

export const expectEncodingFailure = <A>(
  schema: Schema<A>,
  a: A,
  message: string,
  options?: ParseOptions
) => {
  const t = pipe(P.encodeEffect(schema)(a, options), Effect.runSyncEither, E.mapLeft(formatAll))
  expect(t).toStrictEqual(E.left(message))
}

const formatAll = (errors: NonEmptyReadonlyArray<ParseError>): string => {
  return pipe(errors, RA.map(formatDecodeError), RA.join(", "))
}

const getMessage = AST.getAnnotation<annotations.Message<unknown>>(annotations.MessageId)

const formatDecodeError = (e: ParseError): string => {
  switch (e._tag) {
    case "Type":
      return pipe(
        getMessage(e.expected),
        O.map((f) => f(e.actual)),
        O.getOrElse(() =>
          `Expected ${formatExpected(e.expected)}, actual ${formatActual(e.actual)}`
        )
      )
    case "Index":
      return `/${e.index} ${pipe(e.errors, RA.map(formatDecodeError), RA.join(", "))}`
    case "Key":
      return `/${String(e.key)} ${pipe(e.errors, RA.map(formatDecodeError), RA.join(", "))}`
    case "Missing":
      return `is missing`
    case "Unexpected":
      return `is unexpected`
    case "UnionMember":
      return `union member: ${pipe(e.errors, RA.map(formatDecodeError), RA.join(", "))}`
  }
}

export const expectDecodingFailureTree = <A>(schema: Schema<A>, u: unknown, message: string) => {
  const t = pipe(P.decodeEffect(schema)(u), Effect.runSyncEither, E.mapLeft(formatErrors))
  expect(E.isLeft(t)).toEqual(true)
  expect(t).toEqual(E.left(message))
}
