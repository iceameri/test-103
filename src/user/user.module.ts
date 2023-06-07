import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../common/typeorm-ex.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
