import { Module } from '@nestjs/common';
import { HashingService } from './services/hashing/hashing.service';

@Module({
    imports: [],
    controllers: [],
    providers: [HashingService],
    exports: [HashingService],
})
export class HashingModule {}
