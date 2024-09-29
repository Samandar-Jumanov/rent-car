import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// BlockedUsers model
export interface IBlockedUsers {
  id: string;
  adminId: string;
  blockedUserId: string;
  blockedByAdmin: boolean;
}

export const AdminBlockUser = z.object({
  id: z.string(),
  adminId: z.string(),
  blockedUserId: z.string(),
});

export const CreateBlockedUsersSchema = z.object({
  blockedUserId: z.string(),
});

export const GetBlockedUsersSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateBlockedUsersSchema = z.object({
  adminId: z.string().optional(),
  blockedUserId: z.string().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

// AgentBlock model
export interface IAgentBlock {
  id: string;
  agentId: string;
  userId: string;
  createdAt: Date;
}

export const AgentBlockSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  userId: z.string(),
});

export const CreateAgentBlockSchema = z.object({
  userId: z.string(),
});

export const GetAgentBlockSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateAgentBlockSchema = z.object({
  agentId: z.string().optional(),
  userId: z.string().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type CreateBlockedUsersRequest = z.infer<typeof CreateBlockedUsersSchema>;
export type UpdateBlockedUsersRequest = z.infer<typeof UpdateBlockedUsersSchema>;
export type CreateAgentBlockRequest = z.infer<typeof CreateAgentBlockSchema>;
export type UpdateAgentBlockRequest = z.infer<typeof UpdateAgentBlockSchema>;