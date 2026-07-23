import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JudgeService } from '../judge/judge.service';
import { LlmService } from '../llm/llm.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly judgeService: JudgeService,
  ) {}

  async chat(userId: string, dto: ChatDto) {
    const prompt = dto.message.trim();
    const conversation = await this.resolveConversation(
      userId,
      prompt,
      dto.conversationId,
    );

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: prompt,
      },
    });

    // Preserve existing multi-LLM + judge pipeline
    const rawResponses = await this.llmService.askAll(prompt);
    const validResponses = rawResponses.filter(
      (r) => r && typeof r.answer === 'string' && r.answer.trim().length > 0,
    );

    if (!validResponses.length) {
      const errorText = 'No LLM responded';
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'ai',
          content: errorText,
        },
      });
      await this.touchConversation(conversation.id);

      return {
        conversationId: conversation.id,
        prompt,
        error: errorText,
        answer: errorText,
        selectedBy: null,
      };
    }

    const judgeResult = await this.judgeService.judge(prompt, validResponses);
    const index =
      typeof judgeResult.best_answer_index === 'number'
        ? judgeResult.best_answer_index
        : 0;
    const best = validResponses[index] ?? validResponses[0];

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ai',
        content: best.answer,
        selectedBy: best.model,
      },
    });
    await this.touchConversation(conversation.id);

    return {
      conversationId: conversation.id,
      prompt,
      selectedBy: best.model,
      answer: best.answer,
    };
  }

  private async resolveConversation(
    userId: string,
    prompt: string,
    conversationId?: string,
  ) {
    if (conversationId) {
      const existing = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!existing) {
        throw new NotFoundException('Conversation not found');
      }

      if (existing.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      return existing;
    }

    const title =
      prompt.length > 40 ? `${prompt.slice(0, 40).trim()}...` : prompt;

    return this.prisma.conversation.create({
      data: {
        userId,
        title,
      },
    });
  }

  private touchConversation(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }
}
