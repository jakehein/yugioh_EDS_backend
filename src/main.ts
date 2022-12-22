import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Yu-Gi-Oh EDS').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      deepLinking: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  throw err;
});
