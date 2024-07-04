import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroceryController } from './grocery.controller';
import { GroceryService } from './grocery.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryItem } from './grocery.entity';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_key_by_org',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([GroceryItem]),
  ],
  controllers: [GroceryController],
  providers: [GroceryService, AuthService],
})
export class GroceryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/grocery');
  }
}
