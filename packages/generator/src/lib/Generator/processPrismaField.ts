import { omit } from "@/generator/lib/utils";

import type { LogicalFilter } from "@/generator/lib/Generator/Filter";
import type { GeneratorContext } from "@/generator/lib/Generator/GeneratorContext";
import type { PrismaField } from "@/generator/lib/Generator/Prisma";
import type {
  SnapshotField,
  SnapshotFieldMeta,
  SnapshotFieldMetaOptions,
  SnapshotFieldMetaSpecial,
  SnapshotFieldType,
} from "@/generator/lib/Generator/Snapshot";
import type { DMMF } from "@prisma/generator-helper";

const getPrismaFieldDefaultObject = (
  prismaField: PrismaField,
): undefined | DMMF.FieldDefault => {
  if (!prismaField.hasDefaultValue) {
    return;
  }
  const defaultValue = prismaField.default;
  if (
    typeof defaultValue !== `object` ||
    defaultValue === null ||
    Array.isArray(defaultValue)
  ) {
    return;
  }
  return defaultValue as DMMF.FieldDefault;
};

type DatabaseScalarType =
  | `biginteger`
  | `bigserial`
  | `boolean`
  | `bytea`
  | `double precision`
  | `integer`
  | `jsonb`
  | `numeric`
  | `serial`
  | `text`
  | `timestamp with time zone`
  | `uuid`;

type DatabaseType =
  | {
      readonly kind: `scalar`;
      readonly type: DatabaseScalarType;
    }
  | {
      readonly kind: `enum`;
      readonly type: string;
    };

const getPrismaModelSnapshotTypes = (
  ctx: GeneratorContext,
  prismaField: PrismaField,
  stack: PrismaField[] = [],
):
  | undefined
  | {
      readonly dbType: DatabaseType;
      readonly directusType: Exclude<SnapshotFieldType, `alias`>;
    }
  | {
      readonly directusType: `alias`;
    } => {
  if (stack.includes(prismaField)) {
    throw new Error(`[field=${prismaField.name}] Circular reference`);
  }
  stack.push(prismaField);
  const prismaFieldDirectives = ctx.getDirectivesOfPrismaField(prismaField);
  if (prismaField.isList) {
    for (const directive of [`m2m`, `m2o`, `o2m`, `translations`] as const) {
      if (prismaFieldDirectives.find(directive) !== undefined) {
        return {
          directusType: `alias`,
        };
      }
    }
  }
  if (prismaField.kind === `object`) {
    return;
  }
  const defaultObject = getPrismaFieldDefaultObject(prismaField);
  const localPrismaItemRelation =
    ctx.getLocalPrismaItemRelationOfLocalPrismaField(prismaField);
  if (localPrismaItemRelation) {
    const remotePrismaFieldOfPrismaLocalItemRelation =
      ctx.getRemotePrismaFieldOfLocalPrismaItemRelation(
        localPrismaItemRelation,
      );
    return getPrismaModelSnapshotTypes(
      ctx,
      remotePrismaFieldOfPrismaLocalItemRelation,
      stack,
    );
  }
  if (prismaField.kind === `scalar`) {
    if (
      ctx.getDirectivesOfPrismaField(prismaField).find(`uuid`) !== undefined ||
      defaultObject?.name === `uuid` ||
      (defaultObject?.name === `dbgenerated` &&
        typeof defaultObject.args[0] === `string` &&
        defaultObject.args[0] === `gen_random_uuid()`)
    ) {
      return {
        dbType: {
          kind: `scalar`,
          type: `uuid`,
        },
        directusType: `uuid`,
      };
    }
    if (prismaField.type === `String`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `text`,
        },
        directusType: `text`,
      };
    }
    if (prismaField.type === `Boolean`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `boolean`,
        },
        directusType: `boolean`,
      };
    }
    if (prismaField.type === `Int`) {
      if (defaultObject?.name === `autoincrement`) {
        return {
          dbType: {
            kind: `scalar`,
            type: `serial`,
          },
          directusType: `unknown`,
        };
      }
      return {
        dbType: {
          kind: `scalar`,
          type: `integer`,
        },
        directusType: `integer`,
      };
    }
    if (prismaField.type === `BigInt`) {
      if (defaultObject?.name === `autoincrement`) {
        return {
          dbType: {
            kind: `scalar`,
            type: `bigserial`,
          },
          directusType: `unknown`,
        };
      }
      return {
        dbType: {
          kind: `scalar`,
          type: `biginteger`,
        },
        directusType: `bigInteger`,
      };
    }
    if (prismaField.type === `Float`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `double precision`,
        },
        directusType: `float`,
      };
    }
    if (prismaField.type === `Decimal`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `numeric`,
        },
        directusType: `decimal`,
      };
    }
    if (prismaField.type === `DateTime`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `timestamp with time zone`,
        },
        directusType: `timestamp`,
      };
    }
    if (prismaField.type === `Json`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `jsonb`,
        },
        directusType: `json`,
      };
    }
    if (prismaField.type === `Bytes`) {
      return {
        dbType: {
          kind: `scalar`,
          type: `bytea`,
        },
        directusType: `binary`,
      };
    }
    throw new Error(
      `[field=${prismaField.name}] Unsupported scalar type: ${prismaField.type}`,
    );
  }
  if (prismaField.kind === `enum`) {
    return {
      dbType: {
        kind: `enum`,
        type: `"${prismaField.type}"`,
      },
      directusType: `unknown`,
    };
  }
  throw new Error(
    `[field=${prismaField.name}] Unsupported field kind: ${prismaField.kind}`,
  );
};

const getPrismaFieldSnapshotDefaultValue = (
  ctx: GeneratorContext,
  prismaField: PrismaField,
): string | number | boolean | null => {
  const directiveDefaultValue = ctx
    .getDirectivesOfPrismaField(prismaField)
    .find(`default`)?.tArgs[0];
  if (directiveDefaultValue !== undefined) {
    if (directiveDefaultValue === `null`) {
      return null;
    }
    return directiveDefaultValue;
  }
  if (prismaField.hasDefaultValue) {
    if (Array.isArray(prismaField.default)) {
      throw new Error(
        `[field=${prismaField.name}] Array default values are not supported`,
      );
    }
    const defaultObject = getPrismaFieldDefaultObject(prismaField);
    if (defaultObject) {
      if (defaultObject.name === `now`) {
        return `CURRENT_TIMESTAMP`;
      }
      if (defaultObject.name === `uuid`) {
        return `gen_random_uuid()`;
      }
      if (defaultObject.name === `autoincrement`) {
        return `nextval('"${prismaField.dbName}_seq"'::regclass)`;
      }
      if (defaultObject.name === `dbgenerated`) {
        const [arg, ...args] = defaultObject.args;
        if (args.length > 0) {
          throw new Error(
            `[field=${prismaField.name}] Composite default values are not supported`,
          );
        }
        if (typeof arg !== `string`) {
          throw new Error(
            `[field=${
              prismaField.name
            }] Invalid default value type argument: ${typeof arg}`,
          );
        }
        return arg;
      }
      throw new Error(
        `[field=${prismaField.name}] Unsupported default value object type: ${defaultObject.name}`,
      );
    }
    if (
      typeof prismaField.default === `string` ||
      typeof prismaField.default === `number` ||
      typeof prismaField.default === `boolean`
    ) {
      return prismaField.default;
    }
    throw new Error(
      `[field=${
        prismaField.name
      }] Unsupported default value scalar type: ${typeof prismaField.default}`,
    );
  }
  return null;
};

const getPrismaFieldSnapshotFieldSchema = (
  ctx: GeneratorContext,
  prismaField: PrismaField,
): SnapshotField[`schema`] => {
  const prismaModel = ctx.getPrismaModelOfPrismaField(prismaField);
  const types = getPrismaModelSnapshotTypes(ctx, prismaField);
  if (types === undefined || types.directusType === `alias`) {
    return;
  }
  const { dbType } = types;
  const directives = ctx.getDirectivesOfPrismaField(prismaField);
  const defaultValue = getPrismaFieldSnapshotDefaultValue(ctx, prismaField);
  let numericPrecision: number | null =
    directives.find(`precision`)?.tArgs[0] ?? null;
  if (numericPrecision === null) {
    if (dbType.kind === `scalar`) {
      if (dbType.type === `double precision`) {
        numericPrecision = 53;
      }
      if (dbType.type === `numeric`) {
        numericPrecision = 65;
      }
      if (dbType.type === `biginteger`) {
        numericPrecision = 64;
      }
      if (dbType.type === `integer`) {
        numericPrecision = 32;
      }
    }
  }
  let numericScale: number | null = directives.find(`scale`)?.tArgs[0] ?? null;
  if (numericScale === null) {
    if (dbType.kind === `scalar`) {
      if (dbType.type === `numeric`) {
        numericScale = 30;
      }
      if (dbType.type === `biginteger` || dbType.type === `integer`) {
        numericScale = 0;
      }
    }
  }
  let foreignKeyTable: string | null = null;
  let foreignKeyColumn: string | null = null;
  const localItemRelationOfLocalPrismaField =
    ctx.getLocalPrismaItemRelationOfLocalPrismaField(prismaField);
  if (localItemRelationOfLocalPrismaField) {
    const remotePrismaFieldOfLocalItemRelation =
      ctx.getRemotePrismaFieldOfLocalPrismaItemRelation(
        localItemRelationOfLocalPrismaField,
      );
    const remotePrismaModel = ctx.getPrismaModelOfPrismaField(
      remotePrismaFieldOfLocalItemRelation,
    );
    foreignKeyTable = remotePrismaModel.dbName ?? remotePrismaModel.name;
    foreignKeyColumn =
      remotePrismaFieldOfLocalItemRelation.dbName ??
      remotePrismaFieldOfLocalItemRelation.name;
  }

  return {
    comment: directives.find(`comment`)?.tArgs[0],
    data_type: dbType.type,
    default_value: defaultValue,
    foreign_key_column: foreignKeyColumn,
    foreign_key_table: foreignKeyTable,
    generation_expression: null,
    has_auto_increment: false,
    is_generated: false,
    is_nullable: !prismaField.isRequired && !prismaField.isId,
    is_primary_key: prismaField.isId,
    is_unique: prismaField.isUnique || prismaField.isId,
    max_length: directives.find(`maxLength`)?.tArgs[0] ?? null,
    name: prismaField.dbName ?? prismaField.name,
    numeric_precision: numericPrecision,
    numeric_scale: numericScale,
    table: prismaModel.dbName ?? prismaModel.name,
  };
};

const processPrismaField = (
  ctx: GeneratorContext,
  prismaField: PrismaField,
  order: number,
): void => {
  ctx.trace(`[${prismaField.name}] processPrismaField`);
  const types = getPrismaModelSnapshotTypes(ctx, prismaField);
  if (types === undefined) {
    return;
  }
  const fieldName = prismaField.dbName ?? prismaField.name;
  const prismaModel = ctx.getPrismaModelOfPrismaField(prismaField);
  const directives = ctx.getDirectivesOfPrismaField(prismaField);
  let choices: SnapshotFieldMetaOptions[`choices`] = undefined;
  if (prismaField.kind === `enum`) {
    const prismaEnum = ctx.datamodel.enums.find(
      (prismaEnum) => prismaEnum.name === prismaField.type,
    );
    if (!prismaEnum) {
      throw new Error(
        `[field=${prismaField.name}] Enum not found: ${prismaField.type}`,
      );
    }
    choices = prismaEnum.values.map((prismaEnumValue) => ({
      text: prismaEnumValue.name,
      value: prismaEnumValue.name,
    }));
  }
  const directiveChoice = directives.filter(`choice`).map((directive) => ({
    text: directive.tArgs[0],
    value: directive.tArgs[1],
  }));
  if (directiveChoice.length > 0) {
    choices = directiveChoice;
  }
  const directiveChoices = directives.find(`choices`)?.kwArgs;
  if (directiveChoices) {
    choices = Object.entries(directiveChoices).map(([value, text]) => ({
      text,
      value,
    }));
  }
  const fieldConditions = directives.filter(`condition`).map((directive) => {
    const condition = ctx.config.conditions[directive.tArgs[0]];
    if (!condition) {
      throw new Error(
        `[${prismaModel.name}.${prismaField.name}] Condition "${directive.tArgs[0]}" not found`,
      );
    }
    return condition;
  });
  let displayOptions = directives
    .filter(`displayOption`)
    .reduce<null | Record<string, string>>(
      (displayOptions = {}, { tArgs: [key, value] }) => ({
        ...displayOptions,
        [key]: value,
      }),
      null,
    );
  let options: null | SnapshotFieldMetaOptions = null;
  if (choices) {
    options ??= {};
    options.choices = choices;
  }
  const limit = directives.find(`limit`);
  if (typeof limit !== `undefined`) {
    options ??= {};
    options.limit = limit.tArgs[0];
  }
  if (directives.find(`link`) !== undefined) {
    options ??= {};
    options.enableLink = true;
  }
  if (directives.find(`allowDuplicates`) !== undefined) {
    options ??= {};
    options.allowDuplicates = true;
  }
  const template = directives.find(`template`)?.tArgs[0];
  if (template !== undefined) {
    options ??= {};
    options.template = template;
  }
  const translations = directives.find(`translations`);
  const languageDirectionField =
    directives.find(`languageDirectionField`)?.tArgs[0] ??
    translations?.tArgs[1];
  if (languageDirectionField !== undefined) {
    options ??= {};
    options.languageDirectionField = languageDirectionField;
    displayOptions ??= {};
    displayOptions[`languageDirectionField`] = languageDirectionField;
  }
  const languageField =
    directives.find(`languageField`)?.tArgs[0] ?? translations?.tArgs[0];
  if (languageField !== undefined) {
    options ??= {};
    options.languageField = languageField;
    displayOptions ??= {};
    displayOptions[`languageField`] = languageField;
  }
  const special: SnapshotFieldMetaSpecial[] = [];
  if (directives.find(`castBoolean`) !== undefined) {
    special.push(`cast-boolean`);
  }
  if (directives.find(`createdAt`) !== undefined) {
    special.push(`date-created`);
  }
  if (directives.find(`updatedAt`) !== undefined) {
    special.push(`date-updated`);
  }
  if (directives.find(`m2m`) !== undefined) {
    special.push(`m2m`);
  }
  if (directives.find(`m2o`) !== undefined) {
    special.push(`m2o`);
  }
  if (directives.find(`o2m`) !== undefined) {
    special.push(`o2m`);
  }
  if (directives.find(`uuid`) !== undefined) {
    special.push(`uuid`);
  }
  const file = directives.find(`image`) ?? directives.find(`file`);
  if (file !== undefined) {
    special.push(`file`);
    if (typeof file.kwArgs.folder === `string`) {
      const folder = ctx.config.folders[file.kwArgs.folder];
      if (!folder) {
        throw new Error(
          `[${prismaModel.name}.${prismaField.name}] Folder "${file.kwArgs.folder}" not found`,
        );
      }
      options ??= {};
      options.folder = folder.id;
    }
  }
  if (
    options?.languageField !== undefined &&
    !special.includes(`translations`)
  ) {
    special.push(`translations`);
  }
  const validation = directives.find(`validation`);
  let validationMessage: null | string =
    directives.find(`validationMessage`)?.tArgs[0] ?? null;
  let validationFilter: null | LogicalFilter = null;
  if (validation) {
    const operator = validation.tArgs[0] === `anyOf` ? `_or` : `_and`;
    const filters = validation.tArgs.slice(1).map((filterName) => {
      const filter = ctx.config.filters[filterName];
      if (!filter) {
        throw new Error(
          `[${prismaModel.name}.${prismaField.name}] Validation Filter "${filterName}" not found`,
        );
      }
      return filter;
    });
    const operands = filters.map((filter) => ({
      [fieldName]: filter.filter,
    }));
    validationFilter =
      operator === `_and` ? { _and: operands } : { _or: operands };
    const filterMessages = filters.map((filter) => filter.message);
    const joinFilterMessages = filterMessages.join(
      filterMessages.length === 1 ? `` : `\n  - `,
    );
    validationMessage =
      filters.length === 1
        ? joinFilterMessages
        : operator === `_and`
          ? `All of the following conditions must be met:\n  - ${joinFilterMessages}`
          : `At least one of the following conditions must be met:\n  - ${joinFilterMessages}`;
  }
  const filter = directives.find(`filter`);
  if (filter) {
    const optionFilter = ctx.config.filters[filter.tArgs[0]];
    if (!optionFilter) {
      throw new Error(
        `[${prismaModel.name}.${prismaField.name}] Filter "${filter?.tArgs[0]}" not found`,
      );
    }
    options ??= {};
    options.filter = { _and: [optionFilter.filter] };
  }
  const customSyntaxes = directives.filter(`customSyntax`);
  for (const {
    tArgs: [customSyntaxName],
  } of customSyntaxes) {
    const customSyntax = ctx.config.richTextCustomSyntaxes.find(
      (customSyntax) => customSyntax.name === customSyntaxName,
    );
    if (customSyntax === undefined) {
      throw new Error(
        `[${prismaModel.name}.${prismaField.name}] Custom syntax "${customSyntaxName}" not found`,
      );
    }
    if (customSyntax.global) {
      continue;
    }
    options ??= {};
    options.customSyntax ??= [];
    options.customSyntax.push(omit(customSyntax, [`global`]));
  }
  for (const customSyntax of ctx.config.richTextCustomSyntaxes) {
    if (customSyntax.global) {
      options ??= {};
      options.customSyntax ??= [];
      options.customSyntax.push(omit(customSyntax, [`global`]));
    }
  }
  const fieldTranslations = directives.filter(`fieldTranslation`);
  const { directusType } = types;

  const snapshotField: SnapshotField = {
    collection: prismaModel.dbName ?? prismaModel.name,
    field: fieldName,
    meta: {
      collection: prismaModel.dbName ?? prismaModel.name,
      conditions: fieldConditions.length > 0 ? fieldConditions : null,
      display:
        directives.find(`display`)?.tArgs[0] ??
        (directives.find(`boolean`) !== undefined
          ? `boolean`
          : directives.find(`datetime`) !== undefined
            ? `datetime`
            : directives.find(`image`) !== undefined
              ? `image`
              : special.includes(`translations`)
                ? `translations`
                : null),
      display_options: displayOptions,
      field: prismaField.dbName ?? prismaField.name,
      group: directives.find(`group`)?.tArgs[0] ?? null,
      hidden: directives.find(`hidden`) !== undefined,
      interface:
        directives.find(`interface`)?.tArgs[0] ??
        (directives.find(`boolean`) !== undefined
          ? `boolean`
          : directives.find(`datetime`) !== undefined
            ? `datetime`
            : directives.find(`image`) !== undefined
              ? `file-image`
              : directives.find(`richText`) !== undefined
                ? `input-rich-text-md`
                : directives.find(`m2m`) !== undefined
                  ? `list-m2m`
                  : directives.find(`o2m`) !== undefined
                    ? `list-o2m`
                    : directives.find(`m2o`) !== undefined
                      ? `select-dropdown-m2o`
                      : choices
                        ? `select-dropdown`
                        : directives.find(`translations`) !== undefined
                          ? `translations`
                          : null),
      note: directives.find(`note`)?.tArgs[0] ?? null,
      options,
      readonly: directives.find(`readonly`) !== undefined,
      required: directives.find(`required`) !== undefined,
      sort: directives.find(`sort`)?.tArgs[0] ?? order,
      special: special.length > 0 ? special : null,
      translations:
        fieldTranslations.length > 0
          ? fieldTranslations.map(({ tArgs: [language, translation] }) => ({
              language,
              translation,
            }))
          : null,
      validation: validationFilter as SnapshotFieldMeta[`validation`],
      validation_message: validationMessage,
      width: directives.find(`width`)?.tArgs[0] ?? `full`,
    },
    schema: getPrismaFieldSnapshotFieldSchema(ctx, prismaField),
    type: directusType,
  };

  ctx.snapshot.fields.push(snapshotField);
};

export { processPrismaField };
