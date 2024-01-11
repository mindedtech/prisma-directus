import { z } from "zod";

import { FieldType } from "@/generator/lib/FieldType";

const RawDirective = z.object({
  args: z.array(z.unknown()),
  directive: z.string(),
  kwArgs: z.record(z.unknown()),
});

type RawDirective = z.infer<typeof RawDirective>;

const CollectionDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    args: z.tuple([z.enum([`all`, `accountability`, `null`])]),
    directive: z.literal(`accountability`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`archiveAppFilter`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`archiveField`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`archiveValue`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`color`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.enum([`open`, `closed`, `locked`])]),
    directive: z.literal(`collapse`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`displayTemplate`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`hidden`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`icon`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`itemDuplicationField`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`group`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`name`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`note`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`previewUrl`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`sortField`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`singleton`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string(), z.string()]),
    directive: z.literal(`translation`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`unarchiveValue`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`versioning`),
    kwArgs: z.object({}),
  }),
]);
type AnyCollectionDirective = z.infer<typeof CollectionDirective>;
type CollectionDirective<
  K extends
    AnyCollectionDirective[`directive`] = AnyCollectionDirective[`directive`],
> = Extract<AnyCollectionDirective, { directive: K }>;

const FieldDirective = z.discriminatedUnion(`directive`, [
  RawDirective.extend({
    args: z.tuple([z.string(), z.string()]),
    directive: z.literal(`choice`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`condition`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([
      z.enum([
        `boolean`,
        `datetime`,
        `formatted-value`,
        `raw`,
        `related-values`,
        `translations`,
      ]),
    ]),
    directive: z.literal(`display`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string(), z.string()]),
    directive: z.literal(`displayOption`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`enableLink`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`group`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`hidden`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([
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
    directive: z.literal(`interface`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`languageDirectionField`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`languageField`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`name`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`note`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`readonly`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([]),
    directive: z.literal(`required`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.coerce.number().int()]),
    directive: z.literal(`sort`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([
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
    directive: z.literal(`special`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([FieldType]),
    directive: z.literal(`type`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string(), z.string()]),
    directive: z.literal(`translation`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`validation`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([z.string()]),
    directive: z.literal(`validationMessage`),
    kwArgs: z.object({}),
  }),
  RawDirective.extend({
    args: z.tuple([
      z.enum([`half`, `half-left`, `half-right`, `full`, `fill`]),
    ]),
    directive: z.literal(`width`),
    kwArgs: z.object({}),
  }),
]);
type AnyFieldDirective = z.infer<typeof FieldDirective>;
type FieldDirective<
  K extends AnyFieldDirective[`directive`] = AnyFieldDirective[`directive`],
> = Extract<AnyFieldDirective, { directive: K }>;

const parseRawDirectives = (
  documentation?: undefined | string,
): RawDirective[] => {
  if (typeof documentation !== `string`) {
    return [];
  }
  const directives: RawDirective[] = [];
  const directivePattern =
    /@(?<directiveName>[\w\.]+)(\((?<argsString>[^)]+)\))?/g;

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
      args: [],
      directive: directiveName,
      kwArgs: Object.create(null) as RawDirective[`kwArgs`],
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
          directive.args.push(trimmedArg.replace(/"/g, ``)); // Remove quotes
        }
      }
    }

    directives.push(directive);
  }

  return directives;
};

type CollectionDirectives = {
  readonly find: <K extends AnyCollectionDirective[`directive`]>(
    directive: K,
  ) => CollectionDirective<K> | undefined;
  readonly filter: <K extends AnyCollectionDirective[`directive`]>(
    directive: K,
  ) => CollectionDirective<K>[];
};
const parseCollectionDirectives = (
  documentation?: undefined | string,
): CollectionDirectives => {
  const directives = parseRawDirectives(documentation);
  return {
    filter: <K extends AnyCollectionDirective[`directive`]>(directive: K) =>
      directives.filter(
        (d): d is CollectionDirective<K> => d.directive === directive,
      ),
    find: <K extends AnyCollectionDirective[`directive`]>(directive: K) =>
      directives.find(
        (d): d is CollectionDirective<K> => d.directive === directive,
      ),
  };
};

type FieldDirectives = {
  readonly find: <K extends AnyFieldDirective[`directive`]>(
    directive: K,
  ) => FieldDirective<K> | undefined;
  readonly filter: <K extends AnyFieldDirective[`directive`]>(
    directive: K,
  ) => FieldDirective<K>[];
};
const parseFieldDirectives = (
  documentation?: undefined | string,
): FieldDirectives => {
  const directives = parseRawDirectives(documentation);
  return {
    filter: <K extends AnyFieldDirective[`directive`]>(directive: K) =>
      directives.filter(
        (d): d is FieldDirective<K> => d.directive === directive,
      ),
    find: <K extends AnyFieldDirective[`directive`]>(directive: K) =>
      directives.find((d): d is FieldDirective<K> => d.directive === directive),
  };
};

export { parseCollectionDirectives, parseFieldDirectives };
