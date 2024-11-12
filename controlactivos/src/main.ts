import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.enableCors({
    origin: 'https://frontend-ctp-s3ev.vercel.app/', // URL de tu frontend
    methods: ['GET', 'HEAD','PATCH', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  });



  await app.listen(3000);
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}

bootstrap();
