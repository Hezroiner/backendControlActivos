import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolService } from './rol/rol.service';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const rolSeedService = app.get(RolService);
  await rolSeedService.onApplicationBootstrap();

  const userSeedService = app.get(UserService);
  await userSeedService.onApplicationBootstrap();
      // Configuración de CORS
  app.enableCors({
    origin: ['https://frontend-ctp-s3ev.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  await app.listen(3000);
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}

bootstrap();