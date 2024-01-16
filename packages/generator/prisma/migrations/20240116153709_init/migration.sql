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

);

-- CreateTable
CREATE TABLE "directus_collections" (

);

-- CreateTable
CREATE TABLE "directus_dashboards" (

);

-- CreateTable
CREATE TABLE "directus_extensions" (
    "name" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "directus_extensions_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "directus_fields" (

);

-- CreateTable
CREATE TABLE "directus_files" (

);

-- CreateTable
CREATE TABLE "directus_flows" (

);

-- CreateTable
CREATE TABLE "directus_folders" (

);

-- CreateTable
CREATE TABLE "directus_migrations" (

);

-- CreateTable
CREATE TABLE "directus_notifications" (

);

-- CreateTable
CREATE TABLE "directus_operations" (

);

-- CreateTable
CREATE TABLE "directus_panels" (

);

-- CreateTable
CREATE TABLE "directus_permissions" (

);

-- CreateTable
CREATE TABLE "directus_presets" (

);

-- CreateTable
CREATE TABLE "directus_relations" (

);

-- CreateTable
CREATE TABLE "directus_revisions" (

);

-- CreateTable
CREATE TABLE "directus_roles" (

);

-- CreateTable
CREATE TABLE "directus_sessions" (

);

-- CreateTable
CREATE TABLE "directus_settings" (

);

-- CreateTable
CREATE TABLE "directus_shares" (

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

);

-- CreateTable
CREATE TABLE "directus_versions" (

);

-- CreateTable
CREATE TABLE "directus_webhooks" (

);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item__item_group" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("item_group_id") ON DELETE CASCADE ON UPDATE CASCADE;
