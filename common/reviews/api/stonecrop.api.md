## API Report File for "@stonecrop/stonecrop"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Component } from 'vue';
import { List } from 'immutable';
import type { MachineConfig } from 'xstate';
import { Map as Map_2 } from 'immutable';
import { Plugin as Plugin_2 } from 'vue';
import { Ref } from 'vue';
import { Router } from 'vue-router';
import type { StateMachine } from 'xstate';
import { StoreDefinition } from 'pinia';

// @public
export type BaseSchema = {
    fieldname: string;
    component?: string;
    value?: any;
};

// @public
export type CellContext = {
    row: TableRow;
    column: TableColumn;
    table: {
        [key: string]: any;
    };
};

// @public
export class DoctypeMeta {
    constructor(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], actions: ImmutableDoctype['actions'], component?: Component);
    readonly actions: ImmutableDoctype['actions'];
    readonly component?: Component;
    readonly doctype: string;
    readonly schema: ImmutableDoctype['schema'];
    get slug(): string;
    readonly workflow: ImmutableDoctype['workflow'];
}

// @public
export type FieldsetSchema = BaseSchema & {
    label?: string;
    schema?: (FormSchema | TableSchema)[];
    collapsible?: boolean;
};

// @public
export type FormSchema = BaseSchema & {
    align?: string;
    edit?: boolean;
    fieldtype?: string;
    label?: string;
    name?: string;
    width?: string;
    mask?: string;
};

// @public
export type ImmutableDoctype = {
    readonly schema?: List<SchemaTypes>;
    readonly workflow: StateMachine<unknown, any, any>;
    readonly actions?: Map_2<string, string[]>;
};

// @public
export type InstallOptions = {
    router?: Router;
    components?: Record<string, Component>;
    getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>;
};

// @public
export type MutableDoctype = {
    schema?: SchemaTypes[];
    workflow: MachineConfig<unknown, any, any>;
    actions?: Record<string, string[]>;
};

// @public
export class Registry {
    constructor(router?: Router, getMeta?: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>);
    addDoctype(doctype: DoctypeMeta): void;
    getMeta?: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>;
    name: string;
    registry: Record<string, DoctypeMeta>;
    static _root: Registry;
    router?: Router;
}

// @public
export type Schema = {
    doctype: string;
    schema: List<SchemaTypes>;
};

// @public
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema;

// @public
export const Stonecrop: Plugin_2;

// @public
export type StonecropReturn = {
    stonecrop: Ref<Stonecrop_2>;
    isReady: Ref<boolean>;
};

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
export type TableRow = {
    [key: string]: any;
    indent?: number;
    parent?: number;
};

// @public
export type TableSchema = BaseSchema & {
    columns?: TableColumn[];
    config?: TableConfig;
    rows?: TableRow[];
};

// @public
export function useStonecrop(registry?: Registry): StonecropReturn;

// Warnings were encountered during analysis:
//
// src/composable.ts:12:2 - (ae-forgotten-export) The symbol "Stonecrop_2" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```
