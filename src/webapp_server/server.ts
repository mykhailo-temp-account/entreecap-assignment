import Fastify from "fastify"
import cors from "@fastify/cors";
import {logger, pinoPrettyOptions} from "../logging.js";
import {attachPrivateApiHandlers} from "./private_api.js";


const server = Fastify({
  logger: {
    level: "warn",
    transport: {
      target: "pino-pretty",
      options: pinoPrettyOptions,
    },
  }
})

server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "FETCH", "POST"]
})

attachPrivateApiHandlers(server)

try {
  server.server.keepAliveTimeout = 65000
  let opts = {
    host: "0.0.0.0",
    port: parseInt(process.env.VOZIY_API_PORT ?? "4000"),
  }

  await server.listen(opts)

  const address = server.server.address() as any
  const port = typeof address === 'string' ? address : address?.port

  logger.info(`API at http://${address?.address as string ?? address}:${port}/private/api/v1/search`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}