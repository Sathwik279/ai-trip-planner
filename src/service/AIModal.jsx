const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const modelName = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";
const REQUEST_TIMEOUT_MS = 20000;

async function generateTrip(prompt) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a travel planner. Return only valid JSON matching the user's requested schema.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Groq request timed out. Please try again.");
      timeoutError.status = 408;
      throw timeoutError;
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(errorBody || "Groq request failed");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? "";

  return {
    response: {
      text: () => text,
    },
  };
}

export const chatSession = {
  sendMessage: generateTrip,
};
