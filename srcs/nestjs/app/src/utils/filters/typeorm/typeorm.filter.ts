import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter<T> implements ExceptionFilter {

	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const ctx: HttpArgumentsHost = host.switchToHttp();
		const response: Response = ctx.getResponse();
		const request: Request = ctx.getRequest();

		console.log(exception.driverError);

		// These variables are specific to PostgreSQL.
		let detail: string = (exception.driverError as any).detail;
		if (detail.endsWith('.')) detail = detail.slice(0, -1);
		let table: string = `on table ${(exception.driverError as any).table}.`;
		let code: string = (exception.driverError as any).code;

		const message: string = [detail, table].join(' ');
		const error: string = `Query failed (${code})`;
		const statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY;

		response.status(statusCode).json({
			message,
			error,
			statusCode,
		});

	}
}