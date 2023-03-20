import { ZoomChatbotParams } from "./types";
import { log } from "./utils";


let expires_in: Date | number = 0;
let access_token = "";

async function sendChat(
  body: ZoomChatbotParams
): Promise<Response | void> {
  if (!access_token) {
    await refreshChatbotToken();
  }
  const response = await fetch("https://api.zoom.us/v2/im/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    body: JSON.stringify(body),
  }).then(res => {
    log("Success sending chat to Zoom", res);
    return res;
  }).catch((e) => {
    log("Error sending chat to Zoom", e);
  });
  return await response?.json() || "No response from Zoom.";
}

async function refreshChatbotToken(): Promise<void> {
  if (expires_in > new Date().getTime() / 1000) {
    return;
  }
  log("Refreshing chatbot_token from Zoom.");
  const response = await fetch("https://api.zoom.us/oauth/token?grant_type=client_credentials", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.zoom_client_id + ":" + process.env.zoom_client_secret
        ).toString("base64"),
    },
  });
  const data = await response.json();
  log("Got chatbot_token from Zoom.");
  access_token = data.access_token;
  expires_in = new Date(data.expires_in * 1000 + new Date().getTime());
}

export { sendChat, refreshChatbotToken };
