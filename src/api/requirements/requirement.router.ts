import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { object, z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RequirementsSchema, CreateRequirementsSchema, GetRequirementsSchema, UpdateRequirementsSchema, ApplyRequirementsSchema } from "./requirement.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { requirementsController } from "./requirement.controller";

export const requirementsRegistry = new OpenAPIRegistry();
export const requirementsRouter: Router = express.Router();

requirementsRegistry.register("Requirements", RequirementsSchema);

requirementsRegistry.registerPath({
  method: "get",
  path: "/requirements",
  tags: ["Requirements"],
  responses: createApiResponse(z.array(RequirementsSchema), "Success"),
});

requirementsRouter.get("/", requirementsController.getRequirements);

requirementsRegistry.registerPath({
  method: "get",
  path: "/requirements/{id}",
  tags: ["Requirements"],
  request: { params: GetRequirementsSchema.shape.params },
  responses: createApiResponse(RequirementsSchema, "Success"),
});

requirementsRouter.get("/:id", validateRequest(GetRequirementsSchema), requirementsController.getRequirement);

requirementsRegistry.registerPath({
  method: "post",
  path: "/requirements",
  tags: ["Requirements"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateRequirementsSchema
        }
      }
    }
  },
  responses: createApiResponse(RequirementsSchema, "Success"),
});

requirementsRouter.post("/",  validateRequest(z.object({ body : CreateRequirementsSchema})), requirementsController.createRequirements);

requirementsRegistry.registerPath({
  method: "put",
  path: "/requirements/{id}",
  tags: ["Requirements"],
  request: {
    params: GetRequirementsSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateRequirementsSchema
        }
      }
    }
  },
  responses: createApiResponse(RequirementsSchema, "Success"),
});

requirementsRouter.put("/:id",  validateRequest(z.object({ body : UpdateRequirementsSchema})), requirementsController.updateRequirements);

requirementsRegistry.registerPath({
  method: "delete",
  path: "/requirements/{id}",
  tags: ["Requirements"],
  request: { params: GetRequirementsSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

requirementsRouter.delete("/:id",  validateRequest(GetRequirementsSchema), requirementsController.deleteRequirements);


requirementsRegistry.registerPath({
    method: "put",
    path: "/requirements/apply",
    tags: ["Requirements"],
    request : {
          body : {
            content: {
                'application/json': {
                  schema: ApplyRequirementsSchema
                }
              }
          }
    },
    responses: createApiResponse(z.array(RequirementsSchema), "Success"),
  });
  
  requirementsRouter.delete("/apply",  validateRequest(ApplyRequirementsSchema), requirementsController.applyRequirements);