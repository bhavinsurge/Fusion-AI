import { Injectable } from '@nestjs/common';

@Injectable()
export class FilterService {
  filter(responses: any[]) {
    return responses.filter(r => {
      if (!r.answer) return false;

      const text = r.answer.trim().toLowerCase();

      // Remove extremely short answers
      if (text.length < 20) return false;

      // Remove clear refusal answers
      if (
        text.includes("i don't know") ||
        text.includes("i am not sure") ||
        text.includes("cannot answer")
      ) {
        return false;
      }

      return true;
    });
  }
}
