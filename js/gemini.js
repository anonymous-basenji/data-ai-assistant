export async function generateGeminiResponse(history, systemPrompt) {
    const API_URL ='/api/chat';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({history, systemPrompt})
        });

        if(!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorData.error || 'The server returned an error');
        }

        const data = await response.json();

        if(!data.candidates || data.candidates.length == 0) {
            if(data.promptFeeback && data.promptFeedback.blockReason) {
                throw new Error(`Response was blocked due to ${data.promptFeedback.blockReason}`);
            }
            throw new Error("No candidates found in API response.");
        }
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if(!text) {
            throw new Error("No text found in the API response");
        }

        return text;

    } catch(error) {
        console.error("Error in generateGeminiResponse:", error);
        throw error;
    }
}