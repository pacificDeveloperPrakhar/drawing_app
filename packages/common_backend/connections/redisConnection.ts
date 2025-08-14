import { createClient } from "redis";
import { REDIS_HOST } from "../configuration";
// Initialize client with optional URL from environment
export const client = createClient({
  url: REDIS_HOST, // e.g., "redis://localhost:6379"
});
client.connect()

client.on("error", (err) => console.error("❌ Redis Client Error", err));
client.on('connect', () => {
    console.log(REDIS_HOST)
    console.log(`\x1b[32m✅ Connected to Redis\x1b[0m at \x1b[34m${REDIS_HOST}\x1b[0m`);
  });


