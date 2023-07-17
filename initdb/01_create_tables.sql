-- ./initdb/01_create_tables.sql

CREATE TABLE IF NOT EXISTS norsemen_tv (
  name VARCHAR(255) PRIMARY KEY,
  description TEXT NOT NULL,
  actor VARCHAR(255) NOT NULL,
  imageUrl VARCHAR(255),
  actorWikiUrl VARCHAR(255),
  actorWikiPageExists BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS vikings_tv (
  name VARCHAR(255) PRIMARY KEY,
  actor VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL
);
