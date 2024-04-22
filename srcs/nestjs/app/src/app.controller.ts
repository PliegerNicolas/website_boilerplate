import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimit, RateLimiterGuard } from 'nestjs-rate-limiter';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@RateLimit({ points: 10, duration: 60 })
	@Get('hello')
	getHello(): string {
		return this.appService.getHello();
	}
}
