import * as cheerio from "cheerio"
import axios from "axios"
import {logger} from "../logging.js";
import {normalizeRelativePageUrl} from "./utils.js";


export interface VikingsSelectorsConfig {
  charactersListUrl: string
  listSelector: string
  listNameSelector: string
  listActorSelector: string
  listImageSelector: string
  pageHrefSelector: string
  pageDescriptionSelector: string
}

export interface VikingsCharacterInfo {
  name: string
  actor: string
  description: string
  imageUrl: string
}

export async function scrapeVikings(conf: VikingsSelectorsConfig): Promise<VikingsCharacterInfo[]> {
  let listResponse = await axios.get(conf.charactersListUrl)
  let $ = cheerio.load(listResponse.data)
  let listItems = $(conf.listSelector)

  let result: VikingsCharacterInfo[] = []
  for (let element of listItems.toArray()) {
    let name = $(element).find(conf.listNameSelector).text()

    let actorField = $(element).find(conf.listActorSelector).text().split("Played by")
    let actor = actorField.length == 2 ? actorField[1].trim() : undefined
    if (!actor) {
      logger.error(`Actor name for ${name} not found`)
      continue;
    }

    let imageUrl = $(element).find(conf.listImageSelector).attr("src")
    if (!imageUrl) {
      logger.error(`Image for ${name} not found`)
      continue;
    }

    let pageUrl = $(element).find(conf.pageHrefSelector).attr("href")
    if (!pageUrl) {
      logger.error(`Page url for ${name} not found`)
      continue;
    }

    let pageResponse = await axios.get(normalizeRelativePageUrl(conf.charactersListUrl, pageUrl))
    let $$ = cheerio.load(pageResponse.data)

    let description = $$(conf.pageDescriptionSelector).text()

    result.push({
      name,
      actor,
      description,
      imageUrl
    })
  }


  return result
}
