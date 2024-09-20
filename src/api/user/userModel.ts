import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export interface User {
  id: number;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  verificationCode?: string;
  isVerified: boolean;
}


export const UserSchema = z.object({
  id: z.number(),
  phoneNumber : z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  verificationCode  : z.string().nullable(),
  isVerified: z.boolean(), 
});

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});



export const CreateUserSchema = z.object({
  phoneNumber: z.string(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>

export const VerifyUserSchema = z.object({
  code: z.string(),
  phoneNumber: z.string(),
});

export type VerifyUserSchemaRequest = z.infer<typeof VerifyUserSchema>
