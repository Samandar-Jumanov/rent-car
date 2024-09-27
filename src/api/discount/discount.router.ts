import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { DiscountSchema, CreateDiscountSchema, GetDiscountSchema, DeleteDiscountSchema } from "./discount.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { discountController } from "./discount.controller";
import { authMiddleware } from "@/common/middleware/auth";

export const discountRegistry = new OpenAPIRegistry();
export const discountRouter: Router = express.Router();

discountRegistry.register("Discount", DiscountSchema);

discountRegistry.registerPath({
  method: "get",
  path: "/discounts",
  tags: ["Discount"],
  responses: createApiResponse(z.array(DiscountSchema), "Success"),
});

discountRouter.get("/", discountController.getDiscounts);

discountRegistry.registerPath({
  method: "get",
  path: "/discounts/{id}",
  tags: ["Discount"],
  request: { params: GetDiscountSchema.shape.params },
  responses: createApiResponse(DiscountSchema, "Success"),
});

discountRouter.get("/:id", validateRequest(GetDiscountSchema), discountController.getDiscount);

discountRegistry.registerPath({
  method: "post",
  path: "/discounts",
  tags: ["Discount"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateDiscountSchema
        }
      }
    }
  },
  responses: createApiResponse(DiscountSchema, "Success"),
});

discountRouter.post("/", authMiddleware, validateRequest(CreateDiscountSchema), discountController.createDiscount);

discountRegistry.registerPath({
  method: "delete",
  path: "/discounts/{id}",
  tags: ["Discount"],
  request: { params: DeleteDiscountSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

discountRouter.delete("/:id", authMiddleware, validateRequest(DeleteDiscountSchema), discountController.deleteDiscount);