import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export enum Role {
      ADMIN="ADMIN",
      USER="USER",
      SUPER_ADMIN="SUPER_ADMIN"
}

export interface IUser {
  id: string;
  phoneNumber: string;
  name ?  : string | undefined;
  surname  ? : string| undefined;
  birthday ? : string | undefined;
  createdAt: Date;
  updatedAt: Date;
  verificationCode?: string | null;
  isVerified: boolean;
}

export const UserSchema = z.object({
  id: z.string(),
  phoneNumber: z.string(),
  name: z.string(),
  surname: z.string(),
  birthday: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  verificationCode: z.string().nullable(),
  isVerified: z.boolean(),
});

export const GetUserSchema = z.object({
  params: z.object({ id  : z.string() }),
});

export const CreateUserSchema = z.object({
  phoneNumber: z.string(),
  password : z.string().optional(),
});


export const VerifyUserSchema = z.object({
  code: z.string(),
  phoneNumber: z.string(),
});

export const UpdateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    surname: z.string().min(1).max(100).optional(),
    birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }).refine(data => Object.values(data).some(value => value !== undefined), {
    message: "At least one field must be provided for update"
  });


export  const RefreshtokenSchema = z.object({
       refreshToken : z.string()
})

export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>
export type VerifyUserSchemaRequest = z.infer<typeof VerifyUserSchema>
export type Refreshtoken = z.infer<typeof RefreshtokenSchema >