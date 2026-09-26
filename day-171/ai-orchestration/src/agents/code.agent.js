import {ChatMistralAI} from "@langchain/mistralai"
import {listFiles, readFiles, updateFiles} from "./tools.js"
import 

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY,

})