-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "subtitles" TEXT,
    "lengthTotal" INTEGER NOT NULL,
    "lengthIntro" INTEGER NOT NULL,
    "lengthCredits" INTEGER NOT NULL,
    "streamDomain" TEXT NOT NULL,
    "streamPath" TEXT NOT NULL,
    "streamTokens" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");
