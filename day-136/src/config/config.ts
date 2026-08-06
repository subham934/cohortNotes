import { config } from "dotenv";
config();

/**
 * GOOGLE_API_KEY: 
 * MISTRAL_API_KEY:
 * COHERE_API_KEY:
 */

type CONFIG = {
    readonly OPENAI_API_KEY: string;
    readonly MISTRAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
}

const app_config: CONFIG = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
}


export default app_config;