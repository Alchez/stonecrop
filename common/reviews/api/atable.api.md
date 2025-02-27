## API Report File for "@stonecrop/atable"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import ACell from './components/ACell.vue';
import AExpansionRow from './components/AExpansionRow.vue';
import { App } from 'vue';
import ARow from './components/ARow.vue';
import ATable from './components/ATable.vue';
import ATableHeader from './components/ATableHeader.vue';
import ATableModal from './components/ATableModal.vue';
import { ComputedRef } from 'vue';
import { CSSProperties } from 'vue';
import { Ref } from 'vue';
import { Store } from 'pinia';
import { useElementBounding } from '@vueuse/core';

export { ACell }

export { AExpansionRow }

export { ARow }

export { ATable }

export { ATableHeader }

export { ATableModal }

// @public
export type CellContext = {
    row: TableRow;
    column: TableColumn;
    table: {
        [key: string]: any;
    };
};

// @public
export const createTableStore: (initData: {
    columns: TableColumn[];
    rows: TableRow[];
    id?: string;
    config?: TableConfig;
    table?: {
        [key: string]: any;
    };
    display?: TableDisplay[];
    modal?: TableModal;
}) => Store<`table-${string}`, Pick<{
columns: Ref<    {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[], TableColumn[] | {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[]>;
config: Ref<    {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}, TableConfig | {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}>;
display: Ref<    {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[], TableDisplay[] | {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[]>;
modal: Ref<    {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}, TableModal | {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}>;
rows: Ref<    {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[], TableRow[] | {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[]>;
table: Ref<    {}, {}>;
updates: Ref<Record<string, string>, Record<string, string>>;
hasPinnedColumns: ComputedRef<boolean>;
numberedRowWidth: ComputedRef<string>;
zeroColumn: ComputedRef<boolean>;
closeModal: (event: MouseEvent) => void;
getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
getHeaderCellStyle: (column: TableColumn) => CSSProperties;
getIndent: (colIndex: number, indentLevel?: number) => string;
getRowExpandSymbol: (rowIndex: number) => "" | "-" | "+";
isRowVisible: (rowIndex: number) => boolean | undefined;
setCellData: (colIndex: number, rowIndex: number, value: any) => void;
setCellText: (colIndex: number, rowIndex: number, value: string) => void;
toggleRowExpand: (rowIndex: number) => void;
}, "columns" | "config" | "display" | "modal" | "rows" | "table" | "updates">, Pick<{
columns: Ref<    {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[], TableColumn[] | {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[]>;
config: Ref<    {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}, TableConfig | {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}>;
display: Ref<    {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[], TableDisplay[] | {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[]>;
modal: Ref<    {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}, TableModal | {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}>;
rows: Ref<    {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[], TableRow[] | {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[]>;
table: Ref<    {}, {}>;
updates: Ref<Record<string, string>, Record<string, string>>;
hasPinnedColumns: ComputedRef<boolean>;
numberedRowWidth: ComputedRef<string>;
zeroColumn: ComputedRef<boolean>;
closeModal: (event: MouseEvent) => void;
getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
getHeaderCellStyle: (column: TableColumn) => CSSProperties;
getIndent: (colIndex: number, indentLevel?: number) => string;
getRowExpandSymbol: (rowIndex: number) => "" | "-" | "+";
isRowVisible: (rowIndex: number) => boolean | undefined;
setCellData: (colIndex: number, rowIndex: number, value: any) => void;
setCellText: (colIndex: number, rowIndex: number, value: string) => void;
toggleRowExpand: (rowIndex: number) => void;
}, "hasPinnedColumns" | "numberedRowWidth" | "zeroColumn">, Pick<{
columns: Ref<    {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[], TableColumn[] | {
name: string;
align?: CanvasTextAlign | undefined;
edit?: boolean | undefined;
label?: string | undefined;
type?: string | undefined;
width?: string | undefined;
pinned?: boolean | undefined;
cellComponent?: string | undefined;
cellComponentProps?: Record<string, any> | undefined;
modalComponent?: string | ((context: CellContext) => string) | undefined;
modalComponentExtraProps?: Record<string, any> | undefined;
format?: string | ((value: any, context: CellContext) => string) | undefined;
mask?: ((value: any) => any) | undefined;
}[]>;
config: Ref<    {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}, TableConfig | {
view?: "uncounted" | "list" | "list-expansion" | "tree" | undefined;
fullWidth?: boolean | undefined;
}>;
display: Ref<    {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[], TableDisplay[] | {
childrenOpen?: boolean | undefined;
expanded?: boolean | undefined;
indent?: number | undefined;
isParent?: boolean | undefined;
isRoot?: boolean | undefined;
open?: boolean | undefined;
parent?: number | undefined;
rowModified?: boolean | undefined;
}[]>;
modal: Ref<    {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}, TableModal | {
bottom?: number | undefined;
colIndex?: number | undefined;
event?: string | undefined;
height?: number | undefined;
left?: number | undefined;
parent?: HTMLElement | undefined;
rowIndex?: number | undefined;
visible?: boolean | undefined;
width?: number | undefined;
component?: string | undefined;
componentProps?: Record<string, any> | undefined;
}>;
rows: Ref<    {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[], TableRow[] | {
[x: string]: any;
indent?: number | undefined;
parent?: number | undefined;
}[]>;
table: Ref<    {}, {}>;
updates: Ref<Record<string, string>, Record<string, string>>;
hasPinnedColumns: ComputedRef<boolean>;
numberedRowWidth: ComputedRef<string>;
zeroColumn: ComputedRef<boolean>;
closeModal: (event: MouseEvent) => void;
getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
getHeaderCellStyle: (column: TableColumn) => CSSProperties;
getIndent: (colIndex: number, indentLevel?: number) => string;
getRowExpandSymbol: (rowIndex: number) => "" | "-" | "+";
isRowVisible: (rowIndex: number) => boolean | undefined;
setCellData: (colIndex: number, rowIndex: number, value: any) => void;
setCellText: (colIndex: number, rowIndex: number, value: string) => void;
toggleRowExpand: (rowIndex: number) => void;
}, "closeModal" | "getCellData" | "getCellDisplayValue" | "getFormattedValue" | "getHeaderCellStyle" | "getIndent" | "getRowExpandSymbol" | "isRowVisible" | "setCellData" | "setCellText" | "toggleRowExpand">>;

// @public
export function install(app: App): void;

// @public
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

// @public
export type TableConfig = {
    view?: 'uncounted' | 'list' | 'list-expansion' | 'tree';
    fullWidth?: boolean;
};

// @public
export type TableDisplay = {
    childrenOpen?: boolean;
    expanded?: boolean;
    indent?: number;
    isParent?: boolean;
    isRoot?: boolean;
    open?: boolean;
    parent?: number;
    rowModified?: boolean;
};

// @public
export type TableModal = {
    bottom?: ReturnType<typeof useElementBounding>['bottom'];
    colIndex?: number;
    event?: string;
    height?: ReturnType<typeof useElementBounding>['height'];
    left?: ReturnType<typeof useElementBounding>['left'];
    parent?: HTMLElement;
    rowIndex?: number;
    visible?: boolean;
    width?: ReturnType<typeof useElementBounding>['width'];
    component?: string;
    componentProps?: Record<string, any>;
};

// @public
export type TableModalProps = {
    [key: string]: any;
    colIndex: number;
    rowIndex: number;
    store: ReturnType<typeof createTableStore>;
};

// @public
export type TableRow = {
    [key: string]: any;
    indent?: number;
    parent?: number;
};

// (No @packageDocumentation comment for this package)

```
