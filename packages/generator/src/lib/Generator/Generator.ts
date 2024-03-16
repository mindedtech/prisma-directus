import { createGeneratorContext } from "@/generator/lib/Generator/GeneratorContext";
import { processPrismaField } from "@/generator/lib/Generator/processPrismaField";
import { processPrismaModel } from "@/generator/lib/Generator/processPrismaModel";
import { processPrismaRelation } from "@/generator/lib/Generator/processPrismaRelation";

import type { GeneratorConfig } from "@/generator/lib/Generator/GeneratorConfig";
import type { Permission } from "@/generator/lib/Generator/Permission";
import type { PrismaDatamodel } from "@/generator/lib/Generator/Prisma";
import type { Snapshot } from "@/generator/lib/Generator/Snapshot";

type GeneratorInput = {
  readonly config: GeneratorConfig;
  readonly datamodel: PrismaDatamodel;
};

type GeneratorOutput = {
  readonly snapshot: Snapshot;
  readonly permissions: Permission[];
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
      permissions: ctx.permissions,
      snapshot: ctx.snapshot,
    };
  } catch (error) {
    return {
      error,
      isError: true,
      permissions: ctx.permissions,
      snapshot: ctx.snapshot,
    };
  }
};

export { generate };
