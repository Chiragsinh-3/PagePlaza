"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const wishListController_1 = require("../controllers/wishListController");
const router = express_1.default.Router();
router.post("/add", authMiddleware_1.authenticatedUser, wishListController_1.addToWishList);
router.delete("/remove", authMiddleware_1.authenticatedUser, wishListController_1.removeFromWishList);
router.get("/:userId", authMiddleware_1.authenticatedUser, wishListController_1.getWishListByUser);
exports.default = router;
