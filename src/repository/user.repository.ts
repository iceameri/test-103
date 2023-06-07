import { CustomRepository } from '../common/typeorm-ex.decorator';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
