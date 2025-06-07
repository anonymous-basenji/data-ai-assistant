export default async function handler(request, response) {
    if(request.method !== 'POST') {
        return response.status(405).json({error : 'Method not allowed'});
    }

    try {
        const {history, systemPrompt} = request.body;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if(!GEMINI_API_KEY) {
            console.error("Gemini API Key environment variable not set!");
            throw new Error("API key is not set on this server");
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
            contents: history,
            systemInstruction: {parts : [{text: systemPrompt}]}
        };

        console.log("Attempting to fetch from Gemini API...");
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });
        console.log("Fetch call complete. Response status:", geminiResponse.status);

        if(!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            throw new Error(`Gemini API Error: ${geminiResponse.status} - ${errorBody}`);
        }

        console.log("Succesfully retrieved data from Gemini API. Sending response to client.")
        const data = await geminiResponse.json();
        return response.status(200).json(data);
    } catch(error) {
        console.error("Critical error in backend function:", error);

        return response.status(500).json({error: "An internal server error occured."});
    }
}