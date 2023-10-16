import { JWT } from 'next-auth/jwt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import wasm from '@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import model from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

import { db } from '@/lib/db';
export const runtime = 'edge';
export default async function updateTokenUsage(
  jwtToken: JWT,
  inputCode: unknown,
) {
  // calculate API token usage
  await init((imports) => WebAssembly.instantiate(wasm, imports));

  const encoding = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str,
  );

  const tokensOfOpenAI = encoding.encode(JSON.stringify(inputCode));
  console.log('tokensOfOpenAI', tokensOfOpenAI.length);
  encoding.free();
  await db.user.update({
    where: { id: jwtToken?.id },
    data: { usage: { increment: tokensOfOpenAI.length } },
  });
}
