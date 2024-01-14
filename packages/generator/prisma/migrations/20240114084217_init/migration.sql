-- CreateTable
CREATE TABLE "Item" (
    "item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_group_id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "item_id" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "ItemGroup" (
    "item_group_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,

    CONSTRAINT "item_group_id" PRIMARY KEY ("item_group_id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "item__item_group" FOREIGN KEY ("item_group_id") REFERENCES "ItemGroup"("item_group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
