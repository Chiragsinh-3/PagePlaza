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
// import MongoStore from "connect-mongo";
import { initializePassport } from "./controllers/strategy/googleStrategy";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

// Move CORS configuration to the very top, before any routes
const allowedOrigins = [
  "https://pageplaza.netlify.app",
  "http://localhost:3000",
];

// Pre-flight requests
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Cookie parser middleware
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      domain: ".onrender.com",
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/order", orderRoutes);

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
