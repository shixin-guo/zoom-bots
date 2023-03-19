import { Request, Response } from "express";

import { log } from "./utils";
import { sendMessagesToApiHub } from "./chatgpt";
import { todoHandler } from "./extensions/todo";

const commandHandler = async (req:Request, res:Response): Promise<void> => {
  const { toJid, accountId, userJid, cmd = "hi" } = req.body.payload;
  log("payload.cmd:", cmd);
  if (cmd.startsWith("/todo") || cmd.startsWith("/Todo")) {
    todoHandler(cmd);
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
};
export { commandHandler };