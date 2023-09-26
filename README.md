# ZK Credentials Preparator

Zero Knowledge Credentials (ZKC) Preparator is a library designed to assist developers
in getting Zero Knowledge Credentials ready for use with Zero Knowledge Proof (ZKP)
functions according to [ZKC protocol](https://www.craft.me/s/fP61xnwdZ9GZmg)
(see `ZK Credential: Preparation` & `Transformation Graph`sections ).

---

## API

### Prepare ZK Credential

```typescript
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

const transSchema: TransCredSchema = {
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

const preparator = new Preparator();
const [
  isr_id_t, // boolean type
  isr_id_k, // Uint8Array
  sch,      // string as base16
  isd,      // string as base32
  exd,      // string as utf8
  sbj_id_t, // Uint8Array
  sbj_id_k, // string as base16
  alias,    // bigint
  eth       // bigint
] = preparator.prepare(zkCredential, transSchema);
```

### Extend transformation graph

```typescript
const preparator = new Preparator();
preparator.extendGraph([{ // extend transformation nodes
  name: "newNode",
  isType: (value: any) => value === "hello ZKCredentials"
}], [{ // extend transformation links
  inputType: "bytes",
  outputType: "bytes",
  name: "bytes.reverse",
  transform: (bytes: Uint8Array) => bytes.reverse()
}]);
```

---

## Match between `Transformation Graph` types (nodes) and `JS` types

| Name      | Description                                                                                     | JS Types                                                            |
|-----------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| utf8      | UTF-8 encoded string, according to https://datatracker.ietf.org/doc/html/rfc3629                | string                                                              |
| base64    | Base64 encoded string, according to https://datatracker.ietf.org/doc/html/rfc3629               | string                                                              |
| base32    | Base32 encoded string, according to https://datatracker.ietf.org/doc/html/rfc3629               | string                                                              |
| base16    | Base16 encoded string, according to https://datatracker.ietf.org/doc/html/rfc3629               | string                                                              |
| base64url | Base64url encoded string, according to https://datatracker.ietf.org/doc/html/rfc7515#appendix-C | string                                                              |
| base58    | Base58 encoded string, according to https://en.bitcoin.it/wiki/Base58Check_encoding             | string                                                              |
| ascii     | ACSII encoded string, according to https://datatracker.ietf.org/doc/html/rfc20                  | string                                                              |
| int16     | Integer 16 bits size                                                                            | number or bigint as input type for link, only bigint as output type |
| int32     | Integer 32 bits size                                                                            | number or bigint as input type for link, only bigint as output type |
| int64     | Integer 64 bits size                                                                            | number or bigint as input type for link, only bigint as output type |
| int128    | Integer 128 bits size                                                                           | number or bigint as input type for link, only bigint as output type |
| int256    | Integer 256 bits size                                                                           | number or bigint as input type for link, only bigint as output type |
| uint16    | Unsigned integer 16 bits size                                                                   | number or bigint as input type for link, only bigint as output type |
| uint32    | Unsigned integer 32 bits size                                                                   | number or bigint as input type for link, only bigint as output type |
| uint64    | Unsigned integer 64 bits size                                                                   | number or bigint as input type for link, only bigint as output type |
| uint128   | Unsigned integer 128 bits size                                                                  | number or bigint as input type for link, only bigint as output type |
| uint256   | Unsigned integer 256 bits size                                                                  | number or bigint as input type for link, only bigint as output type |
| uint      | Unsigned integer withoout limits                                                                | number or bigint as input type for link, only bigint as output type |
| float32   | Float according to IEEE 754                                                                     | number                                                              |
| boolean   | Boolean                                                                                         | boolean                                                             |
| bytes     | bytes array                                                                                     | Uint8Array                                                          |
