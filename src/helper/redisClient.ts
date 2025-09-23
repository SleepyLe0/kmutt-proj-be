import { logger } from "@/utils/logger";
import { createClient } from "redis";
const site: any = process.env.SITE ? process.env.SITE : "dev";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`,
});

// Handle Redis connection events
redisClient.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  logger.info("Redis Client Connected!");
});

redisClient.on("reconnecting", () => {
  logger.info("Redis Client Reconnecting!");
});

redisClient.on("ready", () => {
  logger.info("Redis Client Ready!");
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error("Redis Connection Error:", error);
  }
})();

const setAsync = async (data: any, key: string, expire = 0) => {
  try {
    const option: {} = {};
    if (expire) {
      option["EX"] = expire;
    }

    await redisClient.set(`${site}:${key}`, JSON.stringify(data), option);
    return true;
  } catch (error) {
    throw error;
  }
};

const getAsync = async (key: string) => {
  try {
    return await redisClient.get(`${site}:${key}`);
  } catch (error) {
    throw error;
  }
};

const delAsync = async (key: string) => {
  try {
    return await redisClient.del(`${site}:${key}`);
  } catch (error) {
    throw error;
  }
};

export { redisClient, getAsync, setAsync, delAsync };