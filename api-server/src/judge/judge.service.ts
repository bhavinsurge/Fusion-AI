import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JudgeService {
  private OLLAMA_URL = 'http://localhost:11434/api/generate';
  private JUDGE_MODEL = 'llama3:8b';

  async judge(prompt: string, responses: any[]) {
    const judgePrompt = `
You are a STRICT JSON API.

User question:
"${prompt}"

Below are answers from different AI models.

${responses
  .map(
    (r, i) =>
      `Answer ${i} (Model: ${r.model}):\n${r.answer}\n`,
  )
  .join('\n')}

RULES:
- Choose the most factually correct answer
- Penalize hallucinations
- Penalize incorrect technical claims

CRITICAL:
- Respond ONLY in valid JSON
- No text before or after JSON

FORMAT:
{ "best_answer_index": number }
`;

    const res = await axios.post(
      this.OLLAMA_URL,
      {
        model: this.JUDGE_MODEL,
        prompt: judgePrompt,
        stream: false,
      },
      { timeout: 60000 },
    );

    return safeJsonParse(res.data.response);
  }
}

// 🛡️ NEVER TRUST LLM OUTPUT
function safeJsonParse(text: string) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON found');
    }
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return {
      best_answer_index: 0,
      error: 'Invalid JSON from judge',
      raw: text,
    };
  }
}
