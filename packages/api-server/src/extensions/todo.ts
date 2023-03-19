import { config } from "dotenv";

import { Client } from "@notionhq/client";
import { CreatePageResponse, QueryDatabaseResponse, UpdatePageResponse } from "@notionhq/client/build/src/api-endpoints";

import { log } from "../utils";

config({ path: ".env" });

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}
if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID is not defined");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});


const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;


const getTodoList = async (completed: boolean): Promise<QueryDatabaseResponse> => {
  const result = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Done",
      checkbox: {
        equals: Boolean(completed),
      },
    },
  });
  return result;
};

const updateTodoItem = async ({ id, done }: {
  id: string,
  done: boolean
}): Promise<UpdatePageResponse> => {
  const todo = await notion.pages.update({
    page_id: id,
    properties: {
      Done: {
        checkbox: done,
      },
    },
  });
  return todo;
};

const addTodoItem = async (text: string): Promise<CreatePageResponse> => {
  const result = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: [{ text: { content: text } }] },
      Done: { checkbox: false },
    },
  });
  return result;
};

export const todoHandler = async (cmd: string): Promise<void> => {
  const [_, action, ...rest] = cmd.split(" ");
  const text = rest.join(" ");
  switch (action) {

    case "list": {
      const todoList = await getTodoList(false);
      log("todoList", todoList);
      break;
    }

    case "done": {
      const todoDone = await getTodoList(true);
      log("todoDone", todoDone);
      break;
    }

    case "add": {
      const todoAdd = await addTodoItem(text);
      log("todoAdd", todoAdd);
      break;
    }

    case "update": {
      const todoUpdate = await updateTodoItem({ id: text, done: true });
      log("todoUpdate", todoUpdate);
      break;
    }

    default: {
      log("Unknown action");
    }
  }
};