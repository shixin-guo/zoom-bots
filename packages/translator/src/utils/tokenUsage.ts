import { JWT } from 'next-auth/jwt';
import TiktokenModel from 'tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from 'tiktoken/lite/init';
import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module';

import { db } from '@/lib/db';

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
  await db.user.update({
    where: { id: jwtToken?.sub },
    data: { usage: { increment: tokensOfOpenAI.length } },
  });
}
