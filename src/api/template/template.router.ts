import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { SmsTemplateSchema, CreateSmsTemplateSchema, GetSmsTemplateSchema, DeleteSmsTemplateSchema } from "./template.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { smsTemplateController } from "./template.controller";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const smsTemplateRegistry = new OpenAPIRegistry();
export const smsTemplateRouter: Router = express.Router();

smsTemplateRegistry.register("SmsTemplate", SmsTemplateSchema);

smsTemplateRegistry.registerPath({
  method: "get",
  path: "/sms-templates",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
  tags: ["SmsTemplate"],
  responses: createApiResponse(z.array(SmsTemplateSchema), "Success"),
});

smsTemplateRouter.get("/", authMiddleware, smsTemplateController.getSmsTemplates);

smsTemplateRegistry.registerPath({
  method: "get",
  path: "/sms-templates/{id}",
  tags: ["SmsTemplate"],
  request: { params: GetSmsTemplateSchema.shape.params },
  responses: createApiResponse(SmsTemplateSchema, "Success"),
});

smsTemplateRouter.get("/:id", authMiddleware, checkRole(["SUPER_ADMIN"]),
  validateRequest(GetSmsTemplateSchema), smsTemplateController.getSmsTemplate);

smsTemplateRegistry.registerPath({
  method: "post",
  path: "/sms-templates",
  tags: ["SmsTemplate"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateSmsTemplateSchema
        }
      }
    }
  },
  responses: createApiResponse(SmsTemplateSchema, "Success"),
});

smsTemplateRouter.post("/", authMiddleware, checkRole(["SUPER_ADMIN"]),
  validateRequest(z.object({ body: CreateSmsTemplateSchema })), smsTemplateController.createSmsTemplate);

smsTemplateRegistry.registerPath({
  method: "delete",
  path: "/sms-templates/{id}",
  tags: ["SmsTemplate"],
  request: { params: DeleteSmsTemplateSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

smsTemplateRouter.delete("/:id", authMiddleware, checkRole(["SUPER_ADMIN"]),
  validateRequest(DeleteSmsTemplateSchema), smsTemplateController.deleteSmsTemplate);