import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS manualmente
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://frontend-ctp-s3ev.vercel.app/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Responder a solicitudes preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}

bootstrap();