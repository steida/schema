/**
 * @since 1.0.0
 */

import { pipe } from "@effect/data/Function"
import * as Number from "@effect/data/Number"
import { isNumber } from "@effect/data/Number"
import type { Option } from "@effect/data/Option"
import * as O from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import { isString } from "@effect/data/String"
import * as Order from "@effect/data/typeclass/Order"
import * as I from "@effect/schema/internal/common"
import type { ParseResult } from "@effect/schema/ParseResult"

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 1.0.0
 */
export type AST =
  | Declaration
  | Literal
  | UniqueSymbol
  | UndefinedKeyword
  | VoidKeyword
  | NeverKeyword
  | UnknownKeyword
  | AnyKeyword
  | StringKeyword
  | NumberKeyword
  | BooleanKeyword
  | BigIntKeyword
  | SymbolKeyword
  | ObjectKeyword
  | Enums
  | TemplateLiteral
  | Tuple
  | TypeLiteral
  | Union
  | Lazy
  | Refinement
  | Transform

// ---------------------------------------------
// annotations
// ---------------------------------------------

/**
 * @category annotations
 * @since 1.0.0
 */
export type BrandAnnotation = ReadonlyArray<string>

/**
 * @category annotations
 * @since 1.0.0
 */
export const BrandAnnotationId = "@effect/schema/BrandAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type TypeAnnotation = string | symbol

/**
 * @category annotations
 * @since 1.0.0
 */
export const TypeAnnotationId = "@effect/schema/TypeAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type MessageAnnotation<A> = (a: A) => string

/**
 * @category annotations
 * @since 1.0.0
 */
export const MessageAnnotationId = "@effect/schema/MessageAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type IdentifierAnnotation = string

/**
 * @category annotations
 * @since 1.0.0
 */
export const IdentifierAnnotationId = "@effect/schema/IdentifierAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type TitleAnnotation = string

/**
 * @category annotations
 * @since 1.0.0
 */
export const TitleAnnotationId = "@effect/schema/TitleAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type DescriptionAnnotation = string

/**
 * @category annotations
 * @since 1.0.0
 */
export const DescriptionAnnotationId = "@effect/schema/DescriptionAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type ExamplesAnnotation = ReadonlyArray<unknown>

/**
 * @category annotations
 * @since 1.0.0
 */
export const ExamplesAnnotationId = "@effect/schema/ExamplesAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type JSONSchemaAnnotation = object

/**
 * @category annotations
 * @since 1.0.0
 */
export const JSONSchemaAnnotationId = "@effect/schema/JSONSchemaAnnotationId"

/**
 * @category annotations
 * @since 1.0.0
 */
export type DocumentationAnnotation = string

/**
 * @category annotations
 * @since 1.0.0
 */
export const DocumentationAnnotationId = "@effect/schema/DocumentationAnnotationId"

// ---------------------------------------------
// models
// ---------------------------------------------

/**
 * @since 1.0.0
 */
export interface Annotated {
  readonly annotations: Record<string | symbol, unknown>
}

/**
 * @since 1.0.0
 */
export const getAnnotation = <A>(key: PropertyKey) =>
  (annotated: Annotated): O.Option<A> =>
    Object.prototype.hasOwnProperty.call(annotated.annotations, key) ?
      O.some(annotated.annotations[key] as any) :
      O.none()

/**
 * @category model
 * @since 1.0.0
 */
export interface Declaration extends Annotated {
  readonly _tag: "Declaration"
  readonly typeParameters: ReadonlyArray<AST>
  readonly type: AST
  readonly decode: (
    ...typeParameters: ReadonlyArray<AST>
  ) => (input: any, options?: ParseOptions) => ParseResult<any>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createDeclaration = (
  typeParameters: ReadonlyArray<AST>,
  type: AST,
  decode: (
    ...typeParameters: ReadonlyArray<AST>
  ) => (input: unknown, options?: ParseOptions) => ParseResult<any>,
  annotations: Annotated["annotations"] = {}
): Declaration => ({ _tag: "Declaration", typeParameters, type, decode, annotations })

/**
 * @category guards
 * @since 1.0.0
 */
export const isDeclaration = (ast: AST): ast is Declaration => ast._tag === "Declaration"

/**
 * @since 1.0.0
 */
export type LiteralValue = string | number | boolean | null | bigint

/**
 * @category model
 * @since 1.0.0
 */
export interface Literal extends Annotated {
  readonly _tag: "Literal"
  readonly literal: LiteralValue
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createLiteral = (
  literal: LiteralValue
): Literal => ({ _tag: "Literal", literal, annotations: {} })

/**
 * @category guards
 * @since 1.0.0
 */
export const isLiteral = (ast: AST): ast is Literal => ast._tag === "Literal"

/**
 * @category model
 * @since 1.0.0
 */
export interface UniqueSymbol extends Annotated {
  readonly _tag: "UniqueSymbol"
  readonly symbol: symbol
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createUniqueSymbol = (
  symbol: symbol,
  annotations: Annotated["annotations"] = {}
): UniqueSymbol => ({ _tag: "UniqueSymbol", symbol, annotations })

/**
 * @category guards
 * @since 1.0.0
 */
export const isUniqueSymbol = (ast: AST): ast is UniqueSymbol => ast._tag === "UniqueSymbol"

/**
 * @category model
 * @since 1.0.0
 */
export interface UndefinedKeyword extends Annotated {
  readonly _tag: "UndefinedKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const undefinedKeyword: UndefinedKeyword = {
  _tag: "UndefinedKeyword",
  annotations: {
    [TitleAnnotationId]: "undefined"
  }
}

/**
 * @category model
 * @since 1.0.0
 */
export interface VoidKeyword extends Annotated {
  readonly _tag: "VoidKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const voidKeyword: VoidKeyword = {
  _tag: "VoidKeyword",
  annotations: {
    [TitleAnnotationId]: "void"
  }
}

/**
 * @category model
 * @since 1.0.0
 */
export interface NeverKeyword extends Annotated {
  readonly _tag: "NeverKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const neverKeyword: NeverKeyword = {
  _tag: "NeverKeyword",
  annotations: {
    [TitleAnnotationId]: "never"
  }
}

/**
 * @category model
 * @since 1.0.0
 */
export interface UnknownKeyword extends Annotated {
  readonly _tag: "UnknownKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const unknownKeyword: UnknownKeyword = {
  _tag: "UnknownKeyword",
  annotations: {
    [TitleAnnotationId]: "unknown"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isUnknownKeyword = (ast: AST): ast is UnknownKeyword => ast._tag === "UnknownKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface AnyKeyword extends Annotated {
  readonly _tag: "AnyKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const anyKeyword: AnyKeyword = {
  _tag: "AnyKeyword",
  annotations: {
    [TitleAnnotationId]: "any"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isAnyKeyword = (ast: AST): ast is AnyKeyword => ast._tag === "AnyKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface StringKeyword extends Annotated {
  readonly _tag: "StringKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const stringKeyword: StringKeyword = {
  _tag: "StringKeyword",
  annotations: {
    [TitleAnnotationId]: "string"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isStringKeyword = (ast: AST): ast is StringKeyword => ast._tag === "StringKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface NumberKeyword extends Annotated {
  readonly _tag: "NumberKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const numberKeyword: NumberKeyword = {
  _tag: "NumberKeyword",
  annotations: {
    [TitleAnnotationId]: "number"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isNumberKeyword = (ast: AST): ast is NumberKeyword => ast._tag === "NumberKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface BooleanKeyword extends Annotated {
  readonly _tag: "BooleanKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const booleanKeyword: BooleanKeyword = {
  _tag: "BooleanKeyword",
  annotations: {
    [TitleAnnotationId]: "boolean"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isBooleanKeyword = (ast: AST): ast is BooleanKeyword => ast._tag === "BooleanKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface BigIntKeyword extends Annotated {
  readonly _tag: "BigIntKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const bigIntKeyword: BigIntKeyword = {
  _tag: "BigIntKeyword",
  annotations: {
    [TitleAnnotationId]: "bigint"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isBigIntKeyword = (ast: AST): ast is BigIntKeyword => ast._tag === "BigIntKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface SymbolKeyword extends Annotated {
  readonly _tag: "SymbolKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const symbolKeyword: SymbolKeyword = {
  _tag: "SymbolKeyword",
  annotations: {
    [TitleAnnotationId]: "symbol"
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isSymbolKeyword = (ast: AST): ast is SymbolKeyword => ast._tag === "SymbolKeyword"

/**
 * @category model
 * @since 1.0.0
 */
export interface ObjectKeyword extends Annotated {
  readonly _tag: "ObjectKeyword"
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const objectKeyword: ObjectKeyword = {
  _tag: "ObjectKeyword",
  annotations: {
    [TitleAnnotationId]: "object"
  }
}

/**
 * @category model
 * @since 1.0.0
 */
export interface Enums extends Annotated {
  readonly _tag: "Enums"
  readonly enums: ReadonlyArray<readonly [string, string | number]>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createEnums = (
  enums: ReadonlyArray<readonly [string, string | number]>
): Enums => ({ _tag: "Enums", enums, annotations: {} })

/**
 * @since 1.0.0
 */
export interface TemplateLiteralSpan {
  readonly type: StringKeyword | NumberKeyword
  readonly literal: string
}

/**
 * @category model
 * @since 1.0.0
 */
export interface TemplateLiteral extends Annotated {
  readonly _tag: "TemplateLiteral"
  readonly head: string
  readonly spans: RA.NonEmptyReadonlyArray<TemplateLiteralSpan>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createTemplateLiteral = (
  head: string,
  spans: ReadonlyArray<TemplateLiteralSpan>
): TemplateLiteral | Literal =>
  RA.isNonEmptyReadonlyArray(spans) ?
    { _tag: "TemplateLiteral", head, spans, annotations: {} } :
    createLiteral(head)

/**
 * @category guards
 * @since 1.0.0
 */
export const isTemplateLiteral = (ast: AST): ast is TemplateLiteral =>
  ast._tag === "TemplateLiteral"

/**
 * @since 1.0.0
 */
export interface Element {
  readonly type: AST
  readonly isOptional: boolean
}

/**
 * @since 1.0.0
 */
export const createElement = (
  type: AST,
  isOptional: boolean
): Element => ({ type, isOptional })

/**
 * @category model
 * @since 1.0.0
 */
export interface Tuple extends Annotated {
  readonly _tag: "Tuple"
  readonly elements: ReadonlyArray<Element>
  readonly rest: Option<RA.NonEmptyReadonlyArray<AST>>
  readonly isReadonly: boolean
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createTuple = (
  elements: ReadonlyArray<Element>,
  rest: Option<RA.NonEmptyReadonlyArray<AST>>,
  isReadonly: boolean,
  annotations: Annotated["annotations"] = {}
): Tuple => ({
  _tag: "Tuple",
  elements,
  rest,
  isReadonly,
  annotations
})

/**
 * @category guards
 * @since 1.0.0
 */
export const isTuple = (ast: AST): ast is Tuple => ast._tag === "Tuple"

/**
 * @since 1.0.0
 */
export interface PropertySignature extends Annotated {
  readonly name: PropertyKey
  readonly type: AST
  readonly isOptional: boolean
  readonly isReadonly: boolean
}

/**
 * @since 1.0.0
 */
export const createPropertySignature = (
  name: PropertyKey,
  type: AST,
  isOptional: boolean,
  isReadonly: boolean,
  annotations: Annotated["annotations"] = {}
): PropertySignature => ({ name, type, isOptional, isReadonly, annotations })

/**
 * @since 1.0.0
 */
export interface IndexSignature {
  readonly parameter: StringKeyword | SymbolKeyword | TemplateLiteral | Refinement
  readonly type: AST
  readonly isReadonly: boolean
}

/**
 * @since 1.0.0
 */
export const createIndexSignature = (
  parameter: StringKeyword | SymbolKeyword | TemplateLiteral | Refinement,
  type: AST,
  isReadonly: boolean
): IndexSignature => ({ parameter, type, isReadonly })

/**
 * @category model
 * @since 1.0.0
 */
export interface TypeLiteral extends Annotated {
  readonly _tag: "TypeLiteral"
  readonly propertySignatures: ReadonlyArray<PropertySignature>
  readonly indexSignatures: ReadonlyArray<IndexSignature>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createTypeLiteral = (
  propertySignatures: ReadonlyArray<PropertySignature>,
  indexSignatures: ReadonlyArray<IndexSignature>,
  annotations: Annotated["annotations"] = {}
): TypeLiteral => ({
  _tag: "TypeLiteral",
  propertySignatures: sortByCardinalityAsc(propertySignatures),
  indexSignatures: sortByCardinalityAsc(indexSignatures),
  annotations
})

/**
 * @category guards
 * @since 1.0.0
 */
export const isTypeLiteral = (ast: AST): ast is TypeLiteral => ast._tag === "TypeLiteral"

/**
 * @category model
 * @since 1.0.0
 */
export interface Union extends Annotated {
  readonly _tag: "Union"
  readonly types: readonly [AST, AST, ...Array<AST>]
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createUnion = (
  candidates: ReadonlyArray<AST>,
  annotations: Annotated["annotations"] = {}
): AST => {
  const types = unify(candidates)
  switch (types.length) {
    case 0:
      return neverKeyword
    case 1:
      return types[0]
    default: {
      return { _tag: "Union", types: sortByWeightDesc(types) as any, annotations }
    }
  }
}

/**
 * @category guards
 * @since 1.0.0
 */
export const isUnion = (ast: AST): ast is Union => ast._tag === "Union"

/**
 * @category model
 * @since 1.0.0
 */
export interface Lazy extends Annotated {
  readonly _tag: "Lazy"
  readonly f: () => AST
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createLazy = (
  f: () => AST,
  annotations: Annotated["annotations"] = {}
): Lazy => ({ _tag: "Lazy", f, annotations })

/**
 * @category guards
 * @since 1.0.0
 */
export const isLazy = (ast: AST): ast is Lazy => ast._tag === "Lazy"

/**
 * @category model
 * @since 1.0.0
 */
export interface Refinement extends Annotated {
  readonly _tag: "Refinement"
  readonly from: AST
  readonly decode: (input: any, options?: ParseOptions) => ParseResult<any>
  readonly isReversed: boolean
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createRefinement = (
  from: AST,
  decode: (input: any, options?: ParseOptions) => ParseResult<any>,
  isReversed: boolean,
  annotations: Annotated["annotations"] = {}
): Refinement => ({ _tag: "Refinement", from, decode, isReversed, annotations })

/**
 * @category guards
 * @since 1.0.0
 */
export const isRefinement = (ast: AST): ast is Refinement => ast._tag === "Refinement"

/**
 * @category model
 * @since 1.0.0
 */
export interface ParseOptions {
  readonly isUnexpectedAllowed?: boolean
  readonly allErrors?: boolean
}

/**
 * @category model
 * @since 1.0.0
 */
export interface Transform extends Annotated {
  readonly _tag: "Transform"
  readonly from: AST
  readonly to: AST
  readonly decode: (input: any, options?: ParseOptions) => ParseResult<any>
  readonly encode: (input: any, options?: ParseOptions) => ParseResult<any>
  readonly isReversed: boolean
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const createTransform = (
  from: AST,
  to: AST,
  decode: Transform["decode"],
  encode: Transform["encode"],
  isReversed: boolean,
  annotations: Annotated["annotations"] = {}
): Transform => ({
  _tag: "Transform",
  from,
  to: getTo(to),
  decode,
  encode,
  isReversed,
  annotations
})

/**
 * @category guards
 * @since 1.0.0
 */
export const isTransform = (ast: AST): ast is Transform => ast._tag === "Transform"

// -------------------------------------------------------------------------------------
// API
// -------------------------------------------------------------------------------------

/**
 * Adds a group of annotations, potentially overwriting existing annotations.
 *
 * @since 1.0.0
 */
export const mergeAnnotations = (ast: AST, annotations: Annotated["annotations"]) => ({
  ...ast,
  annotations: { ...ast.annotations, ...annotations }
})

/**
 * Adds an annotation, potentially overwriting the existing annotation with the specified id.
 *
 * @since 1.0.0
 */
export const setAnnotation = (ast: AST, id: PropertyKey, value: unknown) => ({
  ...ast,
  annotations: { ...ast.annotations, [id]: value }
})

/**
 * Adds a rest element to the end of a tuple, or throws an exception if the rest element is already present.
 *
 * @since 1.0.0
 */
export const appendRestElement = (
  ast: Tuple,
  restElement: AST
): Tuple => {
  if (O.isSome(ast.rest)) {
    // example: `type A = [...string[], ...number[]]` is illegal
    throw new Error("A rest element cannot follow another rest element. ts(1265)")
  }
  return createTuple(ast.elements, O.some([restElement]), ast.isReadonly)
}

/**
 * Appends an element to a tuple or throws an exception in the following cases:
 * - A required element cannot follow an optional element. ts(1257)
 * - An optional element cannot follow a rest element. ts(1266)
 *
 * @since 1.0.0
 */
export const appendElement = (
  ast: Tuple,
  newElement: Element
): Tuple => {
  if (ast.elements.some((e) => e.isOptional) && !newElement.isOptional) {
    throw new Error("A required element cannot follow an optional element. ts(1257)")
  }
  return pipe(
    ast.rest,
    O.match(
      () => createTuple([...ast.elements, newElement], O.none(), ast.isReadonly),
      (rest) => {
        if (newElement.isOptional) {
          throw new Error("An optional element cannot follow a rest element. ts(1266)")
        }
        return createTuple(ast.elements, O.some([...rest, newElement.type]), ast.isReadonly)
      }
    )
  )
}

/**
 * Equivalent at runtime to the TypeScript type-level `keyof` operator.
 *
 * @since 1.0.0
 */
export const keyof = (ast: AST): AST => createUnion(_keyof(ast))

/**
 * Create a record with the specified key type and value type.
 *
 * @since 1.0.0
 */
export const createRecord = (key: AST, value: AST, isReadonly: boolean): TypeLiteral => {
  const propertySignatures: Array<PropertySignature> = []
  const indexSignatures: Array<IndexSignature> = []
  const go = (key: AST): void => {
    switch (key._tag) {
      case "NeverKeyword":
        break
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
      case "Refinement":
        indexSignatures.push(createIndexSignature(key, value, isReadonly))
        break
      case "Literal":
        if (isString(key.literal) || isNumber(key.literal)) {
          propertySignatures.push(createPropertySignature(key.literal, value, false, isReadonly))
        }
        break
      case "UniqueSymbol":
        propertySignatures.push(createPropertySignature(key.symbol, value, false, isReadonly))
        break
      case "Union":
        key.types.forEach(go)
        break
      default:
        throw new Error(`createRecord: Unsupported key ${key._tag}`)
    }
  }
  go(key)
  return createTypeLiteral(propertySignatures, indexSignatures)
}

/**
 * Equivalent at runtime to the built-in TypeScript utility type `Pick`.
 *
 * @since 1.0.0
 */
export const pick = (ast: AST, keys: ReadonlyArray<PropertyKey>): TypeLiteral => {
  return createTypeLiteral(_getPropertySignatures(ast).filter((ps) => keys.includes(ps.name)), [])
}

/**
 * Equivalent at runtime to the built-in TypeScript utility type `Omit`.
 *
 * @since 1.0.0
 */
export const omit = (ast: AST, keys: ReadonlyArray<PropertyKey>): TypeLiteral => {
  return createTypeLiteral(_getPropertySignatures(ast).filter((ps) => !keys.includes(ps.name)), [])
}

/**
 * Equivalent at runtime to the built-in TypeScript utility type `Partial`.
 *
 * @since 1.0.0
 */
export const partial = (ast: AST): AST => {
  switch (ast._tag) {
    case "Tuple":
      return createTuple(
        ast.elements.map((e) => createElement(e.type, true)),
        pipe(
          ast.rest,
          O.map((rest) => [createUnion([...rest, undefinedKeyword])])
        ),
        ast.isReadonly
      )
    case "TypeLiteral":
      return createTypeLiteral(
        ast.propertySignatures.map((f) =>
          createPropertySignature(f.name, f.type, true, f.isReadonly, f.annotations)
        ),
        ast.indexSignatures
      )
    case "Union":
      return createUnion(ast.types.map((member) => partial(member)))
    case "Lazy":
      return createLazy(() => partial(ast.f()))
    case "Refinement":
      return partial(ast.from)
    case "Transform":
      return partial(ast.to)
    default:
      return ast
  }
}

// -------------------------------------------------------------------------------------
// compiler harness
// -------------------------------------------------------------------------------------

/**
 * @since 1.0.0
 */
export type Compiler<A> = (ast: AST) => A

/**
 * @since 1.0.0
 */
export type Match<A> = {
  [K in AST["_tag"]]: (ast: Extract<AST, { _tag: K }>, compile: Compiler<A>) => A
}

/**
 * @since 1.0.0
 */
export const getCompiler = <A>(match: Match<A>): Compiler<A> => {
  const compile = I.memoize((ast: AST): A => match[ast._tag](ast as any, compile))
  return compile
}

/**
 * @since 1.0.0
 */
export const getTo = (ast: AST): AST => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(ast.typeParameters.map(getTo), ast.type, ast.decode, ast.annotations)
    case "Tuple":
      return createTuple(
        ast.elements.map((e) => ({ ...e, type: getTo(e.type) })),
        O.map(ast.rest, RA.mapNonEmpty(getTo)),
        ast.isReadonly,
        ast.annotations
      )
    case "TypeLiteral":
      return createTypeLiteral(
        ast.propertySignatures.map((p) => ({ ...p, type: getTo(p.type) })),
        ast.indexSignatures.map((is) => ({ ...is, type: getTo(is.type) })),
        ast.annotations
      )
    case "Union":
      return createUnion(ast.types.map(getTo), ast.annotations)
    case "Lazy":
      return createLazy(() => getTo(ast.f()), ast.annotations)
    case "Refinement":
      return createRefinement(getTo(ast.from), ast.decode, false, ast.annotations)
    case "Transform":
      return getTo(ast.to)
  }
  return ast
}

/**
 * @since 1.0.0
 */
export const getFrom = (ast: AST): AST => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(
        ast.typeParameters.map(getFrom),
        ast.type,
        ast.decode,
        ast.annotations
      )
    case "Tuple":
      return createTuple(
        ast.elements.map((e) => ({ ...e, type: getFrom(e.type) })),
        O.map(ast.rest, RA.mapNonEmpty(getFrom)),
        ast.isReadonly,
        ast.annotations
      )
    case "TypeLiteral":
      return createTypeLiteral(
        ast.propertySignatures.map((p) => ({ ...p, type: getFrom(p.type) })),
        ast.indexSignatures.map((is) => ({ ...is, type: getFrom(is.type) })),
        ast.annotations
      )
    case "Union":
      return createUnion(ast.types.map(getFrom), ast.annotations)
    case "Lazy":
      return createLazy(() => getFrom(ast.f()), ast.annotations)
    case "Refinement":
    case "Transform":
      return getFrom(ast.from)
  }
  return ast
}

/**
 * @since 1.0.0
 */
export const reverse = (ast: AST): AST => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(
        ast.typeParameters.map(reverse),
        ast.type,
        ast.decode,
        ast.annotations
      )
    case "Tuple":
      return createTuple(
        ast.elements.map((e) => ({ ...e, type: reverse(e.type) })),
        O.map(ast.rest, RA.mapNonEmpty(reverse)),
        ast.isReadonly,
        ast.annotations
      )
    case "TypeLiteral":
      return createTypeLiteral(
        ast.propertySignatures.map((p) => ({ ...p, type: reverse(p.type) })),
        ast.indexSignatures.map((is) => ({ ...is, type: reverse(is.type) })),
        ast.annotations
      )
    case "Union":
      return createUnion(ast.types.map(reverse), ast.annotations)
    case "Lazy":
      return createLazy(() => reverse(ast.f()), ast.annotations)
    case "Refinement":
      return createRefinement(ast.from, ast.decode, !ast.isReversed, ast.annotations)
    case "Transform":
      return createTransform(reverse(ast.from), ast.to, ast.decode, ast.encode, !ast.isReversed)
  }
  return ast
}

// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------

/** @internal */
export const _getCardinality = (ast: AST): number => {
  switch (ast._tag) {
    case "Declaration":
      return _getCardinality(ast.type)
    case "NeverKeyword":
      return 0
    case "Literal":
    case "UndefinedKeyword":
    case "VoidKeyword":
    case "UniqueSymbol":
      return 1
    case "BooleanKeyword":
      return 2
    case "StringKeyword":
    case "NumberKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3
    case "ObjectKeyword":
      return 4
    case "UnknownKeyword":
    case "AnyKeyword":
      return 6
    case "Refinement":
      return _getCardinality(ast.from)
    case "Transform":
      return _getCardinality(ast.to)
    default:
      return 5
  }
}

const sortByCardinalityAsc = RA.sort(
  pipe(Number.Order, Order.contramap(({ type }: { readonly type: AST }) => _getCardinality(type)))
)

/** @internal */
export const _getWeight = (ast: AST): number => {
  switch (ast._tag) {
    case "Declaration":
      return _getWeight(ast.type)
    case "Tuple":
      return ast.elements.length + (O.isSome(ast.rest) ? ast.rest.value.length : 0)
    case "TypeLiteral":
      return ast.propertySignatures.length + ast.indexSignatures.length
    case "Union":
      return ast.types.reduce((n, member) => n + _getWeight(member), 0)
    case "Lazy":
      return 10
    case "Refinement":
      return _getWeight(ast.from)
    case "Transform":
      return _getWeight(ast.to)
    default:
      return 0
  }
}

/** @internal */
export const sortByWeightDesc = RA.sort(Order.reverse(Order.contramap(Number.Order, _getWeight)))

const unify = (candidates: ReadonlyArray<AST>): ReadonlyArray<AST> => {
  let out = pipe(
    candidates,
    RA.flatMap((ast: AST): ReadonlyArray<AST> => {
      switch (ast._tag) {
        case "NeverKeyword":
          return []
        case "Union":
          return ast.types
        default:
          return [ast]
      }
    })
  )
  if (out.some(isAnyKeyword)) {
    return [anyKeyword]
  }
  if (out.some(isUnknownKeyword)) {
    return [unknownKeyword]
  }
  if (out.some(isStringKeyword)) {
    out = out.filter((m) => !(isLiteral(m) && typeof m.literal === "string"))
  }
  if (out.some(isNumberKeyword)) {
    out = out.filter((m) => !(isLiteral(m) && typeof m.literal === "number"))
  }
  if (out.some(isBooleanKeyword)) {
    out = out.filter((m) => !(isLiteral(m) && typeof m.literal === "boolean"))
  }
  if (out.some(isBigIntKeyword)) {
    out = out.filter((m) => !(isLiteral(m) && typeof m.literal === "bigint"))
  }
  if (out.some(isSymbolKeyword)) {
    out = out.filter((m) => !isUniqueSymbol(m))
  }
  return out
}

/** @internal */
export const _getParameter = (
  x: IndexSignature["parameter"]
): StringKeyword | SymbolKeyword | TemplateLiteral =>
  isRefinement(x) ? _getParameter(x.from as any) : x

const _keyof = (ast: AST): ReadonlyArray<AST> => {
  switch (ast._tag) {
    case "Declaration":
      return _keyof(ast.type)
    case "NeverKeyword":
    case "AnyKeyword":
      return [stringKeyword, numberKeyword, symbolKeyword]
    case "StringKeyword":
      return [createLiteral("length")]
    case "TypeLiteral":
      return ast.propertySignatures.map((p): AST =>
        typeof p.name === "symbol" ? createUniqueSymbol(p.name) : createLiteral(p.name)
      ).concat(ast.indexSignatures.map((is) => _getParameter(is.parameter)))
    case "Union": {
      return _getPropertySignatures(ast).map((p): AST =>
        typeof p.name === "symbol" ? createUniqueSymbol(p.name) : createLiteral(p.name)
      )
    }
    case "Lazy":
      return _keyof(ast.f())
    case "Refinement":
      return _keyof(ast.from)
    case "Transform":
      return _keyof(ast.to)
    default:
      return []
  }
}

/** @internal */
export const _getPropertySignatures = (
  ast: AST
): ReadonlyArray<PropertySignature> => {
  switch (ast._tag) {
    case "Declaration":
      return _getPropertySignatures(ast.type)
    case "Tuple":
      return ast.elements.map((element, i) =>
        createPropertySignature(i, element.type, element.isOptional, ast.isReadonly)
      )
    case "TypeLiteral":
      return ast.propertySignatures
    case "Union": {
      const propertySignatures = ast.types.map(_getPropertySignatures)
      return pipe(
        propertySignatures[0],
        RA.filterMap(({ name }) => {
          if (propertySignatures.every((ps) => ps.some((p) => p.name === name))) {
            const members = pipe(
              propertySignatures,
              RA.flatMap((ps) => ps.filter((p) => p.name === name))
            )
            return O.some(createPropertySignature(
              name,
              createUnion(members.map((p) => p.type)),
              members.some((p) => p.isOptional),
              members.some((p) => p.isReadonly)
            ))
          }
          return O.none()
        })
      )
    }
    case "Lazy":
      return _getPropertySignatures(ast.f())
    case "Refinement":
      return _getPropertySignatures(ast.from)
    case "Transform":
      return _getPropertySignatures(ast.to)
    default:
      return []
  }
}
