import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse): void {
  console.log(req.body, 111);
  res.status(200).json({ success: true });
}