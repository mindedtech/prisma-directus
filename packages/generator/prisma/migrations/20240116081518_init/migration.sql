-- CreateEnum
CREATE TYPE "ItemColor" AS ENUM ('RED', 'GREEN', 'BLUE');

-- CreateTable
CREATE TABLE "item" (
    "item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_group_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "item_color" "ItemColor" NOT NULL,

    CONSTRAINT "item_id" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "item_group" (
    "item_group_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,

    CONSTRAINT "item_group_id" PRIMARY KEY ("item_group_id")
);

-- CreateTable
CREATE TABLE "directus_activity" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(45) NOT NULL,
    "user" UUID,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(50),
    "user_agent" VARCHAR(255),
    "collection" VARCHAR(64) NOT NULL,
    "item" VARCHAR(255) NOT NULL,
    "comment" TEXT,
    "origin" VARCHAR(255),

    CONSTRAINT "directus_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_collections" (
    "collection" VARCHAR(64) NOT NULL,
    "icon" VARCHAR(30),
    "note" TEXT,
    "display_template" VARCHAR(255),
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "singleton" BOOLEAN NOT NULL DEFAULT false,
    "translations" JSON,
    "archive_field" VARCHAR(64),
    "archive_app_filter" BOOLEAN NOT NULL DEFAULT true,
    "archive_value" VARCHAR(255),
    "unarchive_value" VARCHAR(255),
    "sort_field" VARCHAR(64),
    "accountability" VARCHAR(255) DEFAULT 'all',
    "color" VARCHAR(255),
    "item_duplication_fields" JSON,
    "sort" INTEGER,
    "group" VARCHAR(64),
    "collapse" VARCHAR(255) NOT NULL DEFAULT 'open',
    "preview_url" VARCHAR(255),
    "versioning" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "directus_collections_pkey" PRIMARY KEY ("collection")
);

-- CreateTable
CREATE TABLE "directus_dashboards" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(30) NOT NULL DEFAULT 'dashboard',
    "note" TEXT,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created" UUID,
    "color" VARCHAR(255),

    CONSTRAINT "directus_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_extensions" (
    "name" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "directus_extensions_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "directus_fields" (
    "id" SERIAL NOT NULL,
    "collection" VARCHAR(64) NOT NULL,
    "field" VARCHAR(64) NOT NULL,
    "special" VARCHAR(64),
    "interface" VARCHAR(64),
    "options" JSON,
    "display" VARCHAR(64),
    "display_options" JSON,
    "readonly" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER,
    "width" VARCHAR(30) DEFAULT 'full',
    "translations" JSON,
    "note" TEXT,
    "conditions" JSON,
    "required" BOOLEAN DEFAULT false,
    "group" VARCHAR(64),
    "validation" JSON,
    "validation_message" TEXT,

    CONSTRAINT "directus_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_files" (
    "id" UUID NOT NULL,
    "storage" VARCHAR(255) NOT NULL,
    "filename_disk" VARCHAR(255),
    "filename_download" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "type" VARCHAR(255),
    "folder" UUID,
    "uploaded_by" UUID,
    "uploaded_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" UUID,
    "modified_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "charset" VARCHAR(50),
    "filesize" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "embed" VARCHAR(200),
    "description" TEXT,
    "location" TEXT,
    "tags" TEXT,
    "metadata" JSON,

    CONSTRAINT "directus_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_flows" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(30),
    "color" VARCHAR(255),
    "description" TEXT,
    "status" VARCHAR(255) NOT NULL DEFAULT 'active',
    "trigger" VARCHAR(255),
    "accountability" VARCHAR(255) DEFAULT 'all',
    "options" JSON,
    "operation" UUID,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created" UUID,

    CONSTRAINT "directus_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_folders" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parent" UUID,

    CONSTRAINT "directus_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_migrations" (
    "version" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directus_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "directus_notifications" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255) DEFAULT 'inbox',
    "recipient" UUID NOT NULL,
    "sender" UUID,
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT,
    "collection" VARCHAR(64),
    "item" VARCHAR(255),

    CONSTRAINT "directus_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_operations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "key" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "options" JSON,
    "resolve" UUID,
    "reject" UUID,
    "flow" UUID NOT NULL,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created" UUID,

    CONSTRAINT "directus_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_panels" (
    "id" UUID NOT NULL,
    "dashboard" UUID NOT NULL,
    "name" VARCHAR(255),
    "icon" VARCHAR(30),
    "color" VARCHAR(10),
    "show_header" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "type" VARCHAR(255) NOT NULL,
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "options" JSON,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created" UUID,

    CONSTRAINT "directus_panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_permissions" (
    "id" SERIAL NOT NULL,
    "role" UUID,
    "collection" VARCHAR(64) NOT NULL,
    "action" VARCHAR(10) NOT NULL,
    "permissions" JSON,
    "validation" JSON,
    "presets" JSON,
    "fields" TEXT,

    CONSTRAINT "directus_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_presets" (
    "id" SERIAL NOT NULL,
    "bookmark" VARCHAR(255),
    "user" UUID,
    "role" UUID,
    "collection" VARCHAR(64),
    "search" VARCHAR(100),
    "layout" VARCHAR(100) DEFAULT 'tabular',
    "layout_query" JSON,
    "layout_options" JSON,
    "refresh_interval" INTEGER,
    "filter" JSON,
    "icon" VARCHAR(30) DEFAULT 'bookmark',
    "color" VARCHAR(255),

    CONSTRAINT "directus_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_relations" (
    "id" SERIAL NOT NULL,
    "many_collection" VARCHAR(64) NOT NULL,
    "many_field" VARCHAR(64) NOT NULL,
    "one_collection" VARCHAR(64),
    "one_field" VARCHAR(64),
    "one_collection_field" VARCHAR(64),
    "one_allowed_collections" TEXT,
    "junction_field" VARCHAR(64),
    "sort_field" VARCHAR(64),
    "one_deselect_action" VARCHAR(255) NOT NULL DEFAULT 'nullify',

    CONSTRAINT "directus_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_revisions" (
    "id" SERIAL NOT NULL,
    "activity" INTEGER NOT NULL,
    "collection" VARCHAR(64) NOT NULL,
    "item" VARCHAR(255) NOT NULL,
    "data" JSON,
    "delta" JSON,
    "parent" INTEGER,
    "version" UUID,

    CONSTRAINT "directus_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(30) NOT NULL DEFAULT 'supervised_user_circle',
    "description" TEXT,
    "ip_access" TEXT,
    "enforce_tfa" BOOLEAN NOT NULL DEFAULT false,
    "admin_access" BOOLEAN NOT NULL DEFAULT false,
    "app_access" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "directus_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_sessions" (
    "token" VARCHAR(64) NOT NULL,
    "user" UUID,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "ip" VARCHAR(255),
    "user_agent" VARCHAR(255),
    "share" UUID,
    "origin" VARCHAR(255),

    CONSTRAINT "directus_sessions_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "directus_settings" (
    "id" SERIAL NOT NULL,
    "project_name" VARCHAR(100) NOT NULL DEFAULT 'Directus',
    "project_url" VARCHAR(255),
    "project_color" VARCHAR(255) NOT NULL DEFAULT '#6644FF',
    "project_logo" UUID,
    "public_foreground" UUID,
    "public_background" UUID,
    "public_note" TEXT,
    "auth_login_attempts" INTEGER DEFAULT 25,
    "auth_password_policy" VARCHAR(100),
    "storage_asset_transform" VARCHAR(7) DEFAULT 'all',
    "storage_asset_presets" JSON,
    "custom_css" TEXT,
    "storage_default_folder" UUID,
    "basemaps" JSON,
    "mapbox_key" VARCHAR(255),
    "module_bar" JSON,
    "project_descriptor" VARCHAR(100),
    "default_language" VARCHAR(255) NOT NULL DEFAULT 'en-US',
    "custom_aspect_ratios" JSON,
    "public_favicon" UUID,
    "default_appearance" VARCHAR(255) NOT NULL DEFAULT 'auto',
    "default_theme_light" VARCHAR(255),
    "theme_light_overrides" JSON,
    "default_theme_dark" VARCHAR(255),
    "theme_dark_overrides" JSON,

    CONSTRAINT "directus_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_shares" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "collection" VARCHAR(64) NOT NULL,
    "item" VARCHAR(255) NOT NULL,
    "role" UUID,
    "password" VARCHAR(255),
    "user_created" UUID,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_start" TIMESTAMPTZ(6),
    "date_end" TIMESTAMPTZ(6),
    "times_used" INTEGER DEFAULT 0,
    "max_uses" INTEGER,

    CONSTRAINT "directus_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_translations" (
    "id" UUID NOT NULL,
    "language" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "directus_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "email" VARCHAR(128),
    "password" VARCHAR(255),
    "location" VARCHAR(255),
    "title" VARCHAR(50),
    "description" TEXT,
    "tags" JSON,
    "avatar" UUID,
    "language" VARCHAR(255),
    "tfa_secret" VARCHAR(255),
    "status" VARCHAR(16) NOT NULL DEFAULT 'active',
    "role" UUID,
    "token" VARCHAR(255),
    "last_access" TIMESTAMPTZ(6),
    "last_page" VARCHAR(255),
    "provider" VARCHAR(128) NOT NULL DEFAULT 'default',
    "external_identifier" VARCHAR(255),
    "auth_data" JSON,
    "email_notifications" BOOLEAN DEFAULT true,
    "appearance" VARCHAR(255),
    "theme_dark" VARCHAR(255),
    "theme_light" VARCHAR(255),
    "theme_light_overrides" JSON,
    "theme_dark_overrides" JSON,

    CONSTRAINT "directus_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_versions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255),
    "collection" VARCHAR(64) NOT NULL,
    "item" VARCHAR(255) NOT NULL,
    "hash" VARCHAR(255),
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created" UUID,
    "user_updated" UUID,

    CONSTRAINT "directus_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directus_webhooks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "method" VARCHAR(10) NOT NULL DEFAULT 'POST',
    "url" VARCHAR(255) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'active',
    "data" BOOLEAN NOT NULL DEFAULT true,
    "actions" VARCHAR(100) NOT NULL,
    "collections" VARCHAR(255) NOT NULL,
    "headers" JSON,

    CONSTRAINT "directus_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "directus_flows_operation_unique" ON "directus_flows"("operation");

-- CreateIndex
CREATE UNIQUE INDEX "directus_operations_resolve_unique" ON "directus_operations"("resolve");

-- CreateIndex
CREATE UNIQUE INDEX "directus_operations_reject_unique" ON "directus_operations"("reject");

-- CreateIndex
CREATE UNIQUE INDEX "directus_users_email_unique" ON "directus_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "directus_users_token_unique" ON "directus_users"("token");

-- CreateIndex
CREATE UNIQUE INDEX "directus_users_external_identifier_unique" ON "directus_users"("external_identifier");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item__item_group" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("item_group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directus_activity" ADD CONSTRAINT "directus_activity_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_collections" ADD CONSTRAINT "directus_collections_group_foreign" FOREIGN KEY ("group") REFERENCES "directus_collections"("collection") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_dashboards" ADD CONSTRAINT "directus_dashboards_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_fields" ADD CONSTRAINT "directus_fields_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_folder_foreign" FOREIGN KEY ("folder") REFERENCES "directus_folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_modified_by_foreign" FOREIGN KEY ("modified_by") REFERENCES "directus_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_uploaded_by_foreign" FOREIGN KEY ("uploaded_by") REFERENCES "directus_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_flows" ADD CONSTRAINT "directus_flows_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_folders" ADD CONSTRAINT "directus_folders_parent_foreign" FOREIGN KEY ("parent") REFERENCES "directus_folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_notifications" ADD CONSTRAINT "directus_notifications_recipient_foreign" FOREIGN KEY ("recipient") REFERENCES "directus_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_notifications" ADD CONSTRAINT "directus_notifications_sender_foreign" FOREIGN KEY ("sender") REFERENCES "directus_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_flow_foreign" FOREIGN KEY ("flow") REFERENCES "directus_flows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_reject_foreign" FOREIGN KEY ("reject") REFERENCES "directus_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_resolve_foreign" FOREIGN KEY ("resolve") REFERENCES "directus_operations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_panels" ADD CONSTRAINT "directus_panels_dashboard_foreign" FOREIGN KEY ("dashboard") REFERENCES "directus_dashboards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_panels" ADD CONSTRAINT "directus_panels_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_permissions" ADD CONSTRAINT "directus_permissions_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_permissions" ADD CONSTRAINT "directus_permissions_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_presets" ADD CONSTRAINT "directus_presets_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_presets" ADD CONSTRAINT "directus_presets_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_presets" ADD CONSTRAINT "directus_presets_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_relations" ADD CONSTRAINT "directus_relations_many_collection_foreign" FOREIGN KEY ("many_collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_relations" ADD CONSTRAINT "directus_relations_one_collection_foreign" FOREIGN KEY ("one_collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_activity_foreign" FOREIGN KEY ("activity") REFERENCES "directus_activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_parent_foreign" FOREIGN KEY ("parent") REFERENCES "directus_revisions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_version_foreign" FOREIGN KEY ("version") REFERENCES "directus_versions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_sessions" ADD CONSTRAINT "directus_sessions_share_foreign" FOREIGN KEY ("share") REFERENCES "directus_shares"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_sessions" ADD CONSTRAINT "directus_sessions_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_project_logo_foreign" FOREIGN KEY ("project_logo") REFERENCES "directus_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_background_foreign" FOREIGN KEY ("public_background") REFERENCES "directus_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_favicon_foreign" FOREIGN KEY ("public_favicon") REFERENCES "directus_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_foreground_foreign" FOREIGN KEY ("public_foreground") REFERENCES "directus_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_storage_default_folder_foreign" FOREIGN KEY ("storage_default_folder") REFERENCES "directus_folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_users" ADD CONSTRAINT "directus_users_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_user_updated_foreign" FOREIGN KEY ("user_updated") REFERENCES "directus_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
