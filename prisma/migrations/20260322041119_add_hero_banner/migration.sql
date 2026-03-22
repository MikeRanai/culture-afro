-- CreateTable
CREATE TABLE "HeroBanner" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL DEFAULT '',
    "ctaLabel1" TEXT NOT NULL DEFAULT '',
    "ctaLink1" TEXT NOT NULL DEFAULT '',
    "ctaLabel2" TEXT NOT NULL DEFAULT '',
    "ctaLink2" TEXT NOT NULL DEFAULT '',
    "decorWord" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroBanner_pkey" PRIMARY KEY ("id")
);
