<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

1. 프로젝트 생성
2. user, board 생성
   $ nest g mo user
   $ nest g co user
   $ nest g s user
3. typeORM installation
   $ yarn add --save @nestjs/typeorm typeorm pg

   npm i npm start

4. npm install nodemon --save-dev $ npm run server 명령어로 실행

최근 nestjs에 관심이 생겨 일단 crud 기본 포맷만 만들어보자는 생각에 프로젝트를 시작해보았다. 제목은 간단하지만 typeorm 버전이 3으로 업데이트 되면서 @entityrepository가 deprecated됨에 따라 엄청난 난관이였다.

//typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';

export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres', //Database 설정
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '1234',
  database: 'popo',
  entities: [__dirname + '/../entity/*.entity.ts', User], // Entity 연결
  synchronize: true, //true 값을 설정하면 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블을 Drop한 후 다시 생성해준다.
};

// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/typeorm.config';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(postgresConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
많은 레퍼런스들을 찾았지만 config파일을 이용하여 데이터베이스를 관리하는 것이 가장 효율적이다. 하지만 .env로 분리하지는 않았다.
entities 에 앞에 있는 경로를 읽지 못하여 User를 직접 주입한다.
@Entityrepository -> @CustomRepository 으로의 변환
service에서 Repository를 바로 사용하는 느낌의 참고 자료들도 있었으나 모두 실패로 돌아갔다. 많은 코드들을 참여하다보니 나중에 되돌아갈 방법조차 잊었을때 마음이 꺽였지만 마지막으로 해보자는 마음으로 시작하여 데이터베이스에 저장에 성공할 수 있게 되었다.

//typeorm-ex.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const TYPEORM_EX_CUSTOM_REPOSITORY = 'TYPEORM_EX_CUSTOM_REPOSITORY';

// eslint-disable-next-line @typescript-eslint/ban-types
export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}

//typeorm-ex.module.ts
import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './typeorm-ex.decorator';

export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        repository,
      );

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
//user.repository.ts
import { CustomRepository } from '../common/typeorm-ex.decorator';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
@Entityrepository를 사용할 수 없게 됨에 따라 해당 코드를 그대로 가져와 커스텀한 느낌을 받았다.
ypeOrmModule을 extends 하여 기존에 사용하고있는 *.repository.ts 들을 그대로 사용하여 수정을 최소화한다.
PostgreSQL dockerize
version: '3.8'
services:
  mongodb:
    image: mongo
    container_name: test-mongodb
    restart: always
    ports:
      - 27017:27017
    volumes:
      - ./data/db/mongo:/var/lib/db/mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 1234
      MONGO_INITDB_DATABASE: mongo

  postgresql:
    image: postgres
    restart: always
    container_name: test-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: postgres
    # 볼륨 설정
    volumes:
      - ./data/db/postgres/:/var/lib/db/postgresql
$ docker compose up -d 컨테이너를 실행하여 데이터베이스를 띄운다.
