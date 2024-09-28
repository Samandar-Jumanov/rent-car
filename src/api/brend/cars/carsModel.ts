import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const FuelTypeEnum = z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']);
const CarTypeEnum = z.enum(['MANUAL', 'AUTOMATIC', 'ELECTRIC', 'HYBRID']);
const MirorTypeEnum = z.enum(['STANDARD', 'TINTED', 'ANTI_GLARE', 'HEATED', 'AUTO_DIMMING']);

export interface ICar {
  id: string;
  brendId: string;
  title: string;
  carBrend: string;
  price: number;
  color: string;
  fuelType: z.infer<typeof FuelTypeEnum>;
  carType: z.infer<typeof CarTypeEnum>;
  numberOfSeats: number;
  airConditioner: boolean;
  fuelEconomy: number;
  features: string[];
  requirements: string[];
  isAvailable: boolean;
  images: string[];
  mirrorType: z.infer<typeof MirorTypeEnum>;
  createdAt: Date;
  updatedAt: Date;
}

export const CarSchema = z.object({
  id: z.string(),
  brendId: z.string(),
  title: z.string(),
  carBrend: z.string(),
  price: z.number(),
  color: z.string(),
  fuelType: FuelTypeEnum,
  carType: CarTypeEnum,
  numberOfSeats: z.number().int(),
  airConditioner: z.boolean(),
  fuelEconomy: z.number(),
  features: z.array(z.string()),
  requirements: z.array(z.string()),
  isAvailable: z.boolean(),
  images: z.array(z.string()),
  mirrorType: MirorTypeEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCarSchema = z.object({
  params: z.object({ id: z.string() }),
});
export interface IRental {
  id: string;
  userId: string;
  carId: string;
  rentalStart: string;
  rentalEnd: string;
  pickupTime: string;
  returnTime: string;
  travelRegion: string;
  estimatedDistance: string;
  userImage: string;
  username: string;
  surname: string;
  usersFatherName: string;
  driverLicence: string;
  passport: string;
  address: string;
  passportImages: string[];
  driverLicenceImages: string[];
  requirements: { id: string }[];
  status: 'NEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'; // Assuming these are the possible RentalType values
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RentalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  carId: z.string(),
  rentalStart: z.string(),
  rentalEnd: z.string(),
  pickupTime: z.string(),
  returnTime: z.string(),
  travelRegion: z.string(),
  estimatedDistance: z.string(),
  userImage: z.string(),
  username: z.string(),
  surname: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  passport: z.string(),
  address: z.string(),
  passportImages: z.array(z.string()),
  driverLicenceImages: z.array(z.string()),
  requirements: z.array(z.object({ id: z.string() })),
  status: z.enum(['NEW', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateRentalSchema = z.object({
  rentalStart: z.string(),
  rentalEnd: z.string(),
  pickupTime: z.string(),
  returnTime: z.string(),
  travelRegion: z.string(),
  estimatedDistance: z.string(),
  userImage: z.string().optional(),
  username: z.string(),
  surname: z.string(),
  usersFatherName: z.string(),
  driverLicence: z.string(),
  passport: z.string(),
  address: z.string(),
  passportImages: z.array(z.string()),
  driverLicenceImages: z.array(z.string()),
  requirements: z.array(z.object({ id: z.string() })),
});

export const DeleteRentalSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateRentalQuerySchema = z.object({
  brendId: z.string(),
  carId: z.string()
});

export type CreateRentalRequest = z.infer<typeof CreateRentalSchema>;
export type DeleteRentalRequest = z.infer<typeof DeleteRentalSchema>;