<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@stonecrop/stonecrop](./stonecrop.md) &gt; [ImmutableDoctype](./stonecrop.immutabledoctype.md)

## ImmutableDoctype type

Immutable Doctype type for Stonecrop instances

**Signature:**

```typescript
export type ImmutableDoctype = {
    readonly schema?: List<SchemaTypes>;
    readonly workflow: StateMachine<unknown, any, any>;
    readonly actions?: Map<string, string[]>;
};
```
**References:** [SchemaTypes](./stonecrop.schematypes.md)

