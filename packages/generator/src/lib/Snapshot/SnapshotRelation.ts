import type {
  PrismaField,
  SnapshotContext,
  SnapshotRelation,
} from "@/generator/lib/Snapshot/SnapshotTypes";

const prismaFieldToSnaphotRelation = (
  ctx: SnapshotContext,
  prismaField: PrismaField,
): undefined | SnapshotRelation => {};

export { prismaFieldToSnaphotRelation };
