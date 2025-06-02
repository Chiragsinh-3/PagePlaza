// @ts-nocheck
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDb from "./config/dbConnect";
import authRoutes from "./routes/authRouter";
import productRoutes from "./routes/productRouter";
import cartRoutes from "./routes/cartRoutes";
import wishListRoutes from "./routes/wishListRoutes";
import addressRoutes from "./routes/addressRouter";
import orderRoutes from "./routes/orderRouter";
// @ts-ignore
import passport from "passport";
// @ts-ignore
import session from "express-session";
// @ts-ignore
import MongoStore from "connect-mongo";
import { initializePassport } from "./controllers/strategy/googleStrategy";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Add common Vite development port
  "https://pageplaza.netlify.app",
  "https://pageplaza.onrender.com",
  // Add any other origins your frontend might use
];

// Configure CORS with proper preflight handling
app.use(
  cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Origin ${origin} not allowed by CORS`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie", "Origin", "Accept"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Enable pre-flight requests for all routes
app.options("*", cors());

app.use(bodyParser.json());
// Cookie settings
app.use(cookieParser());
app.use(express.json());

// Session configuration with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport configuration
initializePassport();
connectDb();

// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/order", orderRoutes);

// Mount routes without 'api' prefix if it's already in the base URL
app.use("/cart", cartRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: any,
    res: any,
    next: any
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
