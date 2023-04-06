import { resolve } from "path";
import { config } from "dotenv";
import swaggerDocs from "./swagger.json";

config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 3000;
export const APP_SECRET = process.env.APP_SECRET || "development_app_secret";
export const DEFAULT_PAGE_LIMIT = 20;
export const MESSAGE_BROKER_ADDRESS = process.env.MESSAGE_BROKER_ADDRESS;
export const SWAGGER_DOCS = swaggerDocs;
