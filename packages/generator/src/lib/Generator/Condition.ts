import { Condition } from "@directus/types";
import { z } from "zod";

import type { ZodType } from "zod";

const Condition: ZodType<Condition> = z.object({
  hidden: z.boolean().optional(),
  name: z.string(),
  options: z.record(z.any()).optional(),
  readonly: z.boolean().optional(),
  required: z.boolean().optional(),
  rule: z.record(z.any()),
});

const ConditionDictionary = z.record(Condition);
type ConditionDictionary = z.infer<typeof ConditionDictionary>;

const createDefaultConditionDictionary = (): ConditionDictionary => ({});

export { Condition, ConditionDictionary, createDefaultConditionDictionary };
