import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';

const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    resolve(
      __dirname,
      '..',
      '..',
      'modules',
      '**',
      'entity',
      '*.entity.{ts,js}',
    ),
  ],
  migrations: [resolve(__dirname, '..', 'migrations', '*.{ts,js}')],
  cli: {
    migrationsDir: join('src', 'database', 'migrations'),
  },
};

module.exports = typeOrmOptions;
