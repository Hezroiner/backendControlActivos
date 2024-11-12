import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  

  app.use(cors({
    origin: 'https://frontend-ctp-s3ev.vercel.app', // Cambia esto por la URL de tu frontend
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    credentials: true, // Si necesitas enviar cookies o encabezados personalizados
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}

bootstrap();
