export default async function handler(request) {
    if(request.method !== 'POST') {
        return new Response('Method Not Allowed', {status: 405});
    }

    try {
        const {history, systemPrompt} = await request.json();

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if(!GEMINI_API_KEY) {
            throw new Error("API key is not set on this server");
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({contents: history, systemInstruction: {parts: [{text: systemPrompt}]}})
        });

        if(!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            throw new Error(`Gemini API Error: ${geminiResponse.status} - ${errorBody}`);
        }

        const data = await geminiResponse.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch(error) {
        console.error("Backend error:", error);

        return new Response(JSON.stringify({error: "An internal server error occurred."}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}