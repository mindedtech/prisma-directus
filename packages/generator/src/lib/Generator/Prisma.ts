import type { DMMF } from "@prisma/generator-helper";
import type { Snapshot } from "prisma-directus-generator/lib/Generator/Snapshot";

type PrismaDatamodel = DMMF.Datamodel;
type PrismaModel = DMMF.Model;
type PrismaField = DMMF.Field;

const getPrismaMigrationsSnapshot = (): Pick<
  Snapshot,
  `collections` | `fields`
> => ({
  collections: [
    {
      collection: `_prisma_migrations`,
      meta: {
        accountability: `all`,
        archive_app_filter: true,
        archive_field: null,
        archive_value: null,
        collapse: `open`,
        collection: `_prisma_migrations`,
        color: null,
        display_template: null,
        group: null,
        hidden: true,
        icon: null,
        item_duplication_fields: null,
        note: null,
        preview_url: null,
        singleton: false,
        sort: null,
        sort_field: null,
        translations: null,
        unarchive_value: null,
        versioning: false,
      },
      schema: {
        name: `_prisma_migrations`,
      },
    },
  ],
  fields: [
    {
      collection: `_prisma_migrations`,
      field: `applied_steps_count`,
      meta: null,
      schema: {
        data_type: `integer`,
        default_value: 0,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: false,
        is_primary_key: false,
        is_unique: false,
        max_length: null,
        name: `applied_steps_count`,
        numeric_precision: 32,
        numeric_scale: 0,
        table: `_prisma_migrations`,
      },
      type: `integer`,
    },
    {
      collection: `_prisma_migrations`,
      field: `checksum`,
      meta: null,
      schema: {
        data_type: `character varying`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: false,
        is_primary_key: false,
        is_unique: false,
        max_length: 64,
        name: `checksum`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `string`,
    },
    {
      collection: `_prisma_migrations`,
      field: `finished_at`,
      meta: null,
      schema: {
        data_type: `timestamp with time zone`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: true,
        is_primary_key: false,
        is_unique: false,
        max_length: null,
        name: `finished_at`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `timestamp`,
    },
    {
      collection: `_prisma_migrations`,
      field: `id`,
      meta: null,
      schema: {
        data_type: `character varying`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: false,
        is_primary_key: true,
        is_unique: true,
        max_length: 36,
        name: `id`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `string`,
    },
    {
      collection: `_prisma_migrations`,
      field: `logs`,
      meta: null,
      schema: {
        data_type: `text`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: true,
        is_primary_key: false,
        is_unique: false,
        max_length: null,
        name: `logs`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `text`,
    },
    {
      collection: `_prisma_migrations`,
      field: `migration_name`,
      meta: null,
      schema: {
        data_type: `character varying`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: false,
        is_primary_key: false,
        is_unique: false,
        max_length: 255,
        name: `migration_name`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `string`,
    },
    {
      collection: `_prisma_migrations`,
      field: `rolled_back_at`,
      meta: null,
      schema: {
        data_type: `timestamp with time zone`,
        default_value: null,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: true,
        is_primary_key: false,
        is_unique: false,
        max_length: null,
        name: `rolled_back_at`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `timestamp`,
    },
    {
      collection: `_prisma_migrations`,
      field: `started_at`,
      meta: null,
      schema: {
        data_type: `timestamp with time zone`,
        default_value: `now()`,
        foreign_key_column: null,
        foreign_key_table: null,
        generation_expression: null,
        has_auto_increment: false,
        is_generated: false,
        is_nullable: false,
        is_primary_key: false,
        is_unique: false,
        max_length: null,
        name: `started_at`,
        numeric_precision: null,
        numeric_scale: null,
        table: `_prisma_migrations`,
      },
      type: `timestamp`,
    },
  ],
});

export { getPrismaMigrationsSnapshot };

export type { PrismaDatamodel, PrismaField, PrismaModel };
