import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import Decimal from "decimal.js";

extendZodWithOpenApi(z);

const CarStatusEnum = z.enum(['FREE', "RENTED"]);

const DecimalSchema = z.instanceof(Decimal).or(z.string()).or(z.number())
  .transform((value) => new Decimal(value));

export interface ICar {
  id: string;
  brendId: string; 
  modelId: string;
  colorId: string;
  carBrendId  : string 
  title: string;
  price: Decimal;
  isDiscounted: boolean;
  discountedPrice?: number | null;
  images: string[];
  status: z.infer<typeof CarStatusEnum>;
  ratings: number[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CarSchema = z.object({
  id: z.string(),
  brendId: z.string(),
  modelId: z.string(),
  colorId: z.string(),
  carBrendId  : z.string(),
  title: z.string(),
  price: z.number().positive(),
  isDiscounted: z.boolean(),
  discountedPrice: z.number().int().optional(),
  images: z.array(z.string().url()),
  status: CarStatusEnum,
  ratings: z.array(z.number().int().min(0).max(5)),
  averageRating: z.number().min(0).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCarSchema = z.object({
  modelId: z.string(),
  colorId: z.string(),
  carBrendId  : z.string(),
  title: z.string(),
  price: z.number().positive(),
  isDiscounted: z.boolean().default(false),
  discountedPrice: z.number().int().positive().optional(),
  images: z.array(z.string()),
  status: CarStatusEnum.default('FREE'),
});

export const GetCarSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateCarSchema = z.object({
  brendId: z.string().optional(),
  modelId: z.string().optional(),
  colorId: z.string().optional(),
  title: z.string().optional(),
  price: z.number().positive().optional(),
  isDiscounted: z.boolean().optional(),
  discountedPrice: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional(),
  status: CarStatusEnum.optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
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
export type CreateCarRequest = z.infer<typeof CreateCarSchema>
export type UpdateCarRequest = z.infer<typeof UpdateCarSchema>