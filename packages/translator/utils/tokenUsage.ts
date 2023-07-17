// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module';
import TiktokenModel from 'tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from 'tiktoken/lite/init';

import { JWT } from 'next-auth/jwt';

import { prisma } from '@/lib/prisma';

export default async function updateTokenUsage(
  jwtToken: JWT,
  inputCode: unknown,
) {
  // calculate API token usage
  await init((imports) => WebAssembly.instantiate(wasm, imports));

  const encoding = new Tiktoken(
    TiktokenModel.bpe_ranks,
    TiktokenModel.special_tokens,
    TiktokenModel.pat_str,
  );

  const tokensOfOpenAI = encoding.encode(JSON.stringify(inputCode));
  encoding.free();
  await prisma.user.update({
    where: { id: jwtToken?.sub },
    data: { usage: { increment: tokensOfOpenAI.length } },
  });
}
