import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER } from './shared/const/constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .addServer(process.env.SWAGGER_BASEPATH)
    .setTitle(process.env.SWAGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESC)
    .setVersion(process.env.SWAGGER_VERSION)
    .addTag(process.env.SWAGGER_TAG)
    .addApiKey(
      { type: SWAGGER.TYPE, name: SWAGGER.NAME, in: SWAGGER.IN },
      SWAGGER.AUTH,
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(process.env.SWAGGER_DOC_PATH, app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  console.log('process.env.PORT', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
