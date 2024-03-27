import express from "express";
const router = express.Router();
import { addProperty } from "../controllers/property.controller";
import { verifyToken } from "../utils/verifyToken";

router.post("/add-property", verifyToken, addProperty);

export default router;
