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
import { authMiddleware, checkRole } from "./common/middleware/auth";
import requestLogger from "./common/middleware/requestLogger";
import { discountRouter } from "./api/discount/discount.router";
import { featureRouter } from "./api/feature/feature.router";
import { requirementsRouter } from "./api/requirements/requirement.router";
import { favoriteRouter } from "./api/favorite/favorite.router";
import { colloborateRouter } from "./api/colloborate/colloborate.router";
import { bannersRouter } from "./api/banners/banners.router";
import { modelRouter } from "./api/models/models.router";
import { carBrendRouter } from "./api/carBrend/car-brend.router";
import { carColorRouter } from "./api/carColor/colors.router";
import { smsTemplateRouter } from "./api/template/template.router";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// Request logging
// app.use(requestLogger);

// Routes
app.use("/health-check", authMiddleware, healthCheckRouter);
app.use("/users", userRouter);
app.use("/brends", brendRouter);
app.use("/discounts", authMiddleware, discountRouter);
app.use("/features", authMiddleware, featureRouter);
app.use("/requirements", authMiddleware, requirementsRouter);
app.use("/favorites", authMiddleware, favoriteRouter);
app.use("/colloborate", authMiddleware, checkRole(["SUPER_ADMIN"]), colloborateRouter);
app.use("/banners", bannersRouter);
app.use("/models" , modelRouter)
app.use("/car-brands" , carBrendRouter)
app.use("/car-colors" , carColorRouter)
app.use("/sms-templates" , smsTemplateRouter)
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };