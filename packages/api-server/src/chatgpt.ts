export const sendMessagesToApiHub = async (
  message: string, chatContext?: any
): Promise<void> => {
  try {
    const content = {
      url: "https://api.openai.com/v1/chat/completions",
      requestHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      payload: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      },
      chatContext
    };
    // console.log(JSON.stringify(requestBody));
    // "http://localhost:4000/subscribe"
    const response = await fetch(process.env.API_HUB_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });
    const data = await response.json();
    console.log("== data from aws==", data);
  } catch (error) {
    console.log("== error ==", error);
  }
};

