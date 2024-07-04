import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { GroceryModule } from './grocery/grocery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database.service';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GroceryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: 5432,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js'],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [DatabaseService, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    await this.databaseService.createDatabaseIfNotExists();
  }
}
