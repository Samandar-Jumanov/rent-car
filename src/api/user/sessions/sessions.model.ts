import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Sessions model
export interface ISessions {
  id: string;
  agentId: string;
  location: string;
  isOwner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const SessionsSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  location: z.string(),
  isOwner: z.boolean(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const CreateSessionsSchema = z.object({
  agentId: z.string(),
  location: z.string(),
  isOwner: z.boolean(),
});

export const GetSessionsSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateSessionsSchema = z.object({
  agentId: z.string().optional(),
  location: z.string().optional(),
  isOwner: z.boolean().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type CreateSessionsRequest = z.infer<typeof CreateSessionsSchema>;
export type UpdateSessionsRequest = z.infer<typeof UpdateSessionsSchema>;