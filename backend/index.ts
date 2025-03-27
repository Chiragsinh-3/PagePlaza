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
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./controllers/strategy/googleStrategy";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://pageplaza.netlify.app"]
        : ["http://localhost:3000", "https://pageplaza.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
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
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
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
