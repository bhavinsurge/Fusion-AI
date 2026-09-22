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
    // dto.conversationId is the chat session (chat_history) id from the client
    const chatHistory = await this.resolveChatHistory(
      userId,
      prompt,
      dto.conversationId,
    );

    const conversation = await this.prisma.conversation.create({
      data: {
        chatHistoryId: chatHistory.id,
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
      await this.prisma.responseData.create({
        data: {
          chatHistoryId: chatHistory.id,
          conversationId: conversation.id,
          content: errorText,
        },
      });
      await this.touchChatHistory(chatHistory.id);

      return {
        conversationId: chatHistory.id,
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

    await this.prisma.responseData.create({
      data: {
        chatHistoryId: chatHistory.id,
        conversationId: conversation.id,
        content: best.answer,
        selectedBy: best.model,
      },
    });
    await this.touchChatHistory(chatHistory.id);

    return {
      conversationId: chatHistory.id,
      prompt,
      selectedBy: best.model,
      answer: best.answer,
    };
  }

  private async resolveChatHistory(
    userId: string,
    prompt: string,
    chatHistoryId?: string,
  ) {
    if (chatHistoryId) {
      const existing = await this.prisma.chatHistory.findUnique({
        where: { id: chatHistoryId },
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

    return this.prisma.chatHistory.create({
      data: {
        userId,
        title,
      },
    });
  }

  private touchChatHistory(chatHistoryId: string) {
    return this.prisma.chatHistory.update({
      where: { id: chatHistoryId },
      data: { updatedAt: new Date() },
    });
  }
}
