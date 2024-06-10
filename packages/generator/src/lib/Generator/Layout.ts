import { z } from "zod";

const LayoutKind = z.enum([`tabular`]);
type LayoutKind = z.infer<typeof LayoutKind>;

const Layout = z
  .object({
    collection: z.string(),
    fields: z.array(z.string()),
    kind: LayoutKind,
    limit: z.number().int().positive().optional(),
    sort: z.string().optional(),
  })
  .strict();
type Layout = z.infer<typeof Layout>;

export { Layout, LayoutKind };
