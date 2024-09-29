import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { brendRegistry } from "@/api/brend/brendRouter";
import { discountRegistry } from "@/api/discount/discount.router";
import { featureRegistry } from "@/api/feature/feature.router";
import { requirementsRegistry } from "@/api/requirements/requirement.router";
import { favoriteRegistry } from "@/api/favorite/favorite.router";
import { collaboratedCarsRegistry } from "@/api/colloborate/colloborate.router";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, brendRegistry , discountRegistry , featureRegistry , requirementsRegistry , favoriteRegistry , collaboratedCarsRegistry]);

  // Register the security scheme
  registry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    security: [{ BearerAuth: [] }],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}