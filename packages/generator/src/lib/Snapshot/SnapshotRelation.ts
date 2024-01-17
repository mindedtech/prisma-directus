import type {
  PrismaField,
  SnapshotContext,
  SnapshotRelation,
} from "@/generator/lib/Snapshot/SnapshotTypes";
import type { ForeignKey } from "@directus/schema";

const prismaFieldToSnaphotRelation = (
  ctx: SnapshotContext,
  localPrismaField: PrismaField,
): undefined | SnapshotRelation => {
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
  const remotePrismaModel = ctx.getPrismaModelOfPrismaField(
    remotePrismaListRelation,
  );
  const remotePrismaField = ctx.getRemotePrismaFieldOfLocalPrismaItemRelation(
    localPrismaItemRelation,
  );
  const localPrismaItemRelationDirectives = ctx.getDirectivesOfPrismaField(
    localPrismaItemRelation,
  );
  const contraintName =
    localPrismaItemRelationDirectives.find(`constraint`)?.tArgs[0];
  if (typeof contraintName !== `string`) {
    throw new Error(
      `[field=${localPrismaItemRelation.name}] Missing constraintName`,
    );
  }
  const onDelete: ForeignKey[`on_delete`] =
    localPrismaItemRelationDirectives.find(`onDelete`)?.tArgs[0] ??
    (localPrismaItemRelation.relationOnDelete === `Cascade`
      ? `CASCADE`
      : localPrismaItemRelation.relationOnDelete === `SetNull`
        ? `SET NULL`
        : localPrismaItemRelation.relationOnDelete === `NoAction`
          ? `NO ACTION`
          : localPrismaItemRelation.relationOnDelete === `Restrict`
            ? `RESTRICT`
            : localPrismaItemRelation.relationOnDelete === `SetDefault`
              ? `SET DEFAULT`
              : null);
  const onDeselect: SnapshotRelation[`meta`][`one_deselect_action`] =
    localPrismaItemRelationDirectives.find(`onDeselect`)?.tArgs[0] ??
    (onDelete === `CASCADE` ? `delete` : `nullify`);
  const onUpdate: ForeignKey[`on_update`] =
    localPrismaItemRelationDirectives.find(`onUpdate`)?.tArgs[0] ?? onDelete;
  const snapshotRelation: SnapshotRelation = {
    collection: localPrismaModel.dbName ?? localPrismaModel.name,
    field: localPrismaField.dbName ?? localPrismaField.name,
    meta: {
      junction_field:
        localPrismaItemRelationDirectives.find(`junctionField`)?.tArgs[0] ??
        null,
      many_collection: localPrismaModel.dbName ?? localPrismaModel.name,
      many_field: localPrismaField.dbName ?? localPrismaField.name,
      one_allowed_collections: null,
      one_collection: remotePrismaModel.dbName ?? remotePrismaModel.name,
      one_collection_field: null,
      one_deselect_action: onDeselect,
      one_field:
        remotePrismaListRelation.dbName ?? remotePrismaListRelation.name,
      sort_field:
        localPrismaItemRelationDirectives.find(`sortField`)?.tArgs[0] ?? null,
    },
    related_collection: remotePrismaModel.dbName ?? remotePrismaModel.name,
    schema: {
      column: localPrismaField.dbName ?? localPrismaField.name,
      constraint_name: contraintName,
      foreign_key_column: remotePrismaField.dbName ?? remotePrismaField.name,
      foreign_key_table: remotePrismaModel.dbName ?? remotePrismaModel.name,
      on_delete: onDelete,
      on_update: onUpdate,
      table: localPrismaModel.dbName ?? localPrismaModel.name,
    },
  };

  return snapshotRelation;
};

export { prismaFieldToSnaphotRelation };
