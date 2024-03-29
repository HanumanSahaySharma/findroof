import express from "express";
const router = express.Router();
import { addProperty, getProperties } from "../controllers/property.controller";
import { verifyToken } from "../utils/verifyToken";

router.post("/add-property", verifyToken, addProperty);
router.get("/get-properties/:userId", verifyToken, getProperties);

export default router;
