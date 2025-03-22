# is-bun-module

## How to use

To check if a specifier is a [Bun module](https://bun.sh/docs/runtime/bun-apis):

```typescript
import { isBunModule } from "is-bun-module";
isBunModule("bun"); // true
isBunModule("bun:test", "1.0.0"); // true
isBunModule("notBunModule"); // false
```

To check if a specifier is a Node module [implemented in Bun](https://bun.sh/docs/runtime/nodejs-apis):

```typescript
import { isBunImplementedNodeModule } from "is-bun-module";
isBunImplementedNodeModule("fs"); // true
isBunImplementedNodeModule("node:fs"); // true
isBunImplementedNodeModule("node:notNodeModule"); // false
isBunImplementedNodeModule("node:http2", "1.0.0"); // false, added in 1.0.13
```

## Notes

- **Only Bun v1.0.0+ is supported**
- You can also pass `latest` as Bun version
- Inspired by [is-core-module](https://github.com/inspect-js/is-core-module) and made for [eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript)
- Runtime-independent
