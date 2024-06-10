import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";

import generatorHelper from "@prisma/generator-helper";
import { dump, load } from "js-yaml";
import { z } from "zod";

import { createDefaultConditionDictionary } from "prisma-directus-generator/lib/Generator/Condition";
import { createDefaultFilterDictionary } from "prisma-directus-generator/lib/Generator/Filter";
import { generate } from "prisma-directus-generator/lib/Generator/Generator";
import { GeneratorConfig } from "prisma-directus-generator/lib/Generator/GeneratorConfig";

const { generatorHandler } = generatorHelper;

const parseConfigFile = async (
  configFile: string,
): Promise<GeneratorConfig> => {
  const configString = await readFile(configFile, `utf-8`);
  const configObj: unknown =
    configFile.endsWith(`.yml`) || configFile.endsWith(`.yaml`)
      ? load(configString)
      : JSON.parse(configString);
  const config = GeneratorConfig.parse(configObj);

  config.filters = {
    ...createDefaultFilterDictionary(),
    ...config.filters,
  };

  config.conditions = {
    ...createDefaultConditionDictionary(),
    ...config.conditions,
  };

  config.roles = {
    public: {
      id: null,
    },
    ...config.roles,
  };

  return config;
};

const GeneratorParams = z.object({
  configFile: z.string(),
});

const runGeneratorHandler = () =>
  generatorHandler({
    onGenerate: async ({ dmmf, generator }) => {
      const { configFile } = GeneratorParams.parse(generator.config);

      const config = await parseConfigFile(configFile);

      const result = generate({ config, datamodel: dmmf.datamodel });

      if (result.isError) {
        if (typeof config.debugFile === `string`) {
          await writeFile(
            config.debugFile,
            JSON.stringify(
              { permissions: result.permissions, snapshot: result.snapshot },
              null,
              2,
            ),
            { encoding: `utf-8` },
          );
        }
        throw result.error;
      }
      const snapshotDir = dirname(config.snapshotFile);
      await mkdir(snapshotDir, { recursive: true });
      await writeFile(
        config.snapshotFile,
        `${config.banner}\n${dump(result.snapshot)}`,
      );
      const permissionsDir = dirname(config.permissionsFile);
      await mkdir(permissionsDir, { recursive: true });
      await writeFile(
        config.permissionsFile,
        `${config.banner}\n${dump(result.permissions)}`,
      );
      const layoutsDir = dirname(config.layoutsFile);
      await mkdir(layoutsDir, { recursive: true });
      await writeFile(
        config.layoutsFile,
        `${config.banner}\n${dump(result.layouts)}`,
      );
    },
    onManifest: () => ({
      defaultOutput: `./directus-snapshot.yml`,
      prettyName: `prisma-directus-generator`,
    }),
  });

export { runGeneratorHandler };
