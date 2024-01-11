import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";

import generatorHelper from "@prisma/generator-helper";
import prismaInternals from "@prisma/internals";
import { dump, load } from "js-yaml";
import { z } from "zod";

import {
  Config,
  createDefaultConfig,
  mergeConfig,
} from "@/generator/lib/Config";
import { dmmfToSnapshot } from "@/generator/lib/Snapshot";

const GeneratorConfig = z.object({
  configFile: z.string().optional(),
  directus: z.string(),
  version: z.coerce.number(),
});
type GeneratorConfig = z.infer<typeof GeneratorConfig>;

const { generatorHandler } = generatorHelper;
const { parseEnvValue } = prismaInternals;

const parseConfigFile = async (configFile?: string): Promise<Config> => {
  const defaultConfig = createDefaultConfig();
  if (typeof configFile === `undefined`) {
    return defaultConfig;
  }
  const configString = await readFile(configFile, `utf-8`);
  const configObj: unknown =
    configFile.endsWith(`.yml`) || configFile.endsWith(`.yaml`)
      ? load(configString)
      : JSON.parse(configString);
  const config = Config.parse(configObj);
  return mergeConfig(defaultConfig, config);
};

const generate = () =>
  generatorHandler({
    onGenerate: async ({ dmmf, generator }) => {
      if (!generator.output) {
        throw new Error(`No output directory specified`);
      }
      const { configFile, directus, version } = GeneratorConfig.parse(
        generator.config,
      );

      const config = await parseConfigFile(configFile);

      const snapshot = dmmfToSnapshot(directus, version, config, dmmf);

      const outputPath = parseEnvValue(generator.output);
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
