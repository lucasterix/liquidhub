import type { Request, Response } from 'express';
import { analyze, validateAnalyzeRequest } from '../lib/finance.js';

export function postAnalyze(req: Request, res: Response) {
  try {
    const parsed = validateAnalyzeRequest(req.body);
    const result = analyze(parsed);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
