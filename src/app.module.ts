import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/typeorm.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(postgresConfig),
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
