import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const PORT = 3001;
export const CORS_ORIGIN = "http://localhost:5173";

interface EnvConfig {
  GOOGLE_PROJECT_ID: string;
  GOOGLE_API_KEY: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  GOOGLE_PROJECT_ID: getEnvVar("GOOGLE_PROJECT_ID"),
  GOOGLE_API_KEY: getEnvVar("GOOGLE_API_KEY"),
};
