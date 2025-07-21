import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ReviewsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
