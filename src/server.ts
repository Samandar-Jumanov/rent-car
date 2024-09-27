import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { brendRouter } from "./api/brend/brendRouter";
import errorHandler from "@/common/middleware/errorHandler";
import { env } from "@/common/utils/envConfig";
import { authMiddleware } from "./common/middleware/auth";
import requestLogger from "./common/middleware/requestLogger";
import { discountRouter } from "./api/discount/discount.router";
import { featureRouter } from "./api/feature/feature.router";
import { requirementsRouter } from "./api/requirements/requirement.router";
import { favoriteRouter } from "./api/favorite/favorite.router";
const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// Request logging
// app.use(requestLogger);

// Routes
app.use("/health-check", authMiddleware, healthCheckRouter);
app.use("/users", userRouter);
app.use("/brends",  authMiddleware,  brendRouter);
app.use("/discounts",  authMiddleware,  discountRouter);
app.use("/features" , authMiddleware , featureRouter)
app.use("/requirements" , authMiddleware , requirementsRouter)
app.use("/favorites" , authMiddleware , favoriteRouter)




// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
