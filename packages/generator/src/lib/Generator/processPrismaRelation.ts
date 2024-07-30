import type { ForeignKey } from "@directus/schema";
import type { GeneratorContext } from "prisma-directus-generator/lib/Generator/GeneratorContext";
import type { PrismaField } from "prisma-directus-generator/lib/Generator/Prisma";
import type { SnapshotRelation } from "prisma-directus-generator/lib/Generator/Snapshot";

const processPrismaRelation = (
  ctx: GeneratorContext,
  localPrismaField: PrismaField,
): void => {
  ctx.trace(
    `[${localPrismaField.name}.${localPrismaField.name}] processPrismaRelation`,
  );
  const localPrismaModel = ctx.getPrismaModelOfPrismaField(localPrismaField);
  const localPrismaItemRelation =
    ctx.getLocalPrismaItemRelationOfLocalPrismaField(localPrismaField);
  if (!localPrismaItemRelation) {
    return undefined;
  }
  const remotePrismaListRelation =
    ctx.getRemotePrismaListRelationOfLocalPrismaItemRelation(
      localPrismaItemRelation,
    );
  const remoteFieldName = ctx.transformListFieldName(
    remotePrismaListRelation.dbName ?? remotePrismaListRelation.name,
  );
  const remotePrismaModel = ctx.getPrismaModelOfPrismaField(
    remotePrismaListRelation,
  );
  const remotePrismaField = ctx.getRemotePrismaFieldOfLocalPrismaItemRelation(
    localPrismaItemRelation,
  );
  const localPrismaItemRelationDirectives = ctx.getDirectivesOfPrismaField(
    localPrismaItemRelation,
  );
  const constraintName =
    localPrismaItemRelationDirectives.find(`constraint`)?.tArgs[0];
  if (typeof constraintName !== `string`) {
    throw new Error(
      `[${localPrismaModel.name}.${localPrismaItemRelation.name}] Missing constraint`,
    );
  }
  const onDelete: ForeignKey[`on_delete`] =
    localPrismaItemRelation.relationOnDelete === `Cascade`
      ? `CASCADE`
      : localPrismaItemRelation.relationOnDelete === `SetNull`
        ? `SET NULL`
        : localPrismaItemRelation.relationOnDelete === `NoAction`
          ? `NO ACTION`
          : localPrismaItemRelation.relationOnDelete === `Restrict`
            ? `RESTRICT`
            : localPrismaItemRelation.relationOnDelete === `SetDefault`
              ? `SET DEFAULT`
              : null;
  const onDeselect: SnapshotRelation[`meta`][`one_deselect_action`] =
    localPrismaItemRelationDirectives.find(`onDeselect`)?.tArgs[0] ??
    (onDelete === `CASCADE` ? `delete` : `nullify`);
  const snapshotRelation: SnapshotRelation = {
    collection: localPrismaModel.dbName ?? localPrismaModel.name,
    field: localPrismaField.dbName ?? localPrismaField.name,
    meta: {
      junction_field:
        localPrismaItemRelationDirectives.find(`join`)?.tArgs[0] ?? null,
      many_collection: localPrismaModel.dbName ?? localPrismaModel.name,
      many_field: localPrismaField.dbName ?? localPrismaField.name,
      one_allowed_collections: null,
      one_collection: remotePrismaModel.dbName ?? remotePrismaModel.name,
      one_collection_field: null,
      one_deselect_action: onDeselect,
      one_field: remoteFieldName,
      sort_field:
        localPrismaItemRelationDirectives.find(`sortField`)?.tArgs[0] ?? null,
    },
    related_collection: remotePrismaModel.dbName ?? remotePrismaModel.name,
    schema: {
      column: localPrismaField.dbName ?? localPrismaField.name,
      constraint_name: constraintName,
      foreign_key_column: remotePrismaField.dbName ?? remotePrismaField.name,
      foreign_key_table: remotePrismaModel.dbName ?? remotePrismaModel.name,
      on_delete: onDelete,
      on_update: `NO ACTION`,
      table: localPrismaModel.dbName ?? localPrismaModel.name,
    },
  };

  ctx.snapshot.relations.push(snapshotRelation);
};

export { processPrismaRelation };
