import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserSchema, CreateUserSchema, VerifyUserSchema, UpdateUserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema); // register

userRegistry.registerPath({ // get all 
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({ // get single 
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({  // create user 
  method: "post",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/", userController.createUser);

userRegistry.registerPath({ // verify user
  method: "patch",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyUserSchema
        }
      }
    }
  },

  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.patch("/", userController.verifyUser);


userRegistry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string"
      }
    }
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.put("/:id", userController.updateUser);
