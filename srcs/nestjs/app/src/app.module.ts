import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
	imports: [
		ConfigurationModule,
		UsersModule,
		AuthenticationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
