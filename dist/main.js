"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Yu-Gi-Oh EDS')
        .setDescription('API for YGO Eternal Duelist Soul companion program')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        name: 'Authorization',
        description: 'access-token',
        in: 'Header',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            deepLinking: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
    app.enableCors({
        origin: '*',
    });
    await app.listen(8080);
}
bootstrap().catch((err) => {
    console.error(err);
    throw err;
});
//# sourceMappingURL=main.js.map