// import { Controller, Get, Query } from '@nestjs/common';
// import { LlmService } from './llm/llm.service';
// import { FilterService } from './filter/filter.service';
// import { JudgeService } from './judge/judge.service';

// @Controller()
// export class AppController {
//   constructor(
//     private readonly llmService: LlmService,
//     private readonly filterService: FilterService,
//     private readonly judgeService: JudgeService,
//   ) {}

//   // 🔹 EXISTING ENDPOINT (NO CHANGE)
//   @Get('chat/multi')
//   async multiLLM(@Query('q') q: string) {
//     const prompt = q || 'What is React?';

//     const rawResponses = await this.llmService.askAll(prompt);
//     const validResponses = this.filterService.filter(rawResponses);

//     return {
//       prompt,
//       totalResponses: rawResponses.length,
//       validResponsesCount: validResponses.length,
//       responses: validResponses,
//     };
//   }

//   // 🔹 NEW ENDPOINT: FINAL ANSWER
//   @Get('chat')
//   async finalAnswer(@Query('q') q: string) {
//     const prompt = q || 'What is React?';

//     const rawResponses = await this.llmService.askAll(prompt);
//     const validResponses = this.filterService.filter(rawResponses);

//     // Fallback if only one response
//     if (validResponses.length === 1) {
//       return {
//         prompt,
//         selectedBy: validResponses[0].model,
//         answer: validResponses[0].answer,
//         reason: 'Only one valid response available',
//       };
//     }

//     // AI Judge decides
//     const judgeResult = await this.judgeService.judge(
//       prompt,
//       validResponses,
//     );

//     const index = judgeResult.best_answer_index - 1;

//     return {
//       prompt,
//       selectedBy: validResponses[index].model,
//       answer: validResponses[index].answer,
//     };
//   }
// }

import { Controller, Get, Query } from '@nestjs/common';
import { LlmService } from './llm/llm.service';
import { JudgeService } from './judge/judge.service';

@Controller()
export class AppController {
  constructor(
    private readonly llmService: LlmService,
    private readonly judgeService: JudgeService,
  ) {}

  @Get('chat')
  async finalAnswer(@Query('q') q: string) {
    const prompt = q || 'What is Java?';

    // 1️⃣ Ask all LLMs
    const rawResponses = await this.llmService.askAll(prompt);

    // 2️⃣ Filter only VALID responses
    const validResponses = rawResponses.filter(
      (r) => r && typeof r.answer === 'string' && r.answer.trim().length > 0,
    );

    // 3️⃣ If no LLM responded
    if (!validResponses.length) {
      return {
        error: 'No LLM responded',
      };
    }

    // 4️⃣ Ask judge
    const judgeResult = await this.judgeService.judge(
      prompt,
      validResponses,
    );

    // 5️⃣ Safely select index
    const index =
      typeof judgeResult.best_answer_index === 'number'
        ? judgeResult.best_answer_index
        : 0;

    const best =
      validResponses[index] ?? validResponses[0];

    // 6️⃣ Final safe response
    return {
      prompt,
      selectedBy: best.model,
      answer: best.answer,
    };
  }
}
