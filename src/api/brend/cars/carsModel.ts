import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ICar {
  id: string;
  brendId: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  color: string;
  fuelType: string;
  description: string;
  carType: string;
  gearType: string;
  numberOfDoors: number;
  numberOfSeats: number;
  transmissionType: string;
  engineCapacity: string;
  enginePower: number;
  isAvailable: boolean;
  isTopRent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CarSchema = z.object({
  id: z.string(),
  brendId: z.string(),
  model: z.string(),
  year: z.number().int(),
  mileage: z.number().int(),
  price: z.number(),
  color: z.string(),
  fuelType: z.string(),
  description: z.string(),
  carType: z.string(),
  gearType: z.string(),
  numberOfDoors: z.number().int(),
  numberOfSeats: z.number().int(),
  transmissionType: z.string(),
  engineCapacity: z.string(),
  enginePower: z.number().int(),
  isAvailable: z.boolean(),
  isTopRent: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCarSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateCarSchema = z.object({
  brendId: z.string(),
  model: z.string(),
  year: z.number().int(),
  mileage: z.number().int(),
  price: z.number(),
  color: z.string(),
  fuelType: z.string(),
  description: z.string(),
  carType: z.string(),
  gearType: z.string(),
  numberOfDoors: z.number().int(),
  numberOfSeats: z.number().int(),
  transmissionType: z.string(),
  engineCapacity: z.string(),
  enginePower: z.number().int(),
});

export const UpdateCarSchema = z.object({
  model: z.string().optional(),
  year: z.number().int().optional(),
  mileage: z.number().int().optional(),
  price: z.number().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  description: z.string().optional(),
  carType: z.string().optional(),
  gearType: z.string().optional(),
  numberOfDoors: z.number().int().optional(),
  numberOfSeats: z.number().int().optional(),
  transmissionType: z.string().optional(),
  engineCapacity: z.string().optional(),
  enginePower: z.number().int().optional(),
  isAvailable: z.boolean().optional(),
  isTopRent: z.boolean().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type UpdateCarRequest = z.infer<typeof UpdateCarSchema>;
export type CreateCarRequest = z.infer<typeof CreateCarSchema>;