import { writeFileSync } from "fs";
import { join } from "path";

import * as changeCase from "change-case";

import {
  parseFieldDirectives,
  parseModelDirectives,
} from "prisma-directus-generator/lib/Generator/Directive";
import { getPrismaMigrationsSnapshot } from "prisma-directus-generator/lib/Generator/Prisma";

import type {
  FieldDirectives,
  ModelDirectives,
} from "prisma-directus-generator/lib/Generator/Directive";
import type { GeneratorConfig } from "prisma-directus-generator/lib/Generator/GeneratorConfig";
import type { Layout } from "prisma-directus-generator/lib/Generator/Layout";
import type { Permission } from "prisma-directus-generator/lib/Generator/Permission";
import type {
  PrismaDatamodel,
  PrismaField,
  PrismaModel,
} from "prisma-directus-generator/lib/Generator/Prisma";
import type { Snapshot } from "prisma-directus-generator/lib/Generator/Snapshot";

type GeneratorContext = {
  readonly config: GeneratorConfig;
  readonly datamodel: PrismaDatamodel;
  readonly snapshot: Snapshot;
  readonly permissions: Permission[];
  readonly layouts: Layout[];

  readonly trace: (arg: string) => void;

  readonly getDirectivesOfPrismaModel: (
    prismaModel: PrismaModel,
  ) => ModelDirectives;
  readonly getDirectivesOfPrismaField: (
    prismaField: PrismaField,
  ) => FieldDirectives;

  readonly getPrismaModelOfPrismaField: (
    prismaField: PrismaField,
  ) => PrismaModel;

  readonly getLocalPrismaFieldOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getLocalPrismaItemRelationOfLocalPrismaField: (
    prismaField: PrismaField,
  ) => undefined | PrismaField;

  readonly getRemotePrismaItemRelationOfLocalPrismaListRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getRemotePrismaListRelationOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;
  readonly getRemotePrismaFieldOfLocalPrismaItemRelation: (
    prismaField: PrismaField,
  ) => PrismaField;

  readonly transformListFieldName: (name: string) => string;
};

const createGeneratorContext = (
  config: GeneratorConfig,
  datamodel: PrismaDatamodel,
): GeneratorContext => {
  const { directivePrefix } = config;

  const traceFilePath =
    typeof config.traceFile === `string`
      ? join(process.cwd(), config.traceFile)
      : null;

  if (typeof traceFilePath === `string`) {
    writeFileSync(traceFilePath, `createGeneratorContext`, { flag: `w+` });
  }

  const trace = (arg: string): void => {
    if (typeof traceFilePath === `string`) {
      writeFileSync(traceFilePath, `${arg}\n`, { flag: `a` });
    }
  };

  const snapshot: Snapshot = {
    collections: [],
    directus: config.directus,
    fields: [],
    relations: [],
    vendor: `postgres`,
    version: config.version,
  };

  if (config.includePrismaMigrations) {
    const { collections, fields } = getPrismaMigrationsSnapshot();
    snapshot.collections.push(...collections);
    snapshot.fields.push(...fields);
  }

  const permissions: Permission[] = [];
  const layouts: Layout[] = [];

  const directivesOfPrismaModelMap: Map<PrismaModel, ModelDirectives> =
    new Map();
  const directivesOfPrismaFieldMap: Map<PrismaField, FieldDirectives> =
    new Map();

  const prismaModelOfPrismaFieldMap: Map<PrismaField, PrismaModel> = new Map();

  const localPrismaFieldOfLocalPrismaItemRelationMap: Map<
    PrismaField,
    PrismaField
  > = new Map();
  const localPrismaItemRelationOfLocalPrismaFieldMap: Map<
    PrismaField,
    PrismaField
  > = new Map();

  const remotePrismaItemRelationOfLocalPrismaListRelationMap: Map<
    PrismaField,
    PrismaField
  > = new Map();
  const remotePrismaListRelationOfLocalPrismaItemRelationMap: Map<
    PrismaField,
    PrismaField
  > = new Map();
  const remotePrismaFieldOfLocalPrismaItemRelationMap: Map<
    PrismaField,
    PrismaField
  > = new Map();

  for (const localPrismaModel of datamodel.models) {
    trace(`[${localPrismaModel.name}] parseModelDirectives`);
    const prismaModelDirectives = parseModelDirectives(
      directivePrefix,
      localPrismaModel.name,
      localPrismaModel.documentation,
    );
    directivesOfPrismaModelMap.set(localPrismaModel, prismaModelDirectives);
    if (prismaModelDirectives.find(`ignore`)) {
      continue;
    }
    for (const localPrismaField of localPrismaModel.fields) {
      prismaModelOfPrismaFieldMap.set(localPrismaField, localPrismaModel);
      trace(
        `[${localPrismaModel.name}.${localPrismaField.name}] parseFieldDirectives`,
      );
      const prismaFieldDirectives = parseFieldDirectives(
        directivePrefix,
        localPrismaModel.name,
        localPrismaField.name,
        localPrismaField.documentation,
      );
      directivesOfPrismaFieldMap.set(localPrismaField, prismaFieldDirectives);
      if (localPrismaField.kind === `object`) {
        if (typeof localPrismaField.relationName !== `string`) {
          throw new Error(
            `[${localPrismaModel.name}.${localPrismaField.name}] Missing relationName`,
          );
        }
        const localItemRelation = localPrismaField;
        if (!localItemRelation.isList) {
          const [localPrismaFromFieldName, ...restLocalPrismaFromFieldName] =
            localItemRelation.relationFromFields ?? [];
          if (typeof localPrismaFromFieldName !== `string`) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing relationFromFieldName`,
            );
          }
          if (restLocalPrismaFromFieldName.length > 0) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Composite relationFromFields are not supported`,
            );
          }
          const localPrismaFromField = localPrismaModel.fields.find(
            (prismaField) => prismaField.name === localPrismaFromFieldName,
          );
          if (!localPrismaFromField) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing localPrismaFromField "${localPrismaFromFieldName}"`,
            );
          }
          localPrismaItemRelationOfLocalPrismaFieldMap.set(
            localPrismaFromField,
            localItemRelation,
          );
          localPrismaFieldOfLocalPrismaItemRelationMap.set(
            localItemRelation,
            localPrismaFromField,
          );
          const remotePrismaModel = datamodel.models.find(
            (prismaModel) => prismaModel.name === localItemRelation.type,
          );
          if (!remotePrismaModel) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing remotePrismaModel "${localItemRelation.type}"`,
            );
          }
          const remotePrismaListRelation = remotePrismaModel.fields.find(
            (remotePrismaListRelation) =>
              remotePrismaListRelation.relationName ===
                localItemRelation.relationName &&
              remotePrismaListRelation.isList,
          );
          if (!remotePrismaListRelation) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing remotePrismaListRelation`,
            );
          }
          remotePrismaListRelationOfLocalPrismaItemRelationMap.set(
            localItemRelation,
            remotePrismaListRelation,
          );
          remotePrismaItemRelationOfLocalPrismaListRelationMap.set(
            remotePrismaListRelation,
            localItemRelation,
          );
          const [remotePrismaToFieldName, ...restRemotePrismaToFieldName] =
            localItemRelation.relationToFields ?? [];
          if (typeof remotePrismaToFieldName !== `string`) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing relationToFieldName`,
            );
          }
          if (restRemotePrismaToFieldName.length > 0) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Composite relationToFields are not supported`,
            );
          }
          const remotePrismaToField = remotePrismaModel.fields.find(
            (prismaField) => prismaField.name === remotePrismaToFieldName,
          );
          if (!remotePrismaToField) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing remotePrismaToField "${remotePrismaToFieldName}"`,
            );
          }
          remotePrismaFieldOfLocalPrismaItemRelationMap.set(
            localItemRelation,
            remotePrismaToField,
          );
        }
      }
    }
  }
  const getDirectivesOfPrismaModel: GeneratorContext[`getDirectivesOfPrismaModel`] =
    (prismaModel) => {
      const directives = directivesOfPrismaModelMap.get(prismaModel);
      if (!directives) {
        throw new Error(`[${prismaModel.name}] Missing model directives`);
      }
      return directives;
    };
  const getDirectivesOfPrismaField: GeneratorContext[`getDirectivesOfPrismaField`] =
    (prismaField) => {
      const directives = directivesOfPrismaFieldMap.get(prismaField);
      if (!directives) {
        const prismaModel = getPrismaModelOfPrismaField(prismaField);
        throw new Error(
          `[${prismaModel.name}.${prismaField.name}] Missing directives`,
        );
      }
      return directives;
    };

  const getPrismaModelOfPrismaField: GeneratorContext[`getPrismaModelOfPrismaField`] =
    (prismaField) => {
      const prismaModel = prismaModelOfPrismaFieldMap.get(prismaField);
      if (!prismaModel) {
        throw new Error(`[field=${prismaField.name}] Missing model`);
      }
      return prismaModel;
    };

  const getLocalPrismaFieldOfLocalPrismaItemRelation: GeneratorContext[`getLocalPrismaFieldOfLocalPrismaItemRelation`] =
    (localPrismaItemRelation) => {
      const localPrismaFieldOfLocalPrismaItemRelation =
        localPrismaFieldOfLocalPrismaItemRelationMap.get(
          localPrismaItemRelation,
        );
      if (!localPrismaFieldOfLocalPrismaItemRelation) {
        const localPrismaModel = getPrismaModelOfPrismaField(
          localPrismaItemRelation,
        );
        throw new Error(
          `[${localPrismaModel.name}.${localPrismaItemRelation.name}] Missing localPrismaFieldOfLocalPrismaItemRelation`,
        );
      }
      return localPrismaFieldOfLocalPrismaItemRelation;
    };
  const getLocalPrismaItemRelationOfLocalPrismaField: GeneratorContext[`getLocalPrismaItemRelationOfLocalPrismaField`] =
    (localPrismaField) => {
      const localPrismaItemRelationOfLocalPrismaField =
        localPrismaItemRelationOfLocalPrismaFieldMap.get(localPrismaField);
      return localPrismaItemRelationOfLocalPrismaField;
    };

  const getRemotePrismaItemRelationOfLocalPrismaListRelation: GeneratorContext[`getRemotePrismaItemRelationOfLocalPrismaListRelation`] =
    (localPrismaListRelation) => {
      const remotePrismaItemRelation =
        remotePrismaItemRelationOfLocalPrismaListRelationMap.get(
          localPrismaListRelation,
        );
      if (!remotePrismaItemRelation) {
        const localPrismaModel = getPrismaModelOfPrismaField(
          localPrismaListRelation,
        );
        throw new Error(
          `[${localPrismaModel.name}.${localPrismaListRelation.name}] Missing remotePrismaItemRelation`,
        );
      }
      return remotePrismaItemRelation;
    };
  const getRemotePrismaListRelationOfLocalPrismaItemRelation: GeneratorContext[`getRemotePrismaListRelationOfLocalPrismaItemRelation`] =
    (localPrismaItemRelation) => {
      const remotePrismaListRelation =
        remotePrismaListRelationOfLocalPrismaItemRelationMap.get(
          localPrismaItemRelation,
        );
      if (!remotePrismaListRelation) {
        const localPrismaModel = getPrismaModelOfPrismaField(
          localPrismaItemRelation,
        );
        throw new Error(
          `[${localPrismaModel.name}.${localPrismaItemRelation.name}] Missing remotePrismaListRelation`,
        );
      }
      return remotePrismaListRelation;
    };
  const getRemotePrismaFieldOfLocalPrismaItemRelation: GeneratorContext[`getRemotePrismaFieldOfLocalPrismaItemRelation`] =
    (localPrismaItemRelation) => {
      const remotePrismaField =
        remotePrismaFieldOfLocalPrismaItemRelationMap.get(
          localPrismaItemRelation,
        );
      if (!remotePrismaField) {
        const localPrismaModel = getPrismaModelOfPrismaField(
          localPrismaItemRelation,
        );
        throw new Error(
          `[${localPrismaModel.name}.${localPrismaItemRelation.name}] Missing remotePrismaField`,
        );
      }
      return remotePrismaField;
    };

  return {
    config,
    datamodel,
    getDirectivesOfPrismaField,
    getDirectivesOfPrismaModel,
    getLocalPrismaFieldOfLocalPrismaItemRelation,
    getLocalPrismaItemRelationOfLocalPrismaField,
    getPrismaModelOfPrismaField,
    getRemotePrismaFieldOfLocalPrismaItemRelation,
    getRemotePrismaItemRelationOfLocalPrismaListRelation,
    getRemotePrismaListRelationOfLocalPrismaItemRelation,
    layouts,
    permissions,
    snapshot,
    trace,
    transformListFieldName:
      config.transformListFieldName === `camelCase`
        ? changeCase.camelCase
        : config.transformListFieldName === `snake_case`
          ? changeCase.snakeCase
          : (name: string) => name,
  };
};

export { createGeneratorContext };

export type { GeneratorContext };
