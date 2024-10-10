import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ISmsTemplate {
  id: string;
  title: string;
  content: string;
  userId : string
  createdAt: Date;
  updatedAt: Date;
}

export const SmsTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId  : z.string(),
});

export const CreateSmsTemplateSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
});

export const GetSmsTemplateSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteSmsTemplateSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateSmsTemplateRequest = z.infer<typeof CreateSmsTemplateSchema>;