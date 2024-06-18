import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger-config/swagger.config';
import helmet from 'helmet';
import { HelmetConfig } from './config/helmet-config/helmet.config';
import { CorsConfigService } from './config/cors-config/cors-config.service';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './utils/filters/typeorm/typeorm.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port: number = parseInt(process.env.PORT || '3000', 10);

	app.enableCors(app.get(CorsConfigService).getCorsOptions());	// Should get tested
	app.use(helmet(HelmetConfig));									// Should get tested
	// Implement CSRF protection

	app.setGlobalPrefix('api');
	app.use(cookieParser());
	app.useGlobalFilters(new TypeORMExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true,
		forbidNonWhitelisted: true,
		transformOptions: { enableImplicitConversion: true },
	})),

	configureSwagger(app);

	await app.listen(port);
}
bootstrap();
