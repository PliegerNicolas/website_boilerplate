import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigOptions } from './config/options.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './config/typeorm-config/typeorm-config.service';
import { CorsConfigService } from './config/cors-config/cors-config.service';

@Module({
	imports: [
		ConfigModule.forRoot(ConfigOptions),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: TypeormConfigService,
		}),
	],
	controllers: [AppController],
	providers: [AppService, TypeormConfigService, CorsConfigService],
})
export class AppModule {}
