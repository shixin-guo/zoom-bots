import { NextRequest, NextResponse } from 'next/server';

import { CallbackManager } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { ChainValues } from 'langchain/dist/schema';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getToken } from 'next-auth/jwt';

import {
  OptimizeMarkdownPrompt,
  TranslateMarkdownPrompt,
} from '@/utils/prompt';
import updateTokenUsage from '@/utils/tokenUsage';

import { TranslateMarkdownBody } from '@/types/types';
export const runtime = 'edge';
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { inputLanguage, outputLanguage, inputCode, enableOptimize } =
      (await req.json()) as TranslateMarkdownBody;
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const model = new OpenAI({
      streaming: true,
      maxTokens: 1000,
      openAIApiKey: process.env.OPENAI_API_KEY,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (curToken: string) => {
          await writer.ready;
          await writer.write(encoder.encode(`${curToken}`));
        },
        handleLLMEnd: async () => {
          // console.log('====================handleLLMEnd====================');
        },
        handleLLMError: async (error: any) => {
          console.log('handleLLMError', error);
        },
      }),
      temperature: 0.1,
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 0,
    });
    const splitChunks = await splitter.createDocuments([inputCode]);
    const promptTemplate = new PromptTemplate({
      template: enableOptimize
        ? OptimizeMarkdownPrompt
        : TranslateMarkdownPrompt,
      inputVariables: enableOptimize
        ? ['inputCode']
        : ['inputLanguage', 'outputLanguage', 'inputCode'],
    });
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });

    const callChain = async ({
      pageContent,
    }: (typeof splitChunks)[0]): Promise<ChainValues> => {
      // // debugger
      // // use to debugger promptTemplate
      // const prompt = await promptTemplate.formatPromptValue({
      //   inputCode,
      //   inputLanguage,
      //   outputLanguage,
      // });
      // const promptString = prompt.toString();
      // console.log({ promptString });
      return new Promise((resolve, reject) => {
        chain
          .call({ inputLanguage, outputLanguage, inputCode: pageContent })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
    const translateData = async (): Promise<void> => {
      for (let i = 0; i < splitChunks.length; i++) {
        await callChain(splitChunks[i]);
        if (i === splitChunks.length - 1) {
          await writer.ready;
          await writer.close();
        }
      }
    };

    translateData();
    const jwtToken = await getToken({ req });
    if (!jwtToken)
      return new Response('Error', {
        status: 401,
      });
    updateTokenUsage(jwtToken, inputCode);
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
