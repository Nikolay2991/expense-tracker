import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

/**
 * Точка входа backend: поднимает Nest-приложение, настраивает глобальную валидацию,
 * префикс `/api`, CORS и (вне production) Swagger-документацию на `/api/docs`.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: config.get<string>("FRONTEND_URL", "http://localhost:3000"),
  });

  if (config.get<string>("NODE_ENV", "development") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Expense Tracker API")
      .setDescription("REST API для учёта доходов и расходов")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, swaggerDocument);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error("Не удалось запустить backend:", err);
  process.exit(1);
});
