import * as P from "@effect/schema/Parser"
import * as Pretty from "@effect/schema/Pretty"
import * as S from "@effect/schema/Schema"
import * as Util from "@effect/schema/test/util"

describe.concurrent("greaterThanOrEqualTo", () => {
  it("property tests", () => {
    Util.roundtrip(S.greaterThanOrEqualTo(0)(S.number))
  })

  it("Guard", () => {
    const is = P.is(S.greaterThanOrEqualTo(0)(S.number))
    expect(is(0)).toEqual(true)
    expect(is(1)).toEqual(true)
    expect(is(-1)).toEqual(false)
  })

  it("Decoder", () => {
    const schema = S.greaterThanOrEqualTo(0)(S.number)
    Util.expectDecodingSuccess(schema, 0)
    Util.expectDecodingSuccess(schema, 1)
    Util.expectDecodingFailure(
      schema,
      -1,
      `Expected a number greater than or equal to 0, actual -1`
    )
  })

  it("Pretty", () => {
    const pretty = Pretty.to(S.greaterThanOrEqualTo(0)(S.number))
    expect(pretty(1)).toEqual("1")
  })
})
