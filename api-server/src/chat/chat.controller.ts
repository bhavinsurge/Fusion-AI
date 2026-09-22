import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/types';
import { ChatService } from './chat.service';
import { ConversationsService } from './conversations.service';
import { ChatDto } from './dto/chat.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly conversationsService: ConversationsService,
  ) {}

  @Post('chat')
  chat(@CurrentUser() user: AuthUser, @Body() dto: ChatDto) {
    return this.chatService.chat(user.userId, dto);
  }

  @Get('conversations')
  listConversations(@CurrentUser() user: AuthUser) {
    return this.conversationsService.listForUser(user.userId);
  }

  @Get('conversations/:id')
  getConversation(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.conversationsService.getForUser(user.userId, id);
  }

  @Delete('conversations')
  clearConversations(@CurrentUser() user: AuthUser) {
    return this.conversationsService.clearAllForUser(user.userId);
  }

  @Delete('conversations/:id')
  deleteConversation(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.conversationsService.deleteForUser(user.userId, id);
  }
}
