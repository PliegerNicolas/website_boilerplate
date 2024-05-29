import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HashingModule } from './utils/hashing/hashing.module';

@Module({
	imports: [
		ConfigurationModule,
		HashingModule,
		AuthenticationModule,
		UsersModule,
	],
	controllers: [],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
	],
})
export class AppModule {}
