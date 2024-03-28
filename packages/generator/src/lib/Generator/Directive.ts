import { z } from "zod";

import { FieldType } from "@/generator/lib/Generator/FieldType";
import { PermissionAction } from "@/generator/lib/Generator/Permission";

const RawDirective = z.object({
  directive: z.string(),
  kwArgs: z.record(z.unknown()),
  tArgs: z.array(z.unknown()),
});

type RawDirective = z.infer<typeof RawDirective>;

const ModelDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    directive: z.literal(`accountability`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.enum([`all`, `activity`, `null`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveAppFilter`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`archive`),
    kwArgs: z
      .object({
        archive: z.string(),
        field: z.string(),
        filter: z.coerce.boolean().default(false),
        unarchive: z.string(),
      })
      .strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveValue`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`collapse`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.enum([`open`, `closed`, `locked`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`collectionTranslation`),
    kwArgs: z.object({}).strict(),
    tArgs: z.union([
      z.tuple([z.string(), z.string()]),
      z.tuple([z.string(), z.string(), z.string(), z.string()]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`color`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`group`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`hidden`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`icon`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`ignore`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`itemDuplicationField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`note`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`permission`),
    kwArgs: z.object({
      filter: z.string().optional(),
    }),
    tArgs: z.tuple([z.string(), PermissionAction, z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`previewUrl`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sortField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sort`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int()]),
  }),
  RawDirective.extend({
    directive: z.literal(`singleton`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`template`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`unarchiveValue`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`versioning`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
]);
type AnyModelDirective = z.infer<typeof ModelDirective>;
type ModelDirective<
  K extends AnyModelDirective[`directive`] = AnyModelDirective[`directive`],
> = Extract<AnyModelDirective, { directive: K }>;

const FieldDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    directive: z.literal(`allowDuplicates`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`boolean`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`castBoolean`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`createdAt`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`choice`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`choices`),
    kwArgs: z.record(z.string()),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`condition`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`comment`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`constraint`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`customSyntax`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`default`),
    kwArgs: z.object({}).strict(),
    tArgs: z.union([
      z.tuple([z.literal(`string`), z.string()]),
      z.tuple([z.literal(`number`), z.coerce.number()]),
      z.tuple([z.literal(`boolean`), z.coerce.boolean()]),
      z.tuple([z.literal(`null`)]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`datetime`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`display`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([
      z.enum([
        `boolean`,
        `datetime`,
        `image`,
        `formatted-value`,
        `raw`,
        `related-values`,
        `translations`,
      ]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`displayOption`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`fieldTranslation`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`filter`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`file`),
    kwArgs: z
      .object({
        folder: z.string().nullable().default(null),
      })
      .strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`group`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`hidden`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`image`),
    kwArgs: z
      .object({
        folder: z.string().nullable().default(null),
      })
      .strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`interface`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([
      z.enum([
        `boolean`,
        `datetime`,
        `input-rich-text-md`,
        `input`,
        `list-m2m`,
        `list-o2m`,
        `file-image`,
        `select-dropdown-m2o`,
        `select-dropdown`,
        `translations`,
      ]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`join`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`languageDirectionField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`languageField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`limit`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`link`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`m2m`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`m2o`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`maxLength`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`note`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`o2m`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`onDeselect`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.enum([`nullify`, `delete`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`precision`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`richText`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`readonly`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`required`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`scale`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`sort`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.coerce.number().int()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sortField`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`template`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`translations`),
    kwArgs: z.object({}).strict(),
    tArgs: z.union([z.tuple([z.string()]), z.tuple([z.string(), z.string()])]),
  }),
  RawDirective.extend({
    directive: z.literal(`type`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([FieldType]),
  }),
  RawDirective.extend({
    directive: z.literal(`updatedAt`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`uuid`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`validation`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.enum([`anyOf`, `allOf`])]).rest(z.string()),
  }),
  RawDirective.extend({
    directive: z.literal(`validationMessage`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`width`),
    kwArgs: z.object({}).strict(),
    tArgs: z.tuple([
      z.enum([`half`, `half-left`, `half-right`, `full`, `fill`]),
    ]),
  }),
]);
type AnyFieldDirective = z.infer<typeof FieldDirective>;
type FieldDirective<
  K extends AnyFieldDirective[`directive`] = AnyFieldDirective[`directive`],
> = Extract<AnyFieldDirective, { directive: K }>;

const parseRawDirectives = (
  directivePrefix: string,
  documentation?: undefined | string,
): RawDirective[] => {
  if (typeof documentation !== `string`) {
    return [];
  }
  const directives: RawDirective[] = [];
  const directivePatternSource = `${directivePrefix}(?<directiveName>[\\w\\.]+)(\\((?<argsString>[^)]+)\\))?`;
  const directivePattern = new RegExp(directivePatternSource, `g`);

  let match;
  while ((match = directivePattern.exec(documentation)) !== null) {
    if (!match.groups) {
      continue;
    }
    const { argsString, directiveName } = match.groups;

    if (typeof directiveName !== `string`) {
      continue;
    }
    const directive: RawDirective = {
      directive: directiveName,
      kwArgs: Object.create(null) as RawDirective[`kwArgs`],
      tArgs: [],
    };

    if (typeof argsString === `string`) {
      const argsList = argsString.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by commas outside of quotes
      for (const arg of argsList) {
        // Trim and check if it's a key-value pair
        const trimmedArg = arg.trim();
        if (trimmedArg.includes(`:`)) {
          const [key, value] = trimmedArg.split(/:\s*/);
          if (typeof key !== `string` || typeof value !== `string`) {
            continue;
          }
          directive.kwArgs[key] = value.replace(/"/g, ``); // Remove quotes
        } else {
          directive.tArgs.push(trimmedArg.replace(/"/g, ``)); // Remove quotes
        }
      }
    }

    directives.push(directive);
  }

  return directives;
};

type ModelDirectives = {
  readonly find: <K extends AnyModelDirective[`directive`]>(
    directive: K,
  ) => ModelDirective<K> | undefined;
  readonly filter: <K extends AnyModelDirective[`directive`]>(
    directive: K,
  ) => ModelDirective<K>[];
  readonly directives: AnyModelDirective[];
};
const parseModelDirectives = (
  directivePrefix: string,
  modelName: string,
  documentation?: undefined | string,
): ModelDirectives => {
  const directives = parseRawDirectives(directivePrefix, documentation).map(
    (directive) => {
      try {
        return ModelDirective.parse(directive);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.addIssue({
            code: z.ZodIssueCode.custom,
            message: `[${modelName}] Directive "${JSON.stringify(directive)}" is not valid`,
            path: [modelName, `directive`],
          });
        }
        throw error;
      }
    },
  );
  return {
    directives,
    filter: <K extends AnyModelDirective[`directive`]>(directive: K) =>
      directives.filter(
        (d): d is ModelDirective<K> => d.directive === directive,
      ),
    find: <K extends AnyModelDirective[`directive`]>(directive: K) =>
      directives.find((d): d is ModelDirective<K> => d.directive === directive),
  };
};

type FieldDirectives = {
  readonly find: <K extends AnyFieldDirective[`directive`]>(
    directive: K,
  ) => FieldDirective<K> | undefined;
  readonly filter: <K extends AnyFieldDirective[`directive`]>(
    directive: K,
  ) => FieldDirective<K>[];
  readonly directives: readonly AnyFieldDirective[];
};
const parseFieldDirectives = (
  directivePrefix: string,
  modelName: string,
  fieldName: string,
  documentation?: undefined | string,
): FieldDirectives => {
  const directives = parseRawDirectives(directivePrefix, documentation).map(
    (directive) => {
      try {
        return FieldDirective.parse(directive);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.addIssue({
            code: z.ZodIssueCode.custom,
            message: `[${modelName}.${fieldName}] Directive "${JSON.stringify(directive)}" is not valid`,
            path: [modelName, fieldName, `directive`],
          });
        }
        throw error;
      }
    },
  );
  return {
    directives,
    filter: <K extends AnyFieldDirective[`directive`]>(directive: K) =>
      directives.filter(
        (d): d is FieldDirective<K> => d.directive === directive,
      ),
    find: <K extends AnyFieldDirective[`directive`]>(directive: K) =>
      directives.find((d): d is FieldDirective<K> => d.directive === directive),
  };
};

export { parseFieldDirectives, parseModelDirectives };

export type { FieldDirectives, ModelDirectives };
