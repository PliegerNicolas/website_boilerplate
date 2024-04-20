import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function configureSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Default API title (go to /nestjs/src/config/swagger.config.ts to update)')
        .setDescription('Default API description (go to /nestjs/src/config/swagger.config.ts to update)')
        .setVersion('1.0')
        .addTag('')
        .build();
  
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}