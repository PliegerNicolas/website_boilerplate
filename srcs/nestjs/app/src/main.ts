import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger.config';
import helmet from 'helmet';
import { HelmetConfig } from './config/helmet.config';
import { CorsConfigService } from './config/cors-config/cors-config.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port: number = parseInt(process.env.PORT || '3000', 10);

	app.setGlobalPrefix('api');
	app.enableCors(app.get(CorsConfigService).getCorsOptions());	// Should get tested
	app.use(helmet(HelmetConfig));									// Should get tested

	configureSwagger(app);

	await app.listen(port);
}
bootstrap();
