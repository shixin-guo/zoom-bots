import { Response } from "express";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function log(...args: any[]): void {
  console.log(
    ...args
  );
}

async function within(fn: any, res: Response, duration: number): Promise<void> {
  const id = setTimeout(() => res.send({
    message: "There was an error with the upstream service!"
  }), duration);

  try {
    const data = await fn();
    clearTimeout(id);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export { within, log };