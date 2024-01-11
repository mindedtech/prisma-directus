import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

import generatorHelper from "@prisma/generator-helper";
import prismaInternals from "@prisma/internals";
import { dump } from "js-yaml";
import { z } from "zod";

import { dmmfToSnapshot } from "@/generator/lib/Snapshot";

const GeneratorConfig = z.object({
  directus: z.string(),
  version: z.coerce.number(),
});
type GeneratorConfig = z.infer<typeof GeneratorConfig>;

const { generatorHandler } = generatorHelper;
const { parseEnvValue } = prismaInternals;

const generate = () =>
  generatorHandler({
    onGenerate: async ({ dmmf, generator: { config, output } }) => {
      const { directus, version } = GeneratorConfig.parse(config);
      const snapshot = dmmfToSnapshot(directus, version, dmmf);
      if (!output) {
        throw new Error(`No output directory specified`);
      }
      const outputPath = parseEnvValue(output);

      const outputDir = dirname(outputPath);

      await mkdir(outputDir, { recursive: true });
      await writeFile(outputPath, dump(snapshot));
    },
    onManifest: () => ({
      defaultOutput: `./directus-snapshot.yml`,
      prettyName: `@prisma-diretus/generator`,
    }),
  });

export { generate };
