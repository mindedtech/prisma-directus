import { z } from "zod";

import { FieldType } from "@/generator/lib/FieldType";

const RawDirective = z.object({
  directive: z.string(),
  kwArgs: z.record(z.unknown()),
  tArgs: z.array(z.unknown()),
});

type RawDirective = z.infer<typeof RawDirective>;

const ModelDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    directive: z.literal(`accountability`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.enum([`all`, `accountability`, `null`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveAppFilter`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`archiveValue`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`color`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`collapse`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.enum([`open`, `closed`, `locked`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`displayTemplate`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`hidden`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`icon`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`ignore`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`itemDuplicationField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`group`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`note`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`previewUrl`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sortField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sort`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.coerce.number().int()]),
  }),
  RawDirective.extend({
    directive: z.literal(`singleton`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`translation`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`unarchiveValue`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`versioning`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
]);
type AnyModelDirective = z.infer<typeof ModelDirective>;
type ModelDirective<
  K extends AnyModelDirective[`directive`] = AnyModelDirective[`directive`],
> = Extract<AnyModelDirective, { directive: K }>;

const FieldDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    directive: z.literal(`choice`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`condition`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`comment`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`constraintName`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`defaultValue`),
    kwArgs: z.object({}),
    tArgs: z.union([
      z.tuple([z.literal(`string`), z.string()]),
      z.tuple([z.literal(`number`), z.coerce.number()]),
      z.tuple([z.literal(`boolean`), z.coerce.boolean()]),
      z.tuple([z.literal(`null`)]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`display`),
    kwArgs: z.object({}),
    tArgs: z.tuple([
      z.enum([
        `boolean`,
        `datetime`,
        `formatted-value`,
        `raw`,
        `related-values`,
        `translations`,
      ]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`displayOption`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`enableLink`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`group`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`hidden`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`interface`),
    kwArgs: z.object({}),
    tArgs: z.tuple([
      z.enum([
        `boolean`,
        `datetime`,
        `input-rich-text-md`,
        `input`,
        `list-m2m`,
        `list-o2m`,
        `select-dropdown-m2o`,
        `select-dropdown`,
        `translations`,
      ]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`junctionField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`languageDirectionField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`languageField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`maxLength`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`numericPrecision`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`numericScale`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.coerce.number().int().min(0)]),
  }),
  RawDirective.extend({
    directive: z.literal(`note`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`onDeselect`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.enum([`nullify`, `delete`])]),
  }),
  RawDirective.extend({
    directive: z.literal(`onDelete`),
    kwArgs: z.object({}),
    tArgs: z.tuple([
      z.enum([`NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`onUpdate`),
    kwArgs: z.object({}),
    tArgs: z.tuple([
      z.enum([`NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`readonly`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`required`),
    kwArgs: z.object({}),
    tArgs: z.tuple([]),
  }),
  RawDirective.extend({
    directive: z.literal(`sort`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.coerce.number().int()]),
  }),
  RawDirective.extend({
    directive: z.literal(`sortField`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`special`),
    kwArgs: z.object({}),
    tArgs: z.tuple([
      z.enum([
        `cast-boolean`,
        `date-created`,
        `date-updated`,
        `m2m`,
        `m2o`,
        `o2m`,
        `translations`,
        `uuid`,
      ]),
    ]),
  }),
  RawDirective.extend({
    directive: z.literal(`type`),
    kwArgs: z.object({}),
    tArgs: z.tuple([FieldType]),
  }),
  RawDirective.extend({
    directive: z.literal(`translation`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string(), z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`validation`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`validationMessage`),
    kwArgs: z.object({}),
    tArgs: z.tuple([z.string()]),
  }),
  RawDirective.extend({
    directive: z.literal(`width`),
    kwArgs: z.object({}),
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
  documentation?: undefined | string,
): ModelDirectives => {
  const directives = parseRawDirectives(directivePrefix, documentation).map(
    (directive) => ModelDirective.parse(directive),
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
  documentation?: undefined | string,
): FieldDirectives => {
  const directives = parseRawDirectives(directivePrefix, documentation).map(
    (directive) => FieldDirective.parse(directive),
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
