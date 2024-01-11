import {
  parseCollectionDirectives,
  parseFieldDirectives,
} from "@/generator/lib/Directive";

import type {
  Collection as BaseCollection,
  CollectionMeta as BaseCollectionMeta,
} from "@directus/api/types/collection";
import type {
  Snapshot as BaseSnapshot,
  SnapshotField as BaseSnapshotField,
} from "@directus/api/types/snapshot";
import type { DMMF } from "@prisma/generator-helper";

type SnapshotCollection = BaseCollection & {
  meta: BaseCollectionMeta & {
    archive_app_filter: string | null;
    archive_field: string | null;
    archive_value: string | null;
    collapse: `open`;
    color: string | null;
    display_template: string | null;
    preview_url: string | null;
    sort_field: string | null;
    unarchive_value: string | null;
  };
};

type SnapshotFieldMetaOptionsChoice = {
  text: string;
  value: string;
};

type SnapshotFieldMetaOptions = {
  choices: SnapshotFieldMetaOptionsChoice[];
  enableLink?: boolean;
  languageDirectionField?: string;
  languageField?: string;
};

type SnapshotFieldMeta = BaseSnapshotField[`meta`] & {
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
    | `cast-boolean`
    | `date-created`
    | `date-updated`
    | `m2m`
    | `m2o`
    | `o2m`
    | `translations`
    | `uuid`
    | null;
};

type SnapshotField = BaseSnapshotField & {
  meta: SnapshotFieldMeta;
};

type Snapshot = BaseSnapshot & {
  collections: SnapshotCollection[];
  fields: SnapshotField[];
};

const dmmfToSnapshot = (
  directus: string,
  version: number,
  dmmf: DMMF.Document,
): Snapshot => {
  const snapshot: Snapshot = {
    collections: [],
    directus,
    fields: [],
    relations: [],
    vendor: `postgres`,
    version,
  };

  for (const prismaModel of dmmf.datamodel.models) {
    const collectionDirectives = parseCollectionDirectives(
      prismaModel.documentation,
    );
    const collectionName =
      collectionDirectives.find(`name`)?.args[0] ?? prismaModel.name;
    const accountability = collectionDirectives.find(`accountability`)?.args[0];
    const itemDuplicationFields = collectionDirectives
      .filter(`itemDuplicationField`)
      .map((directive) => directive.args[0]);
    const collectionTranslations = collectionDirectives
      .filter(`translation`)
      .map((directive) => directive.args);
    const directusCollection: SnapshotCollection = {
      collection: collectionName,
      fields: [],
      meta: {
        accountability:
          accountability === `null` || typeof accountability === `undefined`
            ? null
            : accountability,
        archive_app_filter:
          collectionDirectives.find(`archiveAppFilter`)?.args[0] ?? null,
        archive_field:
          collectionDirectives.find(`archiveField`)?.args[0] ?? null,
        archive_value:
          collectionDirectives.find(`archiveValue`)?.args[0] ?? null,
        collapse: `open`,
        collection: collectionName,
        color: collectionDirectives.find(`color`)?.args[0] ?? null,
        display_template:
          collectionDirectives.find(`displayTemplate`)?.args[0] ?? null,
        group: collectionDirectives.find(`group`)?.args[0] ?? null,
        hidden: collectionDirectives.find(`hidden`) !== undefined,
        icon: collectionDirectives.find(`icon`)?.args[0] ?? null,
        item_duplication_fields:
          itemDuplicationFields.length > 0 ? itemDuplicationFields : null,
        note: collectionDirectives.find(`note`)?.args[0] ?? null,
        preview_url: collectionDirectives.find(`previewUrl`)?.args[0] ?? null,
        singleton: collectionDirectives.find(`singleton`) !== undefined,
        sort_field: collectionDirectives.find(`sortField`)?.args[0] ?? null,
        translations: Object.fromEntries(
          collectionDirectives
            .filter(`translation`)
            .map((directive) => directive.args),
        ),
        unarchive_value:
          collectionDirectives.find(`unarchiveValue`)?.args[0] ?? null,
        versioning: collectionDirectives.find(`versioning`) !== undefined,
      },
      schema: {
        name: prismaModel.dbName ?? prismaModel.name,
      },
    };
    snapshot.collections.push(directusCollection);
    for (const prismaField of prismaModel.fields) {
      const fieldDirectives = parseFieldDirectives(prismaField.documentation);
      const fieldName =
        fieldDirectives.find(`name`)?.args[0] ?? prismaField.name;
      const directusField: SnapshotField = {
        collection: collectionName,
        field: fieldName,
        meta: {
          collection: collectionName,
        },
        name: fieldName,
      };
      snapshot.fields.push(directusField);
    }
  }

  return snapshot;
};

export { dmmfToSnapshot };
