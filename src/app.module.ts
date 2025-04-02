// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { dataSource } from './credentials';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MorganMiddleware } from './utils/morgan.middleware';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options, 
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}