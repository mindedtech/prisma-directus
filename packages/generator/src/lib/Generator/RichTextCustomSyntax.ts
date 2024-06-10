import { z } from "zod";

const RichTextCustomSyntax = z.object({
  box: z.enum([`block`, `inline`]),
  global: z.boolean().default(false),
  icon: z.string().default(`code_blocks`),
  name: z.string(),
  prefix: z.string(),
  suffix: z.string(),
});
type RichTextCustomSyntax = z.infer<typeof RichTextCustomSyntax>;

export { RichTextCustomSyntax };
