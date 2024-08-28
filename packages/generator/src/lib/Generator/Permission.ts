import { z } from "zod";

import { Filter } from "prisma-directus-generator/lib/Generator/Filter";

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
  policy: z.string().uuid().nullable(),
  validation: Filter.optional(),
});
type Permission = z.infer<typeof Permission>;

export { Permission, PermissionAction };
