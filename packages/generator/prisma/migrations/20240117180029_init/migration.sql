-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "locale" (
    "locale_code" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locale__pk" PRIMARY KEY ("locale_code")
);

-- CreateTable
CREATE TABLE "article" (
    "article_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "article__pk" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "article_locale" (
    "article_locale_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "article_id" UUID NOT NULL,
    "locale_code" TEXT NOT NULL,
    "article_locale_slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "body_markdown" TEXT,

    CONSTRAINT "article_locale__pk" PRIMARY KEY ("article_locale_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_locale__article__locale__uq" ON "article_locale"("article_id", "locale_code");

-- CreateIndex
CREATE UNIQUE INDEX "article_locale__slug__uq" ON "article_locale"("article_locale_slug");

-- AddForeignKey
ALTER TABLE "article_locale" ADD CONSTRAINT "article_locale__article__fk" FOREIGN KEY ("article_id") REFERENCES "article"("article_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_locale" ADD CONSTRAINT "article_locale__locale__fk" FOREIGN KEY ("locale_code") REFERENCES "locale"("locale_code") ON DELETE CASCADE ON UPDATE CASCADE;
