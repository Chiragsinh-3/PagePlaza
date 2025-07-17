"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishListRoutes_1 = __importDefault(require("./routes/wishListRoutes"));
const addressRouter_1 = __importDefault(require("./routes/addressRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
// @ts-ignore
const passport_1 = __importDefault(require("passport"));
// @ts-ignore
const express_session_1 = __importDefault(require("express-session"));
// @ts-ignore
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const googleStrategy_1 = require("./controllers/strategy/googleStrategy");
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "http://localhost:3000",
    "https://pageplaza.netlify.app",
    "https://pageplaza.onrender.com"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
}));
// Enable pre-flight requests for all routes
app.options("*", (0, cors_1.default)());
app.use(body_parser_1.default.json());
// Cookie settings
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Session configuration with MongoDB store
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60,
    }),
    cookie: {
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Initialize Passport configuration
(0, googleStrategy_1.initializePassport)();
(0, dbConnect_1.default)();
// api endpoints
app.use("/api/auth", authRouter_1.default);
app.use("/api/product", productRouter_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/wishlist", wishListRoutes_1.default);
app.use("/api/user/address", addressRouter_1.default);
app.use("/api/order", orderRouter_1.default);
// Mount routes without 'api' prefix if it's already in the base URL
app.use("/cart", cartRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
