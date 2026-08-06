import { tavily as Tavily } from "@tavily/core"

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})


export const searchInternet = async ({ query, topic, days }) => {
    // Auto-detect topic if not explicitly provided
    let searchTopic = topic || "general";
    const lowerQuery = query.toLowerCase();
    if (!topic && (
        lowerQuery.includes("news") || 
        lowerQuery.includes("today") || 
        lowerQuery.includes("latest") || 
        lowerQuery.includes("recent") || 
        lowerQuery.includes("current") ||
        lowerQuery.includes("update")
    )) {
        searchTopic = "news";
    }

    const options = {
        maxResults: 5,
        topic: searchTopic,
    }
    if (searchTopic === "news") {
        options.days = days || 3;
    }
    options.searchDepth = "advanced";

    const results = await tavily.search(query, options)

    console.log(JSON.stringify(results))

    return JSON.stringify(results)
}