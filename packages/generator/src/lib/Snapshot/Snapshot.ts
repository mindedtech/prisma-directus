import { createBaseSnapshot } from "@/generator/lib/Snapshot/createBaseSnapshot";
import { prismaModelToSnapshotCollection } from "@/generator/lib/Snapshot/SnapshotCollection";
import { createSnapshotContext } from "@/generator/lib/Snapshot/SnapshotContext";
import { prismaFieldToSnapshotField } from "@/generator/lib/Snapshot/SnapshotField";
import { prismaFieldToSnaphotRelation } from "@/generator/lib/Snapshot/SnapshotRelation";

import type { Condition } from "@/generator/lib/Condition";
import type { Filter } from "@/generator/lib/Filter";
import type {
  PrismaDatamodel,
  Snapshot,
} from "@/generator/lib/Snapshot/SnapshotTypes";

type CreateSnapshotOptions = {
  readonly autoSortFields: boolean;
  readonly conditions: Record<string, Condition>;
  readonly datamodel: PrismaDatamodel;
  readonly directivePrefix: string;
  readonly directus: string;
  readonly filters: Record<string, Filter>;
  readonly version: number;
};

const createSnapshot = ({
  autoSortFields,
  conditions,
  datamodel,
  directivePrefix,
  directus,
  filters,
  version,
}: CreateSnapshotOptions): {
  readonly snapshot: Snapshot;
  readonly isError: boolean;
  readonly error: unknown;
} => {
  const snapshot = createBaseSnapshot(directus, version);
  try {
    const ctx = createSnapshotContext(
      datamodel,
      autoSortFields,
      conditions,
      filters,
      directivePrefix,
      snapshot,
    );

    for (const prismaModel of datamodel.models) {
      const modelDirectives = ctx.getDirectivesOfPrismaModel(prismaModel);
      if (typeof modelDirectives.find(`ignore`) !== `undefined`) {
        continue;
      }
      const snapshotCollection = prismaModelToSnapshotCollection(
        ctx,
        prismaModel,
      );
      snapshot.collections.push(snapshotCollection);
      let k = 0;
      for (const prismaField of prismaModel.fields) {
        const snapshotField = prismaFieldToSnapshotField(ctx, prismaField);
        if (snapshotField) {
          if (
            snapshotField.meta &&
            (autoSortFields ||
              modelDirectives.find(`autoSortFields`) !== undefined)
          ) {
            snapshotField.meta.sort = k;
          }
          snapshot.fields.push(snapshotField);
        }
        const snapshotRelation = prismaFieldToSnaphotRelation(ctx, prismaField);
        if (snapshotRelation) {
          snapshot.relations.push(snapshotRelation);
        }
        k++;
      }
    }

    return {
      error: null,
      isError: false,
      snapshot,
    };
  } catch (error) {
    return {
      error,
      isError: true,
      snapshot,
    };
  }
};

export { createSnapshot };
