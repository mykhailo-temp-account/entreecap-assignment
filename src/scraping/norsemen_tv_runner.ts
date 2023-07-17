import {logger} from "../logging.js";
import {scrapeNorsemen} from "./norsemen_tv_scraping.js";
import {saveToTable} from "../database/postgres_helpers.js";
import {addToIndex} from "../database/redis_helpers.js";

logger.info(`Norsemen TV series. Scraping...`)

let norsemanTVCharacters = await scrapeNorsemen({
  wikiPageUrl: "https://en.wikipedia.org/wiki/Norsemen_(TV_series)",
  castAndCharactersSelector: "#mw-content-text > div.mw-parser-output > ul:nth-child(14) > li",
  actorSelector: "a:nth-child(1)",
  actorImageSelector: "#mw-content-text > div.mw-parser-output > table > tbody > tr:nth-child(2) > td > span > a > img",
})

logger.info(`Norsemen TV series. Successfully scraped data for ${norsemanTVCharacters.length} characters.`)

await saveToTable("norsemen_tv", norsemanTVCharacters)
logger.info("Saved to Postgres")

await addToIndex("norsemen_tv", norsemanTVCharacters)
logger.info("Added to the index")

process.exit()