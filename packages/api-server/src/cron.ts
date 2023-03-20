import GetWeatherDataAlert from "./extensions/weather";
import { sendChat } from "./zoom-chat";
export const webhookHandler = async (body: {type: string}, cacheChatInfo: {
  to_jid: string,
  account_id: string,
  user_jid: string
}):Promise<void> => {
  const weatherTips = await GetWeatherDataAlert();
  await sendChat({
    content:
    {
      head: {
        text: "_Daily Alert_",
        sub_head: {
          text: "~Weather Tips and something~"
        }
      },
      body: [
        {
          type: "message",
          text: `>${weatherTips}`
        }
      ]
    },
    is_markdown_support: true,
    robot_jid: process.env.zoom_bot_jid!,
    to_jid: cacheChatInfo.to_jid,
    account_id: cacheChatInfo.account_id,
    user_jid: cacheChatInfo.user_jid,
  });
};