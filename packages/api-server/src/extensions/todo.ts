
import { Client } from "@notionhq/client";
import { CreatePageResponse, QueryDatabaseResponse, UpdatePageResponse } from "@notionhq/client/build/src/api-endpoints";

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


export const getTodoList = async (completed: boolean): Promise<QueryDatabaseResponse> => {
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

export const updateTodoItem = async ({ id, done }: {
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

export const addTodoItem = async (text: string): Promise<CreatePageResponse> => {
  const result = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: [{ text: { content: text } }] },
      Done: { checkbox: false },
    },
  });
  return result;
};
