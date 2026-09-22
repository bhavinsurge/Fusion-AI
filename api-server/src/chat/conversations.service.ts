import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getForUser(userId: string, chatHistoryId: string) {
    const chatHistory = await this.prisma.chatHistory.findUnique({
      where: { id: chatHistoryId },
      include: {
        conversations: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            responseData: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                content: true,
                selectedBy: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!chatHistory) {
      throw new NotFoundException('Conversation not found');
    }

    if (chatHistory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Flatten user turns + AI replies into the messages shape the frontend expects
    const messages = chatHistory.conversations.flatMap((turn) => {
      const userMessage = {
        id: turn.id,
        role: 'user' as const,
        content: turn.content,
        selectedBy: null as string | null,
        createdAt: turn.createdAt,
      };

      const aiMessages = turn.responseData.map((response) => ({
        id: response.id,
        role: 'ai' as const,
        content: response.content,
        selectedBy: response.selectedBy,
        createdAt: response.createdAt,
      }));

      return [userMessage, ...aiMessages];
    });

    return {
      id: chatHistory.id,
      title: chatHistory.title,
      userId: chatHistory.userId,
      createdAt: chatHistory.createdAt,
      updatedAt: chatHistory.updatedAt,
      messages,
    };
  }

  async clearAllForUser(userId: string) {
    await this.prisma.chatHistory.deleteMany({ where: { userId } });
    return { success: true };
  }

  async deleteForUser(userId: string, chatHistoryId: string) {
    await this.getForUser(userId, chatHistoryId);
    await this.prisma.chatHistory.delete({ where: { id: chatHistoryId } });
    return { success: true };
  }
}
