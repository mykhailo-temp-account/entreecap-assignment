import pino from "pino"

export const pinoPrettyOptions = {
  translateTime: true,
  ignore: "pid,hostname"
}

export const logger = pino({
  level: process.env.VOZIY_LOG_LEVEL ?? "debug",
  transport: {
    target: "pino-pretty",
    options: pinoPrettyOptions,
  }
})
