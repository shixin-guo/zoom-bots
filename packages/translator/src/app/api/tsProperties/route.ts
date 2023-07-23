import { NextRequest, NextResponse } from 'next/server';

import { CallbackManager } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { ChainValues } from 'langchain/dist/schema';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { getToken } from 'next-auth/jwt';

import updateTokenUsage from '@/utils/tokenUsage';
import { OnlyTranslateContentPrompt } from '@/utils/prompt';
import { splitJSON } from '@/utils/split';

import { TranslateBody } from '@/types/types';

export const config = {
  runtime: 'edge',
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { outputLanguage, inputCode } = (await req.json()) as TranslateBody;
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

    const splitChunks = splitJSON(inputCode, 800);

    const promptTemplate = new PromptTemplate({
      template: OnlyTranslateContentPrompt,
      inputVariables: ['inputCode', 'outputLanguage'],
    });
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });

    const callChain = async (inputCode: {
      [key: string]: string;
    }): Promise<ChainValues> => {
      // // debugger
      // // use to debugger promptTemplate
      // const prompt = await promptTemplate.formatPromptValue({
      //   inputCode,
      //   outputLanguage,
      // });
      // const promptString = prompt.toString();
      // console.log({ promptString });
      return new Promise((resolve, reject) => {
        chain
          .call({
            outputLanguage,
            inputCode: JSON.stringify(inputCode),
          })
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
    return new Response('Error', {
      status: 500,
    });
  }
}
