import {logger} from "../logging.js";
import {scrapeVikings} from "./vikings_tv_scraping.js";
import {saveToTable} from "../database/postgres_helpers.js";
import {addToIndex} from "../database/redis_helpers.js";

logger.info("Vikings TV series. Scraping...")
let vikingsTVCharacters = await scrapeVikings({
  charactersListUrl: "https://www.history.com/shows/vikings/cast",
  listSelector: "body > div.main-container > div.content.content-with-sidebar > div > div > ul > li",
  listNameSelector: "div.details > strong",
  listActorSelector: "div.details > small",
  listImageSelector: "div.img-container > img",
  pageHrefSelector: "a",
  pageDescriptionSelector: "body > div.main-container > div.content.content-with-sidebar > div > div > article > p:nth-child(2)"
})

logger.info(`Vikings TV series. Successfully scraped data for ${vikingsTVCharacters.length} characters.`)

await saveToTable("vikings_tv", vikingsTVCharacters)
logger.info("Saved to Postgres")

await addToIndex("vikings_tv", vikingsTVCharacters)
logger.info("Added to the index")

process.exit()