"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticatedUser, orderController_1.createOrUpdateOrder);
router.get("/", authMiddleware_1.authenticatedUser, orderController_1.getOrderByUser);
router.get("/:id", authMiddleware_1.authenticatedUser, orderController_1.getOrderById);
router.post("/create-razorpay-order", authMiddleware_1.authenticatedUser, orderController_1.createPaymentWithRazorpay);
router.post("/verify-payment", authMiddleware_1.authenticatedUser, orderController_1.verifyPayment);
exports.default = router;
