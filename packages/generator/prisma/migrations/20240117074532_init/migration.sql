-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "locale" (
    "locale_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locale_id" PRIMARY KEY ("locale_id")
);

-- CreateTable
CREATE TABLE "article" (
    "article_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_id" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "article_locale" (
    "article_locale_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "article_id" UUID NOT NULL,
    "locale_id" UUID NOT NULL,
    "article_locale_slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body_markdown" TEXT,

    CONSTRAINT "article_locale_id" PRIMARY KEY ("article_locale_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_locale__article_id__locale_id__unique" ON "article_locale"("article_id", "locale_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_locale_slug__unique" ON "article_locale"("article_locale_slug");

-- AddForeignKey
ALTER TABLE "article_locale" ADD CONSTRAINT "article_locale__article__fk" FOREIGN KEY ("article_id") REFERENCES "article"("article_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_locale" ADD CONSTRAINT "article_locale__locale__fk" FOREIGN KEY ("locale_id") REFERENCES "locale"("locale_id") ON DELETE CASCADE ON UPDATE CASCADE;
