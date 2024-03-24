import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/verifyToken";
import { updateProfile, deleteUser } from "../controllers/user.controller";

router.put("/update/:userId", verifyToken, updateProfile);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
