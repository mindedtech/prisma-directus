import {
  parseCollectionDirectives,
  parseFieldDirectives,
} from "@/generator/lib/Directive";

import type { Condition } from "@/generator/lib/Condition";
import type { Config } from "@/generator/lib/Config";
import type { FieldDirectives } from "@/generator/lib/Directive";
import type { FieldType } from "@/generator/lib/FieldType";
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
import type { DMMF } from "@prisma/generator-helper";

type SnapshotCollection = BaseCollection & {
  meta: BaseCollectionMeta & {
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
    translations: null | Record<string, string>;
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

const createBaseSnapshot = (directus: string, version: number): Snapshot => {
  const snapshot: Snapshot = {
    collections: [
      {
        collection: `_prisma_migrations`,
        meta: {
          accountability: `all`,
          archive_app_filter: true,
          archive_field: null,
          archive_value: null,
          collapse: `open`,
          collection: `_prisma_migrations`,
          color: null,
          display_template: null,
          group: null,
          hidden: true,
          icon: null,
          item_duplication_fields: null,
          note: null,
          preview_url: null,
          singleton: false,
          sort: null,
          sort_field: null,
          translations: {},
          unarchive_value: null,
          versioning: false,
        },
        schema: {
          name: `_prisma_migrations`,
        },
      },
    ],
    directus,
    fields: [
      {
        collection: `_prisma_migrations`,
        field: `applied_steps_count`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `applied_steps_count`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `integer`,
          default_value: 0,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: false,
          is_primary_key: false,
          is_unique: false,
          max_length: null,
          name: `applied_steps_count`,
          numeric_precision: 32,
          numeric_scale: 0,
          table: `_prisma_migrations`,
        },
        type: `integer`,
      },
      {
        collection: `_prisma_migrations`,
        field: `checksum`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `checksum`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `character varying`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: false,
          is_primary_key: false,
          is_unique: false,
          max_length: 64,
          name: `checksum`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `string`,
      },
      {
        collection: `_prisma_migrations`,
        field: `finished_at`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `finished_at`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `timestamp with time zone`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: true,
          is_primary_key: false,
          is_unique: false,
          max_length: null,
          name: `finished_at`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `timestamp`,
      },
      {
        collection: `_prisma_migrations`,
        field: `id`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `id`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `character varying`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: false,
          is_primary_key: true,
          is_unique: true,
          max_length: 36,
          name: `id`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `string`,
      },
      {
        collection: `_prisma_migrations`,
        field: `logs`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `logs`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `text`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: true,
          is_primary_key: false,
          is_unique: false,
          max_length: null,
          name: `logs`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `text`,
      },
      {
        collection: `_prisma_migrations`,
        field: `migration_name`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `migration_name`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `character varying`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: false,
          is_primary_key: false,
          is_unique: false,
          max_length: 255,
          name: `migration_name`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `string`,
      },
      {
        collection: `_prisma_migrations`,
        field: `rolled_back_at`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `rolled_back_at`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `timestamp with time zone`,
          default_value: null,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: true,
          is_primary_key: false,
          is_unique: false,
          max_length: null,
          name: `rolled_back_at`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `timestamp`,
      },
      {
        collection: `_prisma_migrations`,
        field: `started_at`,
        meta: {
          collection: `_prisma_migrations`,
          conditions: null,
          display: null,
          display_options: null,
          field: `started_at`,
          group: null,
          hidden: false,
          interface: null,
          note: null,
          options: null,
          readonly: false,
          required: false,
          sort: null,
          special: null,
          translations: null,
          validation: null,
          validation_message: null,
          width: `full`,
        },
        schema: {
          data_type: `timestamp with time zone`,
          default_value: `now()`,
          foreign_key_column: null,
          foreign_key_table: null,
          generation_expression: null,
          has_auto_increment: false,
          is_generated: false,
          is_nullable: false,
          is_primary_key: false,
          is_unique: false,
          max_length: null,
          name: `started_at`,
          numeric_precision: null,
          numeric_scale: null,
          table: `_prisma_migrations`,
        },
        type: `timestamp`,
      },
    ],
    relations: [],
    vendor: `postgres`,
    version,
  };

  return snapshot;
};

type Log = (...args: unknown[]) => void;

const prismaModelToDirectusCollection = (
  prismaModel: DMMF.Datamodel[`models`][number],
  directivePrefix: string,
): SnapshotCollection => {
  if (
    prismaModel.primaryKey?.fields &&
    prismaModel.primaryKey.fields.length > 1
  ) {
    throw new Error(
      `[${prismaModel.name}] Composite primary keys are not supported`,
    );
  }
  const collectionDirectives = parseCollectionDirectives(
    directivePrefix,
    prismaModel.documentation,
  );
  const accountability = collectionDirectives.find(`accountability`)?.tArgs[0];
  const itemDuplicationFields = collectionDirectives
    .filter(`itemDuplicationField`)
    .map((directive) => directive.tArgs[0]);
  const directusCollection: SnapshotCollection = {
    collection: prismaModel.dbName ?? prismaModel.name,
    meta: {
      accountability:
        accountability === `null` || typeof accountability === `undefined`
          ? null
          : accountability,
      archive_app_filter:
        collectionDirectives.find(`archiveAppFilter`) !== undefined,
      archive_field:
        collectionDirectives.find(`archiveField`)?.tArgs[0] ?? null,
      archive_value:
        collectionDirectives.find(`archiveValue`)?.tArgs[0] ?? null,
      collapse: collectionDirectives.find(`collapse`)?.tArgs[0] ?? `open`,
      collection: prismaModel.dbName ?? prismaModel.name,
      color: collectionDirectives.find(`color`)?.tArgs[0] ?? null,
      display_template:
        collectionDirectives.find(`displayTemplate`)?.tArgs[0] ?? null,
      group: collectionDirectives.find(`group`)?.tArgs[0] ?? null,
      hidden: collectionDirectives.find(`hidden`) !== undefined,
      icon: collectionDirectives.find(`icon`)?.tArgs[0] ?? null,
      item_duplication_fields:
        itemDuplicationFields.length > 0 ? itemDuplicationFields : null,
      note: collectionDirectives.find(`note`)?.tArgs[0] ?? null,
      preview_url: collectionDirectives.find(`previewUrl`)?.tArgs[0] ?? null,
      singleton: collectionDirectives.find(`singleton`) !== undefined,
      sort: collectionDirectives.find(`sort`)?.tArgs[0] ?? null,
      sort_field: collectionDirectives.find(`sortField`)?.tArgs[0] ?? null,
      translations: Object.fromEntries(
        collectionDirectives
          .filter(`translation`)
          .map((directive) => directive.tArgs),
      ),
      unarchive_value:
        collectionDirectives.find(`unarchiveValue`)?.tArgs[0] ?? null,
      versioning: collectionDirectives.find(`versioning`) !== undefined,
    },
    schema: {
      name: prismaModel.dbName ?? prismaModel.name,
    },
  };

  return directusCollection;
};

const getDirectusFieldType = (
  prismaField: DMMF.Datamodel[`models`][number][`fields`][number],
): FieldType => {
  const defaultObject =
    prismaField.default !== null &&
    typeof prismaField.default === `object` &&
    !Array.isArray(prismaField.default)
      ? prismaField.default
      : null;
  if (prismaField.kind === `scalar`) {
    if (prismaField.type === `String`) {
      if (
        defaultObject?.name === `uuid` ||
        (defaultObject?.name === `dbgenerated` &&
          defaultObject?.args[0] === `gen_random_uuid()`)
      ) {
        return `uuid`;
      }
      return `text`;
    }
    if (prismaField.type === `Boolean`) {
      return `boolean`;
    }
    if (prismaField.type === `Int`) {
      if (defaultObject?.name === `autoincrement`) {
        return `unknown`;
      }
      return `integer`;
    }
    if (prismaField.type === `BigInt`) {
      if (defaultObject?.name === `autoincrement`) {
        return `unknown`;
      }
      return `bigInteger`;
    }
    if (prismaField.type === `Float`) {
      return `float`;
    }
    if (prismaField.type === `Decimal`) {
      return `decimal`;
    }
    if (prismaField.type === `DateTime`) {
      return `timestamp`;
    }
    if (prismaField.type === `Json`) {
      return `json`;
    }
    if (prismaField.type === `Bytes`) {
      return `binary`;
    }
    if (prismaField.type === `UUID`) {
      return `uuid`;
    }
  }
  if (prismaField.kind === `enum`) {
    return `string`;
  }
  if (prismaField.kind === `object`) {
    return `json`;
  }
  return `unknown`;
};

const getSchemaFieldType = (
  prismaField: DMMF.Datamodel[`models`][number][`fields`][number],
): string => {
  const defaultObject =
    prismaField.default !== null &&
    typeof prismaField.default === `object` &&
    !Array.isArray(prismaField.default)
      ? prismaField.default
      : null;
  if (prismaField.kind === `scalar`) {
    if (prismaField.type === `String`) {
      if (
        defaultObject?.name === `uuid` ||
        (defaultObject?.name === `dbgenerated` &&
          defaultObject?.args[0] === `gen_random_uuid()`)
      ) {
        return `uuid`;
      }
      return `text`;
    }
    if (prismaField.type === `Boolean`) {
      return `boolean`;
    }
    if (prismaField.type === `Int`) {
      if (defaultObject?.name === `autoincrement`) {
        return `serial`;
      }
      return `integer`;
    }
    if (prismaField.type === `BigInt`) {
      if (defaultObject?.name === `autoincrement`) {
        return `bigserial`;
      }
      return `biginteger`;
    }
    if (prismaField.type === `Float`) {
      return `double precision`;
    }
    if (prismaField.type === `Decimal`) {
      return `numeric`;
    }
    if (prismaField.type === `DateTime`) {
      return `timestamp with time zone`;
    }
    if (prismaField.type === `Json`) {
      return `jsonb`;
    }
    if (prismaField.type === `Bytes`) {
      return `bytea`;
    }
    if (prismaField.type === `UUID`) {
      return `uuid`;
    }
  }
  if (prismaField.kind === `enum`) {
    return `string`;
  }
  if (prismaField.kind === `object`) {
    return `jsonb`;
  }
  return `unknown`;
};

const prismaFieldToDirectusFieldSchema = (
  prismaModel: DMMF.Datamodel[`models`][number],
  prismaField: DMMF.Datamodel[`models`][number][`fields`][number],
  relation: null | {
    prismaModel: DMMF.Datamodel[`models`][number];
    prismaField: DMMF.Datamodel[`models`][number][`fields`][number];
  },
  directives: FieldDirectives,
): SnapshotField[`schema`] => {
  let defaultValue: string | number | boolean | null = null;
  const defaultValueDirective = directives.find(`defaultValue`);
  if (defaultValueDirective) {
    if (defaultValueDirective.tArgs[0] === `null`) {
      defaultValue = null;
    } else {
      defaultValue = defaultValueDirective.tArgs[1];
    }
  } else if (prismaField.hasDefaultValue) {
    if (Array.isArray(prismaField.default)) {
      throw new Error(
        `[${prismaModel.name}.${prismaField.name}] Array default values are not supported`,
      );
    } else if (
      prismaField.default === null ||
      typeof prismaField.default === `undefined`
    ) {
      defaultValue = null;
    } else if (typeof prismaField.default === `object`) {
      const defaultObject = prismaField.default;
      if (defaultObject.name === `now`) {
        defaultValue = `CURRENT_TIMESTAMP`;
      } else if (defaultObject.name === `uuid`) {
        defaultValue = `gen_random_uuid()`;
      } else if (defaultObject.name === `cuid`) {
        throw new Error(
          `[${prismaModel.name}.${prismaField.name}] CUID default values are not supported`,
        );
      } else if (defaultObject.name === `autoincrement`) {
        defaultValue = `nextval('"${prismaModel.dbName ?? prismaModel.name}_${
          prismaField.dbName ?? prismaField.name
        }_seq"'::regclass)`;
      } else if (defaultObject.name === `dbgenerated`) {
        const arg: unknown = defaultObject.args[0];
        if (typeof arg !== `string`) {
          throw new Error(
            `[${prismaModel.name}.${prismaField.name}] DB generated default values must be strings`,
          );
        }
        defaultValue = arg;
      } else {
        throw new Error(
          `[${prismaModel.name}.${
            prismaField.name
          }] Unknown default value: ${JSON.stringify(defaultValue)}`,
        );
      }
    } else if (
      typeof prismaField.default === `string` ||
      typeof prismaField.default === `number` ||
      typeof prismaField.default === `boolean`
    ) {
      defaultValue = prismaField.default;
    } else {
      throw new Error(
        `[${prismaModel.name}.${
          prismaField.name
        }] Unknown default value: ${JSON.stringify(defaultValue)}`,
      );
    }
  }
  const dataType = relation
    ? getSchemaFieldType(relation.prismaField)
    : getSchemaFieldType(prismaField);
  const maxLength = directives.find(`maxLength`)?.tArgs[0] ?? null;
  const numericPrecision =
    directives.find(`numericPrecision`)?.tArgs[0] ??
    (prismaField.type === `Float`
      ? 53
      : prismaField.type === `Decimal`
        ? 65
        : prismaField.type === `BigInt`
          ? 64
          : prismaField.type === `Int`
            ? 32
            : null);
  const numericScale =
    directives.find(`numericScale`)?.tArgs[0] ??
    (prismaField.type === `Decimal`
      ? 30
      : prismaField.type === `BigInt`
        ? 0
        : prismaField.type === `Int`
          ? 0
          : null);
  const directusFieldSchema: SnapshotField[`schema`] = {
    data_type: dataType,
    default_value: defaultValue,
    foreign_key_column:
      relation?.prismaField.dbName ?? relation?.prismaField.name ?? null,
    foreign_key_table:
      relation?.prismaModel.dbName ?? relation?.prismaModel.name ?? null,
    generation_expression: null,
    has_auto_increment: false,
    is_generated: prismaField.isGenerated ?? false,
    is_nullable: !prismaField.isRequired,
    is_primary_key: prismaField.isId,
    is_unique: prismaField.isUnique || prismaField.isId,
    max_length: maxLength,
    name: prismaField.name,
    numeric_precision: numericPrecision,
    numeric_scale: numericScale,
    table: prismaModel.dbName ?? prismaModel.name,
  };

  return directusFieldSchema;
};

const isRelationField = (prismaField: DMMF.Field): boolean =>
  typeof prismaField.relationFromFields !== `undefined` ||
  typeof prismaField.relationToFields !== `undefined`;

const prismaFieldToDirectusField = (
  dmmf: DMMF.Document,
  prismaModel: DMMF.Datamodel[`models`][number],
  prismaField: DMMF.Datamodel[`models`][number][`fields`][number],
  directusCollection: SnapshotCollection,
  conditions: Record<string, Condition>,
  filters: Record<string, Filter>,
  directivePrefix: string,
): SnapshotField => {
  const isRelation = isRelationField(prismaField);
  const fieldDirectives = parseFieldDirectives(
    directivePrefix,
    prismaField.documentation,
  );
  let choices: SnapshotFieldMetaOptionsChoice[] | undefined = undefined;
  if (prismaField.kind === `enum`) {
    const prismaEnum = dmmf.datamodel.enums.find(
      (prismaEnum) => prismaEnum.name === prismaField.type,
    );
    if (prismaEnum) {
      choices = prismaEnum.values.map((prismaEnumValue) => ({
        text: prismaEnumValue.name,
        value: prismaEnumValue.name,
      }));
    }
  }
  const directiveChoices = fieldDirectives
    .filter(`choice`)
    .map((directive) => ({
      text: directive.tArgs[0],
      value: directive.tArgs[1],
    }));
  if (directiveChoices.length > 0) {
    choices = directiveChoices;
  }
  const fieldConditions = fieldDirectives
    .filter(`condition`)
    .map((directive) => {
      const condition = conditions[directive.tArgs[0]];
      if (!condition) {
        throw new Error(
          `[${directusCollection.schema.name}.${prismaField.name}] Condition "${directive.tArgs[0]}" not found`,
        );
      }
      return condition;
    });
  const displayOptions = fieldDirectives
    .filter(`displayOption`)
    .reduce<null | Record<string, string>>(
      (displayOptions = {}, { tArgs: [key, value] }) => ({
        ...displayOptions,
        [key]: value,
      }),
      null,
    );
  const special = fieldDirectives
    .filter(`special`)
    .map((directive) => directive.tArgs[0]);
  const validation = fieldDirectives.find(`validation`);
  const filter =
    typeof validation !== `undefined` ? filters[validation.tArgs[0]] : null;
  if (filter !== null && typeof filter === `undefined`) {
    throw new Error(
      `[${directusCollection.schema.name}.${prismaField.name}] Filter "${validation?.tArgs[0]}" not found`,
    );
  }
  const translations = fieldDirectives
    .filter(`translation`)
    .map((directive) => ({
      language: directive.tArgs[0],
      translation: directive.tArgs[1],
    }));

  let relation: null | { prismaModel: DMMF.Model; prismaField: DMMF.Field } =
    null;
  for (const prismaRelation of prismaModel.fields) {
    if (prismaRelation.relationFromFields) {
      if (prismaRelation.relationFromFields.includes(prismaField.name)) {
        const relatedPrismaModel = dmmf.datamodel.models.find(
          (prismaModel) => prismaModel.name === prismaRelation.type,
        );
        if (!relatedPrismaModel) {
          throw new Error(
            `[${prismaModel.name}.${prismaField.name}] Related model "${prismaRelation.type}" not found`,
          );
        }
        const relatedPrismaField = relatedPrismaModel.fields.find(
          (prismaField) =>
            prismaField.name === prismaRelation.relationToFields?.[0],
        );
        if (!relatedPrismaField) {
          throw new Error(
            `[${prismaModel.name}.${prismaField.name}] Related field "${prismaRelation.relationToFields?.[0]}" not found`,
          );
        }
        relation = {
          prismaField: relatedPrismaField,
          prismaModel: relatedPrismaModel,
        };
        break;
      }
    }
  }

  const fieldType =
    fieldDirectives.find(`type`)?.tArgs[0] ??
    (isRelation
      ? `alias`
      : relation
        ? getDirectusFieldType(relation.prismaField)
        : getDirectusFieldType(prismaField));

  const directusField: SnapshotField = {
    collection: directusCollection.collection,
    field: prismaField.dbName ?? prismaField.name,
    meta: {
      collection: directusCollection.collection,
      conditions: fieldConditions.length > 0 ? fieldConditions : null,
      display: fieldDirectives.find(`display`)?.tArgs[0] ?? null,
      display_options: displayOptions,
      field: prismaField.dbName ?? prismaField.name,
      group: fieldDirectives.find(`group`)?.tArgs[0] ?? null,
      hidden: fieldDirectives.find(`hidden`) !== undefined,
      interface: fieldDirectives.find(`interface`)?.tArgs[0] ?? null,
      note: fieldDirectives.find(`note`)?.tArgs[0] ?? null,
      options: {
        choices,
        enableLink:
          fieldDirectives.find(`enableLink`) !== undefined ? true : undefined,
        languageDirectionField: fieldDirectives.find(`languageDirectionField`)
          ?.tArgs[0],
        languageField: fieldDirectives.find(`languageField`)?.tArgs[0],
      },
      readonly:
        fieldDirectives.find(`readonly`) !== undefined ||
        prismaField.isReadOnly,
      required:
        fieldDirectives.find(`required`) !== undefined ||
        prismaField.isRequired,
      sort: fieldDirectives.find(`sort`)?.tArgs[0] ?? null,
      special: special.length > 0 ? special : null,
      translations: translations.length > 0 ? translations : null,
      validation: filter as SnapshotFieldMeta[`validation`],
      validation_message:
        fieldDirectives.find(`validationMessage`)?.tArgs[0] ?? null,
      width: fieldDirectives.find(`width`)?.tArgs[0] ?? `full`,
    },
    schema:
      fieldType === `alias`
        ? undefined
        : prismaFieldToDirectusFieldSchema(
            prismaModel,
            prismaField,
            relation,
            fieldDirectives,
          ),
    type: fieldType,
  };

  return directusField;
};

const prismaFieldToDirectusRelation = (
  dmmf: DMMF.Document,
  snapshot: Snapshot,
  prismaModel: DMMF.Datamodel[`models`][number],
  prismaField: DMMF.Datamodel[`models`][number][`fields`][number],
  directivePrefix: string,
): SnapshotRelation => {
  const relationName = prismaField.relationName;
  if (typeof relationName === `undefined`) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Relation name not found`,
    );
  }
  const directusCollection = snapshot.collections.find(
    (collection) =>
      collection.collection === (prismaModel.dbName ?? prismaModel.name),
  );
  if (!directusCollection) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Collection "${prismaModel.name}" not found`,
    );
  }
  const directusField = snapshot.fields.find(
    (field) =>
      field.collection === (prismaModel.dbName ?? prismaModel.name) &&
      field.field === (prismaField.dbName ?? prismaField.name),
  );
  if (!directusField) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Directus field not found`,
    );
  }
  const relatedPrismaModel = dmmf.datamodel.models.find(
    (prismaModel) => prismaModel.name === prismaField.type,
  );
  if (!relatedPrismaModel) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Related model "${prismaField.type}" not found`,
    );
  }
  const relatedDirectusCollection = snapshot.collections.find(
    (collection) =>
      collection.collection ===
      (relatedPrismaModel.dbName ?? relatedPrismaModel.name),
  );
  if (!relatedDirectusCollection) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Related collection "${relatedPrismaModel.name}" not found`,
    );
  }
  const relatedPrismaField = relatedPrismaModel.fields.find(
    (prismaField) => prismaField.relationName === relationName,
  );
  if (!relatedPrismaField) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Related Prisma field "${relationName}" not found`,
    );
  }
  const relatedDirectusField = snapshot.fields.find(
    (field) =>
      field.collection === relatedDirectusCollection.collection &&
      field.field === relatedPrismaField.name,
  );
  if (!relatedDirectusField) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Related Directus field "${relatedPrismaField.name}" not found`,
    );
  }
  const fieldDirectives = parseFieldDirectives(
    directivePrefix,
    prismaField.documentation,
  );
  const constraintName =
    fieldDirectives.find(`constraintName`)?.tArgs[0] ?? null;
  if (typeof constraintName !== `string`) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Constraint name not found`,
    );
  }
  const onUpdate =
    prismaField.relationOnDelete === `Cascade`
      ? `CASCADE`
      : prismaField.relationOnDelete === `SetNull`
        ? `SET NULL`
        : prismaField.relationOnDelete === `NoAction`
          ? `NO ACTION`
          : prismaField.relationOnDelete === `Restrict`
            ? `RESTRICT`
            : null;

  if (prismaField.isList) {
    const directusRelation: SnapshotRelation = {
      collection: directusField.collection,
      field: directusField.field,
      meta: {
        junction_field: fieldDirectives.find(`junctionField`)?.tArgs[0] ?? null,
        many_collection: relatedDirectusCollection.collection,
        many_field: relatedDirectusField.field,
        one_allowed_collections: null,
        one_collection: directusCollection.collection,
        one_collection_field: null,
        one_deselect_action: `delete`,
        one_field: directusField.field,
        sort_field: fieldDirectives.find(`sortField`)?.tArgs[0] ?? null,
      },
      related_collection: relatedDirectusCollection.collection,
      schema: {
        column: relatedPrismaField.dbName ?? relatedPrismaField.name,
        constraint_name: constraintName,
        foreign_key_column: prismaField.dbName ?? prismaField.name,
        foreign_key_table: prismaModel.dbName ?? prismaModel.name,
        on_delete: onUpdate,
        on_update: onUpdate,
        table: relatedPrismaModel.dbName ?? relatedPrismaModel.name,
      },
    };

    return directusRelation;
  } else {
    const directusRelation: SnapshotRelation = {
      collection: directusField.collection,
      field: directusField.field,
      meta: {
        junction_field: fieldDirectives.find(`junctionField`)?.tArgs[0] ?? null,
        many_collection: directusCollection.collection,
        many_field: directusField.field,
        one_allowed_collections: null,
        one_collection: relatedDirectusCollection.collection,
        one_collection_field: null,
        one_deselect_action: `delete`,
        one_field: relatedDirectusField.field,
        sort_field: fieldDirectives.find(`sortField`)?.tArgs[0] ?? null,
      },
      related_collection: relatedDirectusCollection.collection,
      schema: {
        column: prismaField.dbName ?? prismaField.name,
        constraint_name: constraintName,
        foreign_key_column:
          relatedPrismaField.dbName ?? relatedPrismaField.name,
        foreign_key_table: relatedPrismaModel.dbName ?? relatedPrismaModel.name,
        on_delete: onUpdate,
        on_update: onUpdate,
        table: prismaModel.dbName ?? prismaModel.name,
      },
    };

    return directusRelation;
  }
};

type Options = {
  directus: string;
  version: number;
  config: Config;
  directivePrefix: string;
  verbose: boolean;
};

const dmmfToSnapshot = (
  dmmf: DMMF.Document,
  { config, directivePrefix, directus, verbose, version }: Options,
): {
  snapshot: Snapshot;
  error?: unknown;
} => {
  const snapshot = createBaseSnapshot(directus, version);
  try {
    const log: Log = (...args) => {
      if (verbose) {
        console.log(...args);
      }
    };

    log(`Collections`);

    for (const prismaModel of dmmf.datamodel.models) {
      log(`Collection [${prismaModel.name}] {`);
      const directusCollection = prismaModelToDirectusCollection(
        prismaModel,
        directivePrefix,
      );
      snapshot.collections.push(directusCollection);
      log(`+ ${directusCollection.collection}`);
      for (const prismaField of prismaModel.fields) {
        log(`  Field [${prismaModel.name}.${prismaField.name}] {\n`);
        const directusField = prismaFieldToDirectusField(
          dmmf,
          prismaModel,
          prismaField,
          directusCollection,
          config.conditions,
          config.filters,
          directivePrefix,
        );
        snapshot.fields.push(directusField);
        log(`  } Field [${prismaModel.name}.${prismaField.name}]\n`);
      }
      log(`} Collection [${prismaModel.name}]\n`);
    }

    log(`Relations`);

    for (const prismaModel of dmmf.datamodel.models) {
      log(`Collection Relations [${prismaModel.name}] {`);
      const directusCollection = snapshot.collections.find(
        (collection) =>
          collection.collection === (prismaModel.dbName ?? prismaModel.name),
      );
      if (!directusCollection) {
        throw new Error(`Collection "${prismaModel.name}" not found`);
      }
      for (const prismaField of prismaModel.fields) {
        log(`  Field Relation [${prismaModel.name}.${prismaField.name}] {\n`);
        const directusField = snapshot.fields.find(
          (field) =>
            field.collection === directusCollection.collection &&
            field.field === prismaField.name,
        );
        if (!directusField) {
          throw new Error(
            `[${prismaModel.name}.${prismaField.name}] Field not found`,
          );
        }
        if (isRelationField(prismaField)) {
          const relatedPrismaModel = dmmf.datamodel.models.find(
            (prismaModel) => prismaModel.name === prismaField.type,
          );
          if (!relatedPrismaModel) {
            throw new Error(
              `[${prismaModel.name}.${prismaField.name}] Related model "${prismaField.type}" not found`,
            );
          }
          const relatedDirectusCollection = snapshot.collections.find(
            (collection) =>
              collection.collection ===
              (relatedPrismaModel.dbName ?? relatedPrismaModel.name),
          );
          if (!relatedDirectusCollection) {
            throw new Error(
              `[${prismaModel.name}.${prismaField.name}] Related collection "${relatedPrismaModel.name}" not found`,
            );
          }
          const directusRelation = prismaFieldToDirectusRelation(
            dmmf,
            snapshot,
            prismaModel,
            prismaField,
            directivePrefix,
          );
          snapshot.relations.push(directusRelation);
        }
        log(`  } Field Relation [${prismaModel.name}.${prismaField.name}]\n`);
      }
      log(`} Collection Relations [${prismaModel.name}]\n`);
    }
    return { snapshot };
  } catch (error) {
    return { error, snapshot };
  }
};

export { dmmfToSnapshot };
