-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Conversation";

-- DropEnum
DROP TYPE "MessageRole";

-- CreateTable
CREATE TABLE "chat_history" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" UUID NOT NULL,
    "chatHistoryId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_data" (
    "id" UUID NOT NULL,
    "chatHistoryId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "selectedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_history_userId_updatedAt_idx" ON "chat_history"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "conversation_chatHistoryId_createdAt_idx" ON "conversation"("chatHistoryId", "createdAt");

-- CreateIndex
CREATE INDEX "response_data_chatHistoryId_createdAt_idx" ON "response_data"("chatHistoryId", "createdAt");

-- CreateIndex
CREATE INDEX "response_data_conversationId_createdAt_idx" ON "response_data"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_chatHistoryId_fkey" FOREIGN KEY ("chatHistoryId") REFERENCES "chat_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_data" ADD CONSTRAINT "response_data_chatHistoryId_fkey" FOREIGN KEY ("chatHistoryId") REFERENCES "chat_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_data" ADD CONSTRAINT "response_data_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
