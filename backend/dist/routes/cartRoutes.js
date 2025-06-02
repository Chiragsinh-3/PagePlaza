"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.post("/add", authMiddleware_1.authenticatedUser, cartController_1.addToCart);
router.delete("/remove", authMiddleware_1.authenticatedUser, cartController_1.removeFromCart);
router.get("/:userId", authMiddleware_1.authenticatedUser, cartController_1.getCartByUser);
exports.default = router;
