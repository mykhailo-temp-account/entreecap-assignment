import Redis from "ioredis"
import {it} from "node:test";
import {logger} from "../logging.js";

export const RedisClient = new Redis(6379, "127.0.0.1")

export interface SearchDocument {
  name: string
  actor: string
  description: string
  imageUrl: string | undefined
}

let searchKeys = ["name", "actor", "description", "imageUrl"]

export async function addToIndex<Item extends SearchDocument>(tableName: string, items: Item[]): Promise<void> {
  await createIndexIfNotExists()
  for (let item of items) {
    let documentId = `${tableName}/${item.name}`
    await RedisClient.call(
      "FT.ADD",
      "search_index",
      documentId,
      1.0,
      "REPLACE",
      "FIELDS",
      ...Object.entries(item).filter(([key]) => searchKeys.includes(key)).flat()
    );
  }
}

export async function returnFullIndex(): Promise<SearchDocument[]> {
  logger.debug(`full_index_scan`)
  let result = await RedisClient.call("FT.SEARCH", "search_index", "*", "LIMIT", 0, 100)
  return transformRedisOutput(result)
}


export async function searchTheIndex(text: string): Promise<SearchDocument[]> {
  let query = `(@name:*${text}*) | (@actor:*${text}*) | (@description:*${text}*)`
  logger.debug(`query=${query}`)
  let result = await RedisClient.call("FT.SEARCH", "search_index", query, "LIMIT", 0, 100)
  return transformRedisOutput(result)
}



function transformRedisOutput(items: any): any[] {
  let numRows = items[0]
  if (numRows == 0) {
    return []
  }
  let result = [];
  // each 2nd is aa data document
  for (let i = 2; i < items.length; i += 2) {
    let data = items[i];
    let document = {
      name: data[data.indexOf('name') + 1],
      actor: data[data.indexOf('actor') + 1],
      description: data[data.indexOf('description') + 1],
      imageUrl: data[data.indexOf('imageUrl') + 1] || undefined,
    };

    result.push(document);
  }

  return result
}

function createIndexIfNotExists() {
  return RedisClient.call(  "FT.CREATE",
    "search_index",
    "SCHEMA",
    "title",
    "TEXT",
    "WEIGHT",
    "5.0",
    "name",
    "TEXT",
    "description",
    "TEXT",
    "actor",
    "TEXT").catch((e) => {})
}

