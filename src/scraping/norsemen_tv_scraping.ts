import axios from "axios";
import * as cheerio from "cheerio";
import {logger} from "../logging.js";
import {normalizeRelativePageUrl} from "./utils.js";

export interface NorsemenSelectorsConfig {
  wikiPageUrl: string
  castAndCharactersSelector: string
  actorSelector: string
  actorImageSelector: string
}

export interface NorsemenCharacterInfo {
  name: string
  description: string
  actor: string
  imageUrl: string | undefined
  actorWikiUrl: string | undefined
  actorWikiPageExists: boolean
}

export async function scrapeNorsemen(conf: NorsemenSelectorsConfig): Promise<NorsemenCharacterInfo[]> {
  let wikiPageResponse = await axios.get(conf.wikiPageUrl)
  let $ = cheerio.load(wikiPageResponse.data)
  let listItems = $(conf.castAndCharactersSelector)

  let result: NorsemenCharacterInfo[] = []
  for (let element of listItems.toArray()) {
    let characterDetails = parseCharacterDetails($(element).text())
    if (!characterDetails) {
      logger.error(`Cannot parse character details for ${$(element).text()}`)
      continue
    }
    let [actor, name, description] = characterDetails


    let actorLinkElem = $(element).find(conf.actorSelector)
    let actorElemText = actorLinkElem.text()

    if (actor != actorElemText.trim()) {
      logger.error(`Parse actor name doesn't match ${actor} to ${actorElemText}`)
      continue
    }

    let actorWikiPage = actorLinkElem.attr("href")

    if (!actorWikiPage) {
      logger.error(`Actor wiki page (for ${actor}) link invalid`)
      continue
    }

    let character: NorsemenCharacterInfo = {
      name,
      description,
      actor,
      imageUrl: undefined,
      actorWikiUrl: undefined,
      actorWikiPageExists: false,
    }

    let actorWikiUrl = normalizeRelativePageUrl(conf.wikiPageUrl, actorWikiPage)

    result.push(await loadActorProfileAndImage(conf, character, actorWikiUrl))
  }

  return result
}


const wikiCastAndCharacterRegex = /^(.*?)\s+as\s+(.*?)$/

function parseCharacterDetails(text: string): string[] | undefined {
  let parts = text.split(",", 2)
  let characterDescription = parts[1].trim()


  let match = parts[0].trim().match(wikiCastAndCharacterRegex)

  if (match) {
    const actorName = match[1];
    const characterName = match[2];

    return [actorName, characterName, characterDescription]
  }
}

async function loadActorProfileAndImage(conf: NorsemenSelectorsConfig, character: NorsemenCharacterInfo, actorWikiPage: string): Promise<NorsemenCharacterInfo> {
  let actorWikiUrl = normalizeRelativePageUrl(conf.wikiPageUrl, actorWikiPage)

  if (actorWikiUrl.includes("redlink=1")) {
    character.actorWikiPageExists = false

    logger.warn(`Actor page wiki for (${character.actor}) does not exists`)

    return character
  }

  character.actorWikiUrl = actorWikiUrl
  character.actorWikiPageExists = true

  let actorPageResponse = await axios.get(actorWikiUrl)

  if (actorPageResponse.status == 200) {
    let $$ = cheerio.load(actorPageResponse.data)
    character.imageUrl = $$("#mw-content-text > div.mw-parser-output > table > tbody > tr:nth-child(2) > td > span > a > img")
      .attr("src")?.replace(/^\/\//, "https://") // it begins with "'//upload.wikimedia...."
  } else {
    logger.warn(`Cannot load actor's page (${character.actor}) for scraping the profile image`)
  }

  return character

}