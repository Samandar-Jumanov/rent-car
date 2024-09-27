import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const PaymentType = z.enum(["CARD", "TERMINAL", "CASH"]);
const CarDelivery  = z.enum(['TAKE_AWAY' , "DELIVER"])
const MirrorType  = z.enum(['STANDARD' , "TINTED" , "ANTI_GLARE" , "HEATED" , "AUTO_DIMMING"])
const FuelType  = z.enum(['PETROL' , "DIESEL" , "ELECTRIC" , "HYBRID"])
const CarType  = z.enum(['MANUAL' , "AUTOMATIC" , "ELECTRIC" , "HYBRID"])


export interface IBrend {
  id: string;
  userId: string;
  logo: string;
  brendName: string;
  ownerNumber: string;
  address: string;
  password: string;
  carDelivery : z.infer<typeof CarDelivery>
  topBrendId: string | null;
  payment: z.infer<typeof PaymentType>;
  ratings : number[];
  averageRating: number
  createdAt: Date;
  updatedAt: Date;
}

export const BrendSchema = z.object({
  id: z.string(),
  userId: z.string(),
  logo: z.string(),
  brendName: z.string(),
  ownerNumber: z.string(),
  address: z.string(),
  password: z.string(),
  isTopBrend: z.boolean().default(false),
  topBrendId: z.string().nullable(),
  payment: PaymentType,
  carDelivery : CarDelivery,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const GetBrendSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateBrendSchema = z.object({
  userId: z.string(),
  logo: z.string(),
  brendName: z.string(),
  ownerNumber: z.string(),
  address: z.string(),
  password: z.string(),
  isTopBrend: z.boolean(),
  topBrendId: z.string().nullable().optional(),
  payment: PaymentType.optional(),
});

export const UpdateBrendSchema = z.object({
  logo: z.string().optional(),
  brendName: z.string().optional(),
  ownerNumber: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  isTopBrend: z.boolean().optional(),
  topBrendId: z.string().nullable().optional(),
  payment: PaymentType.optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export const QueryBrendSchema = z.object({
        address :  z.string().optional(),
        carBrend : z.string().optional(),
        mirrorType  : MirrorType.optional(),
        fuelType : FuelType.optional(),
        color : z.string().optional(),
        payment : PaymentType.optional(),
        carDelivery : CarDelivery.optional()
})


export interface IReviewSchema {
  id: string;
  carId: string | null;
  brandId : string | null;
  review: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = z.object({
  id: z.string(),
  carId: z.string(),
  review: z.string(),
  brandId  : z.string(),
  rating: z.number().int().min(1).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateReviewSchema = z.object({
  carId: z.string(),
  brandId  : z.string(),
  rating: z.number().int().min(1).max(5),
  review: z.string(),
});

export const GetReviewSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteReviewSchema = z.object({
  params: z.object({ id: z.string() }),
});


export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>;
export type UpdateBrendRequest = z.infer<typeof UpdateBrendSchema>;
export type CreateBrendRequest = z.infer<typeof CreateBrendSchema>;
export type QueryBrend = z.infer<typeof QueryBrendSchema>;