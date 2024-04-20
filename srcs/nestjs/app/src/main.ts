import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port: number = parseInt(process.env.PORT || '3000', 10);

	configureSwagger(app);
	app.setGlobalPrefix('api');

	await app.listen(port);
}
bootstrap();
