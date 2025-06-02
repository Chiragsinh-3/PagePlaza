"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const addressController_1 = require("../controllers/addressController");
const router = express_1.default.Router();
router.post("/create-update-address", authMiddleware_1.authenticatedUser, addressController_1.createOrUpdateAddressByUserId);
router.get("/", authMiddleware_1.authenticatedUser, addressController_1.getAddressByUserId);
exports.default = router;
