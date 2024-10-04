import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

// Import registry modules
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { brendRegistry } from "@/api/brend/brendRouter";
import { discountRegistry } from "@/api/discount/discount.router";
import { featureRegistry } from "@/api/feature/feature.router";
import { requirementsRegistry } from "@/api/requirements/requirement.router";
import { favoriteRegistry } from "@/api/favorite/favorite.router";
import { collaboratedCarsRegistry } from "@/api/colloborate/colloborate.router";
import { bannersRegistry } from "@/api/banners/banners.router";
import { modelRegistry } from "@/api/models/models.router";
import { carBrendRegistry } from "@/api/carBrend/car-brend.router";
import { carColorRegistry } from "@/api/carColor/colors.router";
import { smsTemplateRegistry } from "@/api/template/template.router";
import { requestRegistry } from "@/api/requests/request.router";

export function generateOpenAPIDocument() {
  // Combine all registries
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    brendRegistry,
    discountRegistry,
    featureRegistry,
    requirementsRegistry,
    favoriteRegistry,
    collaboratedCarsRegistry,
    bannersRegistry,
    modelRegistry,
    carBrendRegistry,
    carColorRegistry,
    smsTemplateRegistry,
    requestRegistry
  ]);

  // Register the security scheme
  registry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  // Create OpenAPI generator
  const generator = new OpenApiGeneratorV3(registry.definitions);

  // Generate and return the OpenAPI document
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