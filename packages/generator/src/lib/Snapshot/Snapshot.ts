import { createBaseSnapshot } from "@/generator/lib/Snapshot/createBaseSnapshot";
import { prismaModelToSnapshotCollection } from "@/generator/lib/Snapshot/SnapshotCollection";
import { createSnapshotContext } from "@/generator/lib/Snapshot/SnapshotContext";
import { prismaFieldToSnapshotField } from "@/generator/lib/Snapshot/SnapshotField";
import { prismaFieldToSnaphotRelation } from "@/generator/lib/Snapshot/SnapshotRelation";

import type { Condition } from "@/generator/lib/Condition";
import type { Filter } from "@/generator/lib/Filter";
import type { PrismaDatamodel } from "@/generator/lib/Snapshot/SnapshotTypes";

type CreateSnapshotOptions = {
  readonly conditions: Record<string, Condition>;
  readonly datamodel: PrismaDatamodel;
  readonly directivePrefix: string;
  readonly directus: string;
  readonly filters: Record<string, Filter>;
  readonly version: number;
};

const createSnapshot = ({
  conditions,
  datamodel,
  directivePrefix,
  directus,
  filters,
  version,
}: CreateSnapshotOptions) => {
  const snapshot = createBaseSnapshot(directus, version);
  const ctx = createSnapshotContext(
    datamodel,
    conditions,
    filters,
    directivePrefix,
    snapshot,
  );

  for (const prismaModel of datamodel.models) {
    const snapshotCollection = prismaModelToSnapshotCollection(
      ctx,
      prismaModel,
    );
    snapshot.collections.push(snapshotCollection);
    for (const prismaField of prismaModel.fields) {
      const snapshotField = prismaFieldToSnapshotField(ctx, prismaField);
      snapshot.fields.push(snapshotField);
      const snapshotRelation = prismaFieldToSnaphotRelation(ctx, prismaField);
      if (snapshotRelation) {
        snapshot.relations.push(snapshotRelation);
      }
    }
  }

  return snapshot;
};

export { createSnapshot };
