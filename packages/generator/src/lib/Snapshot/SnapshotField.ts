import type {
  PrismaField,
  SnapshotContext,
  SnapshotField,
  SnapshotFieldMeta,
  SnapshotFieldMetaOptions,
  SnapshotFieldType,
} from "@/generator/lib/Snapshot/SnapshotTypes";
import type { DMMF } from "@prisma/generator-helper";

const getPrismaFieldDefaultObject = (
  prismaField: PrismaField,
):
  | null
  | (Omit<DMMF.FieldDefault, `args`> & {
      args: unknown[];
    }) =>
  prismaField.default !== null &&
  typeof prismaField.default === `object` &&
  !Array.isArray(prismaField.default)
    ? prismaField.default
    : null;

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
  ctx: SnapshotContext,
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
  if (prismaField.isList) {
    return {
      directusType: `alias`,
    };
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
      ctx
        .getDirectivesOfPrismaField(prismaField)
        .filter(`special`)
        .some((directive) => directive.tArgs[0] === `uuid`) ||
      defaultObject?.name === `uuid` ||
      (defaultObject?.name === `dbgenerated` &&
        defaultObject?.args[0] === `gen_random_uuid()`)
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
        type: prismaField.type,
      },
      directusType: `string`,
    };
  }
  throw new Error(
    `[field=${prismaField.name}] Unsupported field kind: ${prismaField.kind}`,
  );
};

const getPrismaFieldSnapshotDefaultValue = (
  ctx: SnapshotContext,
  prismaField: PrismaField,
): string | number | boolean | null => {
  const directiveDefaultValue = ctx
    .getDirectivesOfPrismaField(prismaField)
    .find(`defaultValue`)?.tArgs[0];
  if (typeof directiveDefaultValue !== `undefined`) {
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
        return `CUURRENT_TIMESTAMP`;
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
  ctx: SnapshotContext,
  prismaField: PrismaField,
): SnapshotField[`schema`] => {
  const prismaModel = ctx.getPrismaModelOfPrismaField(prismaField);
  const types = getPrismaModelSnapshotTypes(ctx, prismaField);
  if (typeof types === `undefined` || types.directusType === `alias`) {
    return;
  }
  const { dbType } = types;
  const directives = ctx.getDirectivesOfPrismaField(prismaField);
  const defaultValue = getPrismaFieldSnapshotDefaultValue(ctx, prismaField);
  let numericPrecision: number | null =
    directives.find(`numericPrecision`)?.tArgs[0] ?? null;
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
  let numericScale: number | null =
    directives.find(`numericScale`)?.tArgs[0] ?? null;
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
    comment: directives.find(`comment`)?.tArgs[0] ?? null,
    data_type: dbType.type,
    default_value: defaultValue,
    foreign_key_column: foreignKeyColumn,
    foreign_key_table: foreignKeyTable,
    generation_expression: null,
    has_auto_increment: false,
    is_generated: false,
    is_nullable: !prismaField.isRequired,
    is_primary_key: prismaField.isId,
    is_unique: prismaField.isUnique || prismaField.isId,
    max_length: directives.find(`maxLength`)?.tArgs[0] ?? null,
    name: prismaField.dbName ?? prismaField.name,
    numeric_precision: numericPrecision,
    numeric_scale: numericScale,
    table: prismaModel.dbName ?? prismaModel.name,
  };
};

const prismaFieldToSnapshotField = (
  ctx: SnapshotContext,
  prismaField: PrismaField,
): undefined | SnapshotField => {
  const types = getPrismaModelSnapshotTypes(ctx, prismaField);
  if (typeof types === `undefined`) {
    return undefined;
  }
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
  const directiveChoices = directives.filter(`choice`).map((directive) => ({
    text: directive.tArgs[0],
    value: directive.tArgs[1],
  }));
  if (directiveChoices.length > 0) {
    choices = directiveChoices;
  }
  const fieldConditions = directives.filter(`condition`).map((directive) => {
    const condition = ctx.conditions[directive.tArgs[0]];
    if (!condition) {
      throw new Error(
        `[${prismaModel.name}.${prismaField.name}] Condition "${directive.tArgs[0]}" not found`,
      );
    }
    return condition;
  });
  const displayOptions = directives
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
  if (directives.find(`enableLink`) !== undefined) {
    options ??= {};
    options.enableLink = true;
  }
  const languageDirectionField = directives.find(`languageDirectionField`)
    ?.tArgs[0];
  if (languageDirectionField !== undefined) {
    options ??= {};
    options.languageDirectionField = languageDirectionField;
  }
  const languageField = directives.find(`languageField`)?.tArgs[0];
  if (languageField !== undefined) {
    options ??= {};
    options.languageField = languageField;
  }
  const special = directives
    .filter(`special`)
    .map((directive) => directive.tArgs[0]);
  const validation = directives.find(`validation`);
  const filter =
    typeof validation !== `undefined` ? ctx.filters[validation.tArgs[0]] : null;
  if (filter !== null && typeof filter === `undefined`) {
    throw new Error(
      `[${prismaModel.name}.${prismaField.name}] Filter "${validation?.tArgs[0]}" not found`,
    );
  }
  const translations = directives.filter(`translation`).map((directive) => ({
    language: directive.tArgs[0],
    translation: directive.tArgs[1],
  }));
  const { directusType } = types;

  const snapshotField: SnapshotField = {
    collection: prismaModel.dbName ?? prismaModel.name,
    field: prismaField.dbName ?? prismaField.name,
    meta: {
      collection: prismaModel.dbName ?? prismaModel.name,
      conditions: fieldConditions.length > 0 ? fieldConditions : null,
      display: directives.find(`display`)?.tArgs[0] ?? null,
      display_options: displayOptions,
      field: prismaField.dbName ?? prismaField.name,
      group: directives.find(`group`)?.tArgs[0] ?? null,
      hidden: directives.find(`hidden`) !== undefined,
      interface: directives.find(`interface`)?.tArgs[0] ?? null,
      note: directives.find(`note`)?.tArgs[0] ?? null,
      options,
      readonly: directives.find(`readonly`) !== undefined,
      required:
        directives.find(`required`) !== undefined ||
        (!prismaField.isList && (prismaField.isRequired || prismaField.isId)),
      sort: directives.find(`sort`)?.tArgs[0] ?? null,
      special: special.length > 0 ? special : null,
      translations: translations.length > 0 ? translations : null,
      validation: filter as SnapshotFieldMeta[`validation`],
      validation_message:
        directives.find(`validationMessage`)?.tArgs[0] ?? null,
      width: directives.find(`width`)?.tArgs[0] ?? `full`,
    },
    schema: getPrismaFieldSnapshotFieldSchema(ctx, prismaField),
    type: directusType,
  };

  return snapshotField;
};

export { prismaFieldToSnapshotField };
