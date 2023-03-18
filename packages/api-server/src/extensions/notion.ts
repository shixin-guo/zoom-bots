// import { Client } from "@notionhq/client";

// import { logWithTime } from "../utils";

// const NOTION_API_KEY = process.env.NOTION_API_KEY;
// const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// if (!NOTION_DATABASE_ID) {
//   throw new Error("NOTION_DATABASE_ID is not defined");
// }
// if (!NOTION_API_KEY) {
//   throw new Error("NOTION_API_KEY is not defined");
// }

// const notion = new Client({ auth: NOTION_API_KEY });

// const database_id = NOTION_DATABASE_ID;

// interface DatabaseOperationsParams {
//   uniqueId: string,
//   name: string,
//   status: boolean,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   date: any
// }

// export async function addToDatabase({
//   uniqueId,
//   name,
//   status,
//   date,
// }: DatabaseOperationsParams): Promise<void> {
//   try {
//     const response = await notion.pages.create({
//       parent: {
//         database_id,
//       },
//       properties: {
//         ID: {
//           type: "title",
//           title: [
//             {
//               type: "text",
//               text: {
//                 content: uniqueId,
//               },
//             },
//           ],
//         },
//         Name: {
//           type: "rich_text",
//           rich_text: [
//             {
//               type: "text",
//               text: {
//                 content: name,
//               },
//             },
//           ],
//         },
//         Status: {
//           type: "checkbox",
//           checkbox: status,
//         },
//         Date: {
//           // Date is formatted YYYY-MM-DD
//           type: "date",
//           date: date,
//         },
//       },
//     });
//     logWithTime(response);
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(error);
//   }
// }

// export async function queryDatabase(
//   username: string
// ): Promise<string | undefined> {
//   try {
//     const response = await notion.databases.query({
//       database_id,
//       filter: {
//         property: "ID",
//         rich_text: {
//           contains: username,
//         },
//       },
//     });
//     return response.results[0].id;
//   } catch (error) {
//     logWithTime(error);
//   }
// }

// export async function updateItem({
//   username,
//   status,
//   inputDate,
// }: {
//   username: string,
//   status: boolean,
//   inputDate: string
// }): Promise<void> {
//   queryDatabase(username).then(async (pageId) => {
//     if (!pageId) {
//       throw new Error("Page ID not found");
//     }
//     try {
//       const response = await notion.pages.update({
//         page_id: pageId,
//         properties: {
//           Status: {
//             checkbox: status,
//           },
//           Date: {
//             type: "date",
//             date: {
//               start: inputDate,
//             },
//           },
//         },
//       });
//       logWithTime(response);
//     } catch (error) {
//       logWithTime(error);
//     }
//   });
// }

// export async function deleteItem(username: string): Promise<void> {
//   try {
//     queryDatabase(username).then(async (pageId) => {
//       if (!pageId) {
//         throw new Error("Page ID not found");
//       }
//       const response = await notion.blocks.delete({
//         block_id: pageId,
//       });
//       logWithTime(response);
//     });
//   } catch (error) {
//     logWithTime(error);
//   }
// }

// // test

// // addToDatabase(databaseId, 'test_database_id', 'David Jones', false, null);

// // queryDatabase(databaseId, 'test_database_id')
// //   .then(result => {
// //     logWithTime(result);
// //   });

// // updateItem(databaseId, 'test_database_id', true, '2022-08-22');

// // deleteItem(databaseId, 'test_database_id');
