import { createGeneratorContext } from "prisma-directus-generator/lib/Generator/GeneratorContext";
import { processPrismaField } from "prisma-directus-generator/lib/Generator/processPrismaField";
import { processPrismaModel } from "prisma-directus-generator/lib/Generator/processPrismaModel";
import { processPrismaRelation } from "prisma-directus-generator/lib/Generator/processPrismaRelation";

import type { GeneratorConfig } from "prisma-directus-generator/lib/Generator/GeneratorConfig";
import type { Layout } from "prisma-directus-generator/lib/Generator/Layout";
import type { Permission } from "prisma-directus-generator/lib/Generator/Permission";
import type { PrismaDatamodel } from "prisma-directus-generator/lib/Generator/Prisma";
import type { Snapshot } from "prisma-directus-generator/lib/Generator/Snapshot";

type GeneratorInput = {
  readonly config: GeneratorConfig;
  readonly datamodel: PrismaDatamodel;
};

type GeneratorOutput = {
  readonly snapshot: Snapshot;
  readonly permissions: Permission[];
  readonly layouts: Layout[];
} & (
  | {
      readonly isError: true;
      readonly error: unknown;
    }
  | {
      readonly isError: false;
    }
);

const generate = ({ config, datamodel }: GeneratorInput): GeneratorOutput => {
  const ctx = createGeneratorContext(config, datamodel);
  try {
    for (const prismaModel of datamodel.models) {
      const modelDirectives = ctx.getDirectivesOfPrismaModel(prismaModel);
      if (modelDirectives.find(`ignore`)) {
        continue;
      }
      processPrismaModel(ctx, prismaModel);
      prismaModel.fields.forEach((prismaField, order) => {
        processPrismaField(ctx, prismaField, order);
        processPrismaRelation(ctx, prismaField);
      });
    }
    return {
      isError: false,
      layouts: ctx.layouts,
      permissions: ctx.permissions,
      snapshot: ctx.snapshot,
    };
  } catch (error) {
    return {
      error,
      isError: true,
      layouts: ctx.layouts,
      permissions: ctx.permissions,
      snapshot: ctx.snapshot,
    };
  }
};

export { generate };
