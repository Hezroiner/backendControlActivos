import { Module } from '@nestjs/common';
import { LeyService } from './ley.service';
import { LeyController } from './ley.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ley } from '@app/Entities/ley.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ley])],
  providers: [LeyService],
  controllers: [LeyController],
  exports:[LeyService]
})
export class LeyModule {}
