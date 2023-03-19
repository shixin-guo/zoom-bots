import { Request, Response } from "express";

import { log } from "./utils";
import { sendMessagesToApiHub } from "./chatgpt";
import { todoHandler } from "./extensions/todo";
import { ZoomBotMessageRequestContent } from "./types";
import { sendChat } from "./zoom-chat";

const commandHandler = async (req:Request, res:Response): Promise<void> => {
  try {
    // const { toJid, accountId, userJid, cmd } = {
    //   cmd: "/todo list",
    //   toJid: "test",
    //   accountId: "test",
    //   userJid: "test",
    // };

    const { toJid, accountId, userJid, cmd = "hi" } = req.body.payload;
    log("payload.cmd:", cmd);

    const commandsContent: string[] = cmd.split(" ");
    const command = commandsContent[0].toLowerCase();
    if (command.startsWith("/todo")) {
      const todoList = await todoHandler(commandsContent);
      const content: ZoomBotMessageRequestContent = {
        body: [{
          type: "section",
          sections: [
            {
              type: "message",
              style: {
                bold: true,
                color: "#000000"
              },
              text: "Here is your unfinished to-do list. You may click on the link to navigate to the Notion page for further actions.",
              link: "https://www.notion.so/15c028b3d5964dfb8270c7b46ec0803f?v=0810c029401a43b19bde45f4653c1b06"
            }
          ],
        } as any, {
          type: "fields",
          items: todoList.map((item) => {
            return {
              key: item,
            };
          }),
        }],
      };
      await sendChat({
        content,
        is_markdown_support: true,
        robot_jid: process.env.zoom_bot_jid!,
        to_jid: toJid,
        account_id: accountId,
        user_jid: userJid,
      });
      return;
    }

    await sendMessagesToApiHub(cmd, {
      robot_jid: process.env.zoom_bot_jid!,
      to_jid: toJid,
      account_id: accountId,
      user_jid: userJid,
    }).then((response) => {
      log("response", response);
    }).catch((error) => {
      log("sendMessagesToApiHub error", error);
    });
  } catch (error) {
    log("commandHandler error", error);
  }

};
export { commandHandler };