import {
  parseFieldDirectives,
  parseModelDirectives,
} from "@/generator/lib/Directive";

import type { Condition } from "@/generator/lib/Condition";
import type {
  FieldDirectives,
  ModelDirectives,
} from "@/generator/lib/Directive";
import type { Filter } from "@/generator/lib/Filter";
import type {
  PrismaDatamodel,
  PrismaField,
  PrismaModel,
  Snapshot,
  SnapshotContext,
} from "@/generator/lib/Snapshot/SnapshotTypes";

const createSnapshotContext = (
  datamodel: PrismaDatamodel,
  autoSortFields: boolean,
  conditions: Record<string, Condition>,
  filters: Record<string, Filter>,
  directivePrefix: string,
  snapshot: Snapshot,
): SnapshotContext => {
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
    const prismaModelDirectives = parseModelDirectives(
      directivePrefix,
      localPrismaModel.documentation,
    );
    directivesOfPrismaModelMap.set(localPrismaModel, prismaModelDirectives);
    if (prismaModelDirectives.find(`ignore`)) {
      continue;
    }
    for (const localPrismaField of localPrismaModel.fields) {
      prismaModelOfPrismaFieldMap.set(localPrismaField, localPrismaModel);
      const prismaFieldDirectives = parseFieldDirectives(
        directivePrefix,
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
            (prismaItemRelation) =>
              prismaItemRelation.relationName ===
              localItemRelation.relationName,
          );
          if (!remotePrismaListRelation) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] Missing remotePrismaListRelation`,
            );
          }
          if (!remotePrismaListRelation.isList) {
            throw new Error(
              `[${localPrismaModel.name}.${localPrismaField.name}] remotePrismaListRelation is not a list`,
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

  const debug: SnapshotContext[`debug`] = () => {
    console.log(`localPrismaFieldOfLocalPrismaItemRelationMap`);
    for (const [key, value] of localPrismaFieldOfLocalPrismaItemRelationMap) {
      console.log(`${key.name} => ${value.name}`);
    }
    console.log(`localPrismaItemRelationOfLocalPrismaFieldMap`);
    for (const [key, value] of localPrismaItemRelationOfLocalPrismaFieldMap) {
      console.log(`${key.name} => ${value.name}`);
    }
    console.log(`remotePrismaItemRelationOfLocalPrismaListRelationMap`);
    for (const [
      key,
      value,
    ] of remotePrismaItemRelationOfLocalPrismaListRelationMap) {
      console.log(`${key.name} => ${value.name}`);
    }
    console.log(`remotePrismaListRelationOfLocalPrismaItemRelationMap`);
    for (const [
      key,
      value,
    ] of remotePrismaListRelationOfLocalPrismaItemRelationMap) {
      console.log(`${key.name} => ${value.name}`);
    }
    console.log(`remotePrismaFieldOfLocalPrismaItemRelationMap`);
    for (const [key, value] of remotePrismaFieldOfLocalPrismaItemRelationMap) {
      console.log(`${key.name} => ${value.name}`);
    }
  };

  const getDirectivesOfPrismaModel: SnapshotContext[`getDirectivesOfPrismaModel`] =
    (prismaModel) => {
      const directives = directivesOfPrismaModelMap.get(prismaModel);
      if (!directives) {
        throw new Error(`[${prismaModel.name}] Missing model directives`);
      }
      return directives;
    };
  const getDirectivesOfPrismaField: SnapshotContext[`getDirectivesOfPrismaField`] =
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

  const getPrismaModelOfPrismaField: SnapshotContext[`getPrismaModelOfPrismaField`] =
    (prismaField) => {
      const prismaModel = prismaModelOfPrismaFieldMap.get(prismaField);
      if (!prismaModel) {
        throw new Error(`[field=${prismaField.name}] Missing model`);
      }
      return prismaModel;
    };

  const getLocalPrismaFieldOfLocalPrismaItemRelation: SnapshotContext[`getLocalPrismaFieldOfLocalPrismaItemRelation`] =
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
  const getLocalPrismaItemRelationOfLocalPrismaField: SnapshotContext[`getLocalPrismaItemRelationOfLocalPrismaField`] =
    (localPrismaField) => {
      const localPrismaItemRelationOfLocalPrismaField =
        localPrismaItemRelationOfLocalPrismaFieldMap.get(localPrismaField);
      return localPrismaItemRelationOfLocalPrismaField;
    };

  const getRemotePrismaItemRelationOfLocalPrismaListRelation: SnapshotContext[`getRemotePrismaItemRelationOfLocalPrismaListRelation`] =
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
  const getRemotePrismaListRelationOfLocalPrismaItemRelation: SnapshotContext[`getRemotePrismaListRelationOfLocalPrismaItemRelation`] =
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
  const getRemotePrismaFieldOfLocalPrismaItemRelation: SnapshotContext[`getRemotePrismaFieldOfLocalPrismaItemRelation`] =
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
    autoSort: autoSortFields,
    conditions,
    datamodel,
    debug,
    filters,
    getDirectivesOfPrismaField,
    getDirectivesOfPrismaModel,
    getLocalPrismaFieldOfLocalPrismaItemRelation,
    getLocalPrismaItemRelationOfLocalPrismaField,
    getPrismaModelOfPrismaField,
    getRemotePrismaFieldOfLocalPrismaItemRelation,
    getRemotePrismaItemRelationOfLocalPrismaListRelation,
    getRemotePrismaListRelationOfLocalPrismaItemRelation,
    snapshot,
  };
};

export { createSnapshotContext };
