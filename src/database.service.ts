// database.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

@Injectable()
export class DatabaseService {
  constructor(private readonly connection: Connection) {}

  async createDatabaseIfNotExists(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const hasDatabase = await queryRunner.hasDatabase(
        process.env.PG_DATABASE,
      );

      if (!hasDatabase) {
        await queryRunner.createDatabase(process.env.PG_DATABASE, true);
      }
    } catch (error) {
      console.error('Error creating database:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
