import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
import { CharacterTextSplitter } from "langchain/text_splitter";

import {
  PromptTemplate,
} from "langchain/prompts";
import { NextResponse } from "next/server";

import { ChainValues } from "langchain/dist/schema";

import { TranslateBody } from "@/types/types";

export const config = {
  runtime: "edge",
};

const promptTemplate =
  `You are an expert translator in all languages. Translate the wording from {inputLanguage} to {outputLanguage}.
  do not write explanations, and do not replace any placeholder and any HTML tag with anything.
  {{0}}, {{1}}  [1] {{**}} are some params in this phase, that stand for someone's name or something, so do not ignore them. and need put them in the correct order.
  do not ignore the punctuation, and keep the same punctuation in the output.
  input content format is [key]=[value], do not translate key. and keep the same key in the output.
  Example translating from English to Chinese:
  input by English: recording.management.download_video = Download Video (MP4)
  the output should be Chinese and equal to: recording.management.download_video = 下载视频（MP4）
  and now you have the following
  {inputLanguage}:
  {inputCode}
  please translate to {outputLanguage}`
;

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode } =
      (await req.json()) as TranslateBody;
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    let previousToken = "";
    const model = new OpenAI({
      streaming: true,
      maxTokens: 1000,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (curToken: string) => {
          await writer.ready;
          if (curToken !== "\n" || previousToken !== "\n") {
            await writer.write(encoder.encode(`${curToken}`));
          }
          previousToken = curToken;
        },
        handleLLMEnd: async() => {
          // console.log('====================handleLLMEnd====================');
        },
        handleLLMError: async(error: any) => {
          console.log("handleLLMError", error);
        },
      }),
      temperature: 0.1
    });
    const splitter = new CharacterTextSplitter({
      separator: "\n",
      chunkSize: 800,
      chunkOverlap: 0,
    });
    const splitChunks = await splitter.createDocuments([inputCode]);
    const prompt = new PromptTemplate({
      template: promptTemplate,
      inputVariables: ["inputLanguage",
        "outputLanguage",
        "inputCode",]
    });
    const chain = new LLMChain({ llm: model, prompt: prompt });

    const callChain = async ({ pageContent }: typeof splitChunks[0]): Promise<ChainValues> => {
      return new Promise((resolve, reject) => {
        chain.call({ inputLanguage, outputLanguage, inputCode: pageContent.trim() }).then(result => {
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      });
    };
    const translateData = async ():Promise<void> => {
      for (let i = 0; i < splitChunks.length; i++) {
        await callChain(splitChunks[i]);
        if (i === splitChunks.length - 1) {
          await writer.ready;
          await writer.close();
        }
      }
    };
    translateData();
    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
