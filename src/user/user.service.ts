import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email } = createUserDto;

    const user = new User(username, email);
    await this.userRepository.insert(user);

    // await this.userRepository.save(user);
    return user;
  }
}
