// @ts-nocheck
import express from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import {
  createOrUpdateAddressByUserId,
  getAddressByUserId,
} from "../controllers/addressController";

const router = express.Router();

router.post(
  "/create-update-address",
  authenticatedUser,
  createOrUpdateAddressByUserId
);
router.get("/", authenticatedUser, getAddressByUserId);

export default router;
