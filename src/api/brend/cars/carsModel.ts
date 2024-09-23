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

export const RentalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  carId: z.string(),

  username: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  address: z.string(),
  passport : z.string(),

  rentalStart: z.date(),
  rentalEnd: z.date(),
  pickupTime: z.string(),
  returnTime: z.string(),

  requiresDriver: z.boolean(),
  requiresDelivery: z.boolean(),

  travelRegion: z.string(),
  estimatedDistance: z.string(),
  
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),

});

export const GetRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateRentalSchema = z.object({
  username: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  address: z.string(),
  passport : z.string(),

  rentalStart: z.date(),
  rentalEnd: z.date(),
  pickupTime: z.string(),
  returnTime: z.string(),

  requiresDriver: z.boolean().default(false),
  requiresDelivery: z.boolean().default(false),
  travelRegion: z.string(),
  estimatedDistance: z.string(),
});

export const DeleteRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateRentalRequest = z.infer<typeof CreateRentalSchema>;
export type DeleteRentalRequest = z.infer<typeof DeleteRentalSchema>;
export type IRental = z.infer<typeof CreateRentalSchema>