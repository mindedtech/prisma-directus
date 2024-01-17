import type { Condition } from "@/generator/lib/Condition";
import type {
  FieldDirectives,
  ModelDirectives,
} from "@/generator/lib/Directive";
import type { Filter } from "@/generator/lib/Filter";
import type { OmitStrict } from "@/generator/lib/utils";
import type {
  Collection as BaseCollection,
  CollectionMeta as BaseCollectionMeta,
} from "@directus/api/types/collection";
import type {
  Snapshot as BaseSnapshot,
  SnapshotField as BaseSnapshotField,
  SnapshotRelation as BaseSnapshotRelation,
} from "@directus/api/types/snapshot";
import type { Type as SnapshotFieldType } from "@directus/types";
import type { DMMF } from "@prisma/generator-helper";
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
  choices?: SnapshotFieldMetaOptionsChoice[];
  enableLink?: boolean;
  languageDirectionField?: string;
  languageField?: string;
};

type SnapshotFieldMeta = Omit<BaseSnapshotField[`meta`], `translations`> & {
  display:
    | `boolean`
    | `datetime`
    | `formatted-value`
    | `raw`
    | `related-values`
    | `translations`
    | null;
  interface:
    | `boolean`
    | `datetime`
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
  special?:
    | (
        | `cast-boolean`
        | `date-created`
        | `date-updated`
        | `m2m`
        | `m2o`
        | `o2m`
        | `translations`
        | `uuid`
      )[]
    | null;
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
  meta: OmitStrict<SnapshotFieldMeta, `id`>;
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

type PrismaDatamodel = DMMF.Datamodel;
type PrismaModel = PrismaDatamodel[`models`][number];
type PrismaField = PrismaModel[`fields`][number];

type SnapshotContext = {
  readonly autoSort: boolean;
  readonly datamodel: PrismaDatamodel;
  readonly conditions: Record<string, Condition>;
  readonly filters: Record<string, Filter>;
  readonly snapshot: Snapshot;
  readonly debug: () => void;

  readonly getDirectivesOfPrismaModel: (
    prismaModel: PrismaModel,
  ) => ModelDirectives;
  readonly getDirectivesOfPrismaField: (
    prismaField: PrismaField,
  ) => FieldDirectives;

  readonly getPrismaModelOfPrismaField: (
    prismaField: PrismaField,
  ) => PrismaModel;

  readonly getLocalPrismaFieldOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getLocalPrismaItemRelationOfLocalPrismaField: (
    prismaField: PrismaField,
  ) => undefined | PrismaField;

  readonly getRemotePrismaItemRelationOfLocalPrismaListRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getRemotePrismaListRelationOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getRemotePrismaFieldOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
};

export type {
  PrismaDatamodel,
  PrismaField,
  PrismaModel,
  Snapshot,
  SnapshotCollection,
  SnapshotContext,
  SnapshotField,
  SnapshotFieldMeta,
  SnapshotFieldMetaOptions,
  SnapshotFieldMetaOptionsChoice,
  SnapshotFieldType,
  SnapshotRelation,
};
