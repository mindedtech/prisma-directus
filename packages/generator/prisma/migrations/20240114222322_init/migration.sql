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

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item__item_group" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("item_group_id") ON DELETE CASCADE ON UPDATE CASCADE;
