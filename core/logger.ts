import winston from "winston";

const prettyFormat = winston.format.printf((info) => {
  return `[${info.timestamp}] [${info.service ?? "App"}] ${info.message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }), 
    prettyFormat
  ),
  transports: [new winston.transports.Console()]
});

export const logInfo = (
  requestId: string,
  service: string,
  event: string,
  message: string,
  data: any = {}
) => {
  logger.info({
    requestId,
    service,
    event,
    message,
    ...data
  });
};

export const logError = (
  requestId: string,
  service: string,
  event: string,
  message: string,
  data: any = {}
) => {
  logger.error({
    requestId,
    service,
    event,
    message,
    ...data
  });
};
