import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
      // Configuración de CORS
  app.enableCors({
    origin: 'https://frontend-ctp-s3ev.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  await app.listen(3000);
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}

bootstrap();