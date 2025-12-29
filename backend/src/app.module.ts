// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LlmModule } from './llm/llm.module';
import { FilterModule } from './filter/filter.module';
import { JudgeModule } from './judge/judge.module';

@Module({
  imports: [LlmModule, FilterModule, JudgeModule],
  controllers: [AppController],
})
export class AppModule {}
  