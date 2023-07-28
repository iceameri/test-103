import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../provider/user.service';
import { TypeOrmExModule } from '../common/typeorm-ex.module';
import { UserRepository } from '../repository/user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
