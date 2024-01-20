import { z } from "zod";

import { Condition } from "@/generator/lib/Condition";
import { FilterDictionary } from "@/generator/lib/Filter";

const Config = z
  .object({
    conditions: z.record(Condition),
    filters: FilterDictionary,
  })
  .strict();
type Config = z.infer<typeof Config>;

const createDefaultConfig = (): Config => ({
  conditions: {},
  filters: {
    slug: {
      filter: {
        _or: [
          {
            _regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`,
          },
          {
            _empty: true,
          },
          {
            _null: true,
          },
        ],
      },
      message: `Slug must be a valid slug, e.g. this-is-a-slug`,
    },
    uri: {
      filter: {
        _regex: `^(?<scheme>[a-zA-Z][a-zA-Z0-9+.-]*):\\/\\/(?<authority>[^\\/\\s?#]+)(?<path>[^\\s?#]*)(?:\\?(?<query>[^\\s#]*))?(?:#(?<fragment>[^\\s]*))?$`,
      },
      message: `Must be a valid URI (or URL), e.g. urn:isbn:0385249497`,
    },
    url: {
      filter: {
        _regex: `^(?<scheme>https?):\\/\\/(?<authority>[^\\/\\s?#]+)(?<path>[^\\s?#]*)(?:\\?(?<query>[^\\s#]*))?(?:#(?<fragment>[^\\s]*))?$`,
      },
      message: `Must be a valid URL, e.g. https://example.com`,
    },
  },
});

const mergeConfig = (left: Config, right: Config): Config => ({
  conditions: { ...left.conditions, ...right.conditions },
  filters: { ...left.filters, ...right.filters },
});

export { Config, createDefaultConfig, mergeConfig };
