<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@stonecrop/atable](./atable.md) &gt; [TableColumn](./atable.tablecolumn.md)

## TableColumn type

Table column definition.

**Signature:**

```typescript
export type TableColumn = {
    name: string;
    align?: CanvasTextAlign;
    edit?: boolean;
    label?: string;
    type?: string;
    width?: string;
    pinned?: boolean;
    cellComponent?: string;
    cellComponentProps?: Record<string, any>;
    modalComponent?: string | ((context: CellContext) => string);
    modalComponentExtraProps?: Record<string, any>;
    format?: string | ((value: any, context: CellContext) => string);
    mask?: (value: any) => any;
};
```
**References:** [CellContext](./atable.cellcontext.md)

