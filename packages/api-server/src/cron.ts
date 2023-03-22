import GetWeatherDataAlert from "./extensions/weather";
import { mySendMessage } from "./zoom-chat";
export const webhookHandler = async (body: {type: string}):Promise<void> => {
  const weatherTips = await GetWeatherDataAlert();
  await mySendMessage({
    head: {
      text: "_Daily Alert_",
      sub_head: {
        text: "*Weather Tips and something*"
      }
    },
    body: [
      {
        type: "message",
        text: `>${weatherTips}`
      }
    ]
  },);
};