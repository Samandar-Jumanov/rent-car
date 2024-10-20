import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { object, z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RequirementsSchema, CreateRequirementsSchema, GetRequirementsSchema, UpdateRequirementsSchema, ApplyRequirementsSchema } from "./requirement.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { requirementsController } from "./requirement.controller";
import { upload } from "../supabase/multer.service";

export const requirementsRegistry = new OpenAPIRegistry();
export const requirementsRouter: Router = express.Router();

requirementsRegistry.register("Requirements", RequirementsSchema);

requirementsRegistry.registerPath({
  method: "get",
  path: "/requirements",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
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
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
            icon: { type: "string", format: "binary"  },
            title: { type: "string" },
            value : { type: "string" }
              },
             required : [ 'title' , "icon" , "value"]
          }
        }
      }
    }
  },
  responses: createApiResponse(RequirementsSchema, "Success"),
});

requirementsRouter.post("/",  upload.single("icon") ,  validateRequest(z.object({ body : CreateRequirementsSchema})), requirementsController.createRequirements);

requirementsRegistry.registerPath({
  method: "patch",
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

requirementsRouter.patch("/apply",   requirementsController.applyRequirements); // not working

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

requirementsRouter.put("/:id",   requirementsController.updateRequirements);

requirementsRegistry.registerPath({
  method: "delete",
  path: "/requirements/{id}",
  tags: ["Requirements"],
  request: { params: GetRequirementsSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

requirementsRouter.delete("/:id",  validateRequest(GetRequirementsSchema), requirementsController.deleteRequirements);


