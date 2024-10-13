import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { FeatureSchema, CreateFeatureSchema, GetFeatureSchema, UpdateFeatureSchema, ApplyFeatureSchema } from "./feature.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { featureController } from "./feature.controller";
import { upload } from "../aws/multer.service";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const featureRegistry = new OpenAPIRegistry();
export const featureRouter: Router = express.Router();

featureRegistry.register("Feature", FeatureSchema);

featureRegistry.registerPath({
  method: "get",
  path: "/features",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
  tags: ["Feature"],
  responses: createApiResponse(z.array(FeatureSchema), "Success"),
});

featureRouter.get("/", featureController.getFeatures);

featureRegistry.registerPath({
  method: "get",
  path: "/features/{id}",
  tags: ["Feature"],
  request: { params: GetFeatureSchema.shape.params },
  responses: createApiResponse(FeatureSchema, "Success"),
});

featureRouter.get("/:id", validateRequest(GetFeatureSchema), featureController.getFeature);

featureRegistry.registerPath({
  method: "post",
  path: "/features",
  tags: ["Feature"],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
               type : "object", 
               properties : {
                  title : { type : "string",  },
                  icon : { type: "string", format: "binary"} 
               }
          }
        }
      }
    }
  },
  responses: createApiResponse(FeatureSchema, "Success"),
});

featureRouter.post("/",  upload.single("icon") ,  validateRequest(z.object({ body : z.object({ title : z.string()})})), featureController.createFeature);


featureRegistry.registerPath({
  method: "patch",
  path: "/features/apply",
  tags: ["Feature"],
  request: {
      body: {
        content: {
          'application/json': {
            schema: ApplyFeatureSchema
          }
        }
      }
    },
    
  responses: createApiResponse(z.array(FeatureSchema), "Success"),
});

featureRouter.patch("/apply", validateRequest(z.object({ body : ApplyFeatureSchema })), featureController.applyFeature); 

featureRegistry.registerPath({
  method: "put",
  path: "/features/{id}",
  tags: ["Feature"],
  request: {
    params: GetFeatureSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: {
               type : "object", 
               properties : {
                  title : { type : "string",  },
               }
          }
        }
      }
    }
  },
  responses: createApiResponse(FeatureSchema, "Success"),
});

featureRouter.put("/:id", validateRequest(z.object({ body : z.object({ title : z.string()})})),  featureController.updateFeature);

featureRegistry.registerPath({
  method: "delete",
  path: "/features/{id}",
  tags: ["Feature"],
  request: { params: GetFeatureSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

featureRouter.delete("/:id",  validateRequest(GetFeatureSchema), featureController.deleteFeature);

