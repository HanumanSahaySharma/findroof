import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyToken";
import { updateProfile } from "../controllers/user.controller";

router.put("/update/:userId", verifyToken, updateProfile);

export default router;
