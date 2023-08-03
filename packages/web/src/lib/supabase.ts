/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createClient } from '@supabase/supabase-js';

import { env } from '@/env.mjs';
export const supabase =
  // @ts-ignore
  global.supabase ||
  // @ts-ignore
  createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  global.supabase = supabase;
}
