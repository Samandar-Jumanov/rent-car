import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ICar {
  id: string;
  brendId: string;
  title: string;
  price: string;
  color: string;
  fuelType: string;
  carType: string;
  numberOfSeats: number;
  features: string[];
  requirements: string[];
  isAvailable: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const CarSchema = z.object({
  id: z.string(),
  brendId: z.string(),
  title: z.string(),
  price: z.string(),
  color: z.string(),
  fuelType: z.string(),
  carType: z.string(),
  numberOfSeats: z.number().int(),
  features: z.array(z.string()),
  requirements: z.array(z.string()),
  isAvailable: z.boolean(),
  images: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCarSchema = z.object({
  params: z.object({ id: z.string() }),
});

// Rental Schema and Interface
export interface IRental {
  id: string;
  userId: string;
  carId: string;
  rentalStart: Date;
  rentalEnd: Date;
  pickupTime: string;
  returnTime: string;
  requiresDriver: boolean;
  requiresDelivery: boolean;
  travelRegion: string;
  estimatedDistance: string;
  username: string;
  surname: string;
  usersFatherName: string;
  driverLicence: string;
  passport: string;
  address: string;
  passportImages: string[];
  driverLicenceImages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RentalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  carId: z.string(),
  rentalStart: z.date(),
  rentalEnd: z.date(),
  pickupTime: z.string(),
  returnTime: z.string(),
  requiresDriver: z.boolean(),
  requiresDelivery: z.boolean(),
  travelRegion: z.string(),
  estimatedDistance: z.string(),
  username: z.string(),
  surname: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  passport: z.string(),
  address: z.string(),
  passportImages: z.array(z.string()),
  driverLicenceImages: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateRentalSchema = z.object({
  rentalStart: z.date(),
  rentalEnd: z.date(),
  pickupTime: z.string(),
  returnTime: z.string(),
  requiresDriver: z.boolean().default(false),
  requiresDelivery: z.boolean().default(false),
  travelRegion: z.string(),
  estimatedDistance: z.string(),
  username: z.string(),
  surname: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  passport: z.string(),
  address: z.string(),
  passportImages: z.array(z.string()),
  driverLicenceImages: z.array(z.string()),
});

export const DeleteRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateRentalRequest = z.infer<typeof CreateRentalSchema>;
export type DeleteRentalRequest = z.infer<typeof DeleteRentalSchema>;