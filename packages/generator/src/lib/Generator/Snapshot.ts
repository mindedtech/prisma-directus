import type { Collection as BaseCollection } from "@directus/api/types/collection";
import type {
  Snapshot as BaseSnapshot,
  SnapshotField as BaseSnapshotField,
  SnapshotRelation as BaseSnapshotRelation,
} from "@directus/api/types/snapshot";
import type { BaseCollectionMeta } from "@directus/system-data";
import type { Type as SnapshotFieldType } from "@directus/types";
import type { Filter } from "prisma-directus-generator/lib/Generator/Filter";
import type { RichTextCustomSyntax } from "prisma-directus-generator/lib/Generator/RichTextCustomSyntax";
import type { OmitStrict } from "prisma-directus-generator/lib/utils";

type SnapshotCollection = Omit<BaseCollection, `meta`> & {
  meta: Omit<BaseCollectionMeta, `translations`> & {
    archive_app_filter: boolean;
    archive_field: string | null;
    archive_value: string | null;
    collapse: `open` | `closed` | `locked`;
    color: string | null;
    display_template: string | null;
    preview_url: string | null;
    sort_field: string | null;
    sort: number | null;
    unarchive_value: string | null;
    translations:
      | null
      | {
          language: string;
          translation: string;
          singular?: string;
          plural?: string;
        }[];
  };
  schema: NonNullable<BaseCollection[`schema`]>;
};

type SnapshotFieldMetaOptionsChoice = {
  text: string;
  value: string;
};

type SnapshotFieldMetaOptions = {
  allowDuplicates?: boolean;
  choices?: SnapshotFieldMetaOptionsChoice[];
  customSyntax?: OmitStrict<RichTextCustomSyntax, `global`>[];
  defaultLanguage?: string;
  enableLink?: boolean;
  filter?: Filter;
  folder?: string;
  languageDirectionField?: string;
  languageField?: string;
  limit?: number;
  template?: string;
};

type SnapshotFieldMetaSpecial =
  | `cast-boolean`
  | `date-created`
  | `date-updated`
  | `file`
  | `m2m`
  | `m2o`
  | `o2m`
  | `translations`
  | `uuid`;

type SnapshotFieldMeta = Omit<BaseSnapshotField[`meta`], `translations`> & {
  display:
    | `boolean`
    | `datetime`
    | `image`
    | `formatted-value`
    | `raw`
    | `related-values`
    | `translations`
    | null;
  interface:
    | `boolean`
    | `datetime`
    | `file-image`
    | `input-rich-text-md`
    | `input`
    | `list-m2m`
    | `list-o2m`
    | `select-dropdown-m2o`
    | `select-dropdown`
    | `translations`
    | null;
  options?: SnapshotFieldMetaOptions | null;
  readonly: boolean;
  required?: boolean;
  sort: number | null;
  special?: SnapshotFieldMetaSpecial[] | null;
  translations:
    | null
    | {
        language: string;
        translation: string;
      }[];
};

type SnapshotField = OmitStrict<
  BaseSnapshotField,
  `meta` | `name` | `schema`
> & {
  meta: null | OmitStrict<SnapshotFieldMeta, `id`>;
  schema?: BaseSnapshotField[`schema`];
};

type SnapshotRelation = OmitStrict<BaseSnapshotRelation, `meta`> & {
  meta: OmitStrict<BaseSnapshotRelation[`meta`], `id`>;
};

type Snapshot = OmitStrict<BaseSnapshot, `collections` | `fields`> & {
  collections: SnapshotCollection[];
  fields: SnapshotField[];
  relations: SnapshotRelation[];
};

export type {
  Snapshot,
  SnapshotCollection,
  SnapshotField,
  SnapshotFieldMeta,
  SnapshotFieldMetaOptions,
  SnapshotFieldMetaOptionsChoice,
  SnapshotFieldMetaSpecial,
  SnapshotFieldType,
  SnapshotRelation,
};
