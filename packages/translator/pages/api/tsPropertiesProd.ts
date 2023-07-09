import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { getToken } from 'next-auth/jwt';
import { CallbackManager } from 'langchain/callbacks';
import { ChainValues } from 'langchain/dist/schema';

import { PromptTemplate } from 'langchain/prompts';
import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module';

import TiktokenModel from 'tiktoken/encoders/cl100k_base.json';

import { Tiktoken, init } from 'tiktoken/lite/init';

import { TranslateBody } from '@/types/types';
import { OnlyTranslateContentPrompt } from '@/utils/prompt';
import { splitJSON } from '@/utils/split';

import { prisma } from '@/lib/prisma';
export const config = {
  runtime: 'experimental-edge',
};
const handler = async (req: NextRequest): Promise<Response> => {
  try {
    const jwtToken = await getToken({ req });
    // console.log('request token', token);

    const { outputLanguage, inputCode } = (await req.json()) as TranslateBody;
    // calculate API token usage
    await init((imports) => WebAssembly.instantiate(wasm, imports));

    const encoding = new Tiktoken(
      TiktokenModel.bpe_ranks,
      TiktokenModel.special_tokens,
      TiktokenModel.pat_str,
    );

    const tokensOfOpenAI = encoding.encode(JSON.stringify(inputCode));
    encoding.free();
    console.log(
      '🚀 ~ file: tsPropertiesProd.ts:43 ~ handler ~ tokensOfOpenAI.length:',
      tokensOfOpenAI.length,
    );

    // find user
    const user = await prisma.user.findUnique({
      where: { id: jwtToken?.sub },
    });
    console.log('user', user);

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const model = new OpenAI({
      streaming: true,
      maxTokens: 1000,
      openAIApiKey: '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',
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
      // debugger
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
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    // console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
