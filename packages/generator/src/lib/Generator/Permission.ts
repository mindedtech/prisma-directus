import { z } from "zod";

import { Filter } from "@/generator/lib/Generator/Filter";

const PermissionAction = z.enum([
  `create`,
  `read`,
  `update`,
  `delete`,
  `share`,
]);

const Permission = z.object({
  action: PermissionAction,
  collection: z.string(),
  fields: z.string(),
  permissions: Filter.optional(),
  role: z.string().uuid().nullable(),
});
type Permission = z.infer<typeof Permission>;

export { Permission, PermissionAction };
