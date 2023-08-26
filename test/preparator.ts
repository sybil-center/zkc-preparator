import { suite } from "uvu";
import * as a from "uvu/assert";
import { Preparator, TransCredSchema, ZKCredential } from "../src/preparator.js";

const test = suite("Preparator tests");

const zkCredential: ZKCredential = {
  isr: {
    id: { t: 1, k: "123456" }
  },
  sch: 1,
  isd: new Date().getTime(),
  exd: new Date().getTime(),
  sbj: {
    id: { k: "2345678", t: 2, },
    eth: "0x2...3",
    alias: "Test",
  }
};


test("prepare zk-credential", () => {
  const transSchema = {
    isr: {
      id: {
        t: ["uint32-bytes", "bytes-uint32", "uint32-boolean"],
        k: ["utf8-bytes"]
      },
    },
    sch: ["uint32-bytes", "bytes-base16"],
    isd: ["uint64-bytes", "bytes-base32"],
    exd: ["uint64-bytes", "bytes-utf8"],
    sbj: {
      id: {
        t: ["uint32-bytes"],
        k: ["utf8-bytes", "bytes-base16"]
      },
      alias: ["ascii-bytes", "bytes-uint128"],
      eth: ["utf8-bytes", "bytes-uint256"]
    }
  };
  const pr = new Preparator();
  const [
    isr_id_t,
    isr_id_k,
    sch,
    isd,
    exd,
    sbj_id_t,
    sbj_id_k,
    alias,
    eth
  ] = pr.prepare(zkCredential, transSchema);
  a.is(
    isr_id_t, true,
    `Incorrect preparation of ZKCredential.isr.id.t`
  );
  a.instance(
    isr_id_k, Uint8Array,
    `Incorrect preparation of ZKCredential.isr.id.k`
  );
  a.type(
    sch, "string",
    `Incorrect preparation of ZKCredential.sch`
  );
  a.type(
    isd, "string",
    `Incorrect preparation of ZKCredential.isd`
  );
  a.type(
    exd, "string",
    `Incorrect preparation of ZKCredential.exd`
  );
  a.instance(
    sbj_id_t, Uint8Array,
    `Incorrect preparation of ZKCredential.sbj.id.t`
  );
  a.type(
    sbj_id_k, "string",
    `Incorrect preparation of ZKCredential.sbj.id.k`
  );
  a.type(
    //@ts-ignore
    alias, "bigint",
    `Incorrect preparation of ZKCredential.sbj.alias`
  );
  a.type(
    //@ts-ignore
    eth, "bigint",
    `Incorrect preparation of ZKCredential.sbj.eth`);
});

test("extend transformation graph", () => {
  const preparator = new Preparator();
  preparator.extendGraph([], [{
    inputType: "bytes",
    outputType: "bytes",
    name: "bytes.reverse",
    transform: (bytes: Uint8Array) => bytes.reverse()
  }]);
  const transSchema: TransCredSchema = {
    isr: {
      id: {
        t: ["uint32-bytes", "bytes-uint32", "uint32-boolean"],
        k: ["utf8-bytes", "bytes.reverse"]
      },
    },
    sch: ["uint32-bytes", "bytes-base16"],
    isd: ["uint64-bytes", "bytes-base32"],
    exd: ["uint64-bytes", "bytes-utf8"],
    sbj: {
      id: {
        t: ["uint32-bytes"],
        k: ["utf8-bytes", "bytes-base16"]
      },
      alias: ["ascii-bytes", "bytes-uint128"],
      eth: ["utf8-bytes", "bytes-uint256"]
    }
  };
  const [
    isr_id_t,
    isr_id_k,
    sch,
    isd,
    exd,
    sbj_id_t,
    sbj_id_k,
    alias,
    eth
  ] = preparator.prepare(zkCredential, transSchema);
  a.is(
    isr_id_t, true,
    `Incorrect preparation of ZKCredential.isr.id.t`
  );
  a.instance(
    isr_id_k, Uint8Array,
    `Incorrect preparation of ZKCredential.isr.id.k`
  );
  a.type(
    sch, "string",
    `Incorrect preparation of ZKCredential.sch`
  );
  a.type(
    isd, "string",
    `Incorrect preparation of ZKCredential.isd`
  );
  a.type(
    exd, "string",
    `Incorrect preparation of ZKCredential.exd`
  );
  a.instance(
    sbj_id_t, Uint8Array,
    `Incorrect preparation of ZKCredential.sbj.id.t`
  );
  a.type(
    sbj_id_k, "string",
    `Incorrect preparation of ZKCredential.sbj.id.k`
  );
  a.type(
    //@ts-ignore
    alias, "bigint",
    `Incorrect preparation of ZKCredential.sbj.alias`
  );
  a.type(
    //@ts-ignore
    eth, "bigint",
    `Incorrect preparation of ZKCredential.sbj.eth`);
});

test.run();