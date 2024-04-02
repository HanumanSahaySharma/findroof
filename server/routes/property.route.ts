import express from "express";
const router = express.Router();
import { addProperty, editProperty, getProperties, removeDeletedPhotoUrl } from "../controllers/property.controller";
import { verifyToken } from "../utils/verifyToken";

router.post("/add-property", verifyToken, addProperty);
router.get("/get-properties", getProperties);
router.put("/edit-property/:propertyId", verifyToken, editProperty);
router.delete("/remove-deleted-photo-url", verifyToken, removeDeletedPhotoUrl);

export default router;
