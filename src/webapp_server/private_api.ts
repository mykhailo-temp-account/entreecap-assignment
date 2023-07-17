import {FastifyInstance} from "fastify/types/instance.js";
import {returnFullIndex, searchTheIndex} from "../database/redis_helpers.js";


interface SearchQuery {
  query: string
}
export function attachPrivateApiHandlers(server: FastifyInstance) {
  server.get<{ Querystring: SearchQuery }>("/private/api/v1/search", async (req, reply) => {
    let result = req.query.query ?
      await searchTheIndex(req.query.query) :
      await returnFullIndex()

    reply.status(200).send(result)
  })
}

