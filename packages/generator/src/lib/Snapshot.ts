import {
  parseCollectionDirectives,
  parseFieldDirectives,
} from "@/generator/lib/Directive";

import type { Config } from "@/generator/lib/Config";
import type { FieldType } from "@/generator/lib/FieldType";
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
    collapse: `open` | `closed` | `locked`;
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
  choices?: SnapshotFieldMetaOptionsChoice[];
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
};

type SnapshotField = Omit<BaseSnapshotField, `meta`> & {
  meta: Omit<SnapshotFieldMeta, `id`>;
};

type Snapshot = BaseSnapshot & {
  collections: SnapshotCollection[];
  fields: SnapshotField[];
};

const getFieldType = (prismaFieldType: string): FieldType => {
  if (prismaFieldType === `String`) {
    return `string`;
  }
  if (prismaFieldType === `Boolean`) {
    return `boolean`;
  }
  if (prismaFieldType === `Int`) {
    return `integer`;
  }
  if (prismaFieldType === `BigInt`) {
    return `bigInteger`;
  }
  if (prismaFieldType === `Float`) {
    return `float`;
  }
  if (prismaFieldType === `Decimal`) {
    return `decimal`;
  }
  if (prismaFieldType === `DateTime`) {
    return `dateTime`;
  }
  if (prismaFieldType === `Json`) {
    return `json`;
  }
  if (prismaFieldType === `Bytes`) {
    return `binary`;
  }
  return `unknown`;
};

const dmmfToSnapshot = (
  directus: string,
  version: number,
  config: Config,
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
        collapse: collectionDirectives.find(`collapse`)?.args[0] ?? `open`,
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
      const choices = fieldDirectives.filter(`choice`).map((directive) => ({
        text: directive.args[0],
        value: directive.args[1],
      }));
      const conditions = fieldDirectives
        .filter(`condition`)
        .map((directive) => {
          const condition = config.conditions[directive.args[0]];
          if (!condition) {
            throw new Error(`Condition "${directive.args[0]}" not found`);
          }
          return condition;
        });
      const displayOptions = fieldDirectives
        .filter(`displayOption`)
        .reduce<null | Record<string, string>>(
          (displayOptions = {}, { args: [key, value] }) => ({
            ...displayOptions,
            [key]: value,
          }),
          null,
        );
      const special = fieldDirectives
        .filter(`special`)
        .map((directive) => directive.args[0]);
      const validation = fieldDirectives.find(`validation`);
      const filter =
        typeof validation !== `undefined`
          ? config.filters[validation.args[0]]
          : null;
      if (filter !== null && typeof filter === `undefined`) {
        throw new Error(`Filter "${validation?.args[0]}" not found`);
      }
      const translations = fieldDirectives
        .filter(`translation`)
        .map((directive) => ({
          language: directive.args[0],
          translation: directive.args[1],
        }));

      const directusField: SnapshotField = {
        collection: collectionName,
        field: fieldName,
        meta: {
          collection: collectionName,
          conditions: conditions.length > 0 ? conditions : null,
          display: fieldDirectives.find(`display`)?.args[0] ?? null,
          display_options: displayOptions,
          field: fieldName,
          group: fieldDirectives.find(`group`)?.args[0] ?? null,
          hidden: fieldDirectives.find(`hidden`) !== undefined,
          interface: fieldDirectives.find(`interface`)?.args[0] ?? null,
          note: fieldDirectives.find(`note`)?.args[0] ?? null,
          options: {
            choices: choices.length > 0 ? choices : undefined,
            enableLink: fieldDirectives.find(`enableLink`) !== undefined,
            languageDirectionField: fieldDirectives.find(
              `languageDirectionField`,
            )?.args[0],
            languageField: fieldDirectives.find(`languageField`)?.args[0],
          },
          readonly: fieldDirectives.find(`readonly`) !== undefined,
          required: fieldDirectives.find(`required`) !== undefined,
          sort: fieldDirectives.find(`sort`)?.args[0] ?? null,
          special: special.length > 0 ? special : null,
          translations: translations.length > 0 ? translations : null,
          validation: filter as SnapshotFieldMeta[`validation`],
          validation_message:
            fieldDirectives.find(`validationMessage`)?.args[0] ?? null,
          width: fieldDirectives.find(`width`)?.args[0] ?? null,
        },
        name: fieldName,
        schema: null,
        type:
          fieldDirectives.find(`type`)?.args[0] ??
          getFieldType(prismaField.type),
      };
      snapshot.fields.push(directusField);
    }
  }

  return snapshot;
};

export { dmmfToSnapshot };
