import { Module } from '@nestjs/common';
import { LLMController } from './llm.controller';
import { LLMService } from './llm.service';
@Module({
    controllers: [LLMController],
    providers: [LLMService],
})
export class LLMModule { }
