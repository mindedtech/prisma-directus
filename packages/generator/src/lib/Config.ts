import { z } from "zod";

import { Condition } from "@/generator/lib/Condition";
import { Filter } from "@/generator/lib/Filter";

const Config = z.object({
  conditions: z.record(Condition),
  filters: z.record(Filter),
});
type Config = z.infer<typeof Config>;

const createDefaultConfig = (): Config => ({
  conditions: {},
  filters: {
    slug: {
      _or: [
        {
          _regex: `^[a-zA-Z0-9]*$`,
        },
        {
          _empty: true,
        },
        {
          _null: true,
        },
      ],
    },
    uri: {
      _regex: `^(?<scheme>[a-zA-Z][a-zA-Z0-9+.-]*):\\/\\/(?<authority>[^\\/\\s?#]+)(?<path>[^\\s?#]*)(?:\\?(?<query>[^\\s#]*))?(?:#(?<fragment>[^\\s]*))?$`,
    },
    url: {
      _regex: `^(?<scheme>https?):\\/\\/(?<authority>[^\\/\\s?#]+)(?<path>[^\\s?#]*)(?:\\?(?<query>[^\\s#]*))?(?:#(?<fragment>[^\\s]*))?$`,
    },
  },
});

const mergeConfig = (left: Config, right: Config): Config => ({
  conditions: { ...left.conditions, ...right.conditions },
  filters: { ...left.filters, ...right.filters },
});

export { Config, createDefaultConfig, mergeConfig };
