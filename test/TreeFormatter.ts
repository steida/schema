import * as S from "@effect/schema/Schema"
import * as Util from "@effect/schema/test/util"
import * as _ from "@effect/schema/TreeFormatter"

describe.concurrent("TreeFormatter", () => {
  it("formatErrors/ Unexpected", () => {
    const schema = S.struct({ a: S.string })
    Util.expectDecodingFailureTree(
      schema,
      { a: "a", b: 1 },
      `error(s) found
└─ ["b"]
   └─ is unexpected`
    )
  })

  it("formatErrors/ should collapse trees that have a branching factor of 1", () => {
    const schema = S.struct({
      a: S.struct({ b: S.struct({ c: S.array(S.struct({ d: S.string })) }) })
    })
    Util.expectDecodingFailureTree(
      schema,
      { a: { b: { c: [{ d: null }] } } },
      `error(s) found
└─ ["a"]["b"]["c"][0]["d"]
   └─ Expected string, actual null`
    )
    Util.expectDecodingFailureTree(
      schema,
      { a: { b: { c: [{ d: null }, { d: 1 }] } } },
      `error(s) found
└─ ["a"]["b"]["c"][0]["d"]
   └─ Expected string, actual null`
    )
    Util.expectDecodingFailureTree(
      schema,
      { a: { b: { c: [{ d: null }, { d: 1 }] } } },
      `error(s) found
└─ ["a"]["b"]["c"]
   ├─ [0]["d"]
   │  └─ Expected string, actual null
   └─ [1]["d"]
      └─ Expected string, actual 1`,
      { allErrors: true }
    )
  })

  it("formatActual/ catch", () => {
    const circular: any = { a: null }
    circular.a = circular
    expect(_.formatActual(circular)).toEqual("[object Object]")
  })
})
