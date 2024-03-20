import express from "express";
const router = express.Router();
import { signIn, signUp, google, signOut } from "../controllers/auth.controller";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);
router.post("/signout", signOut);

export default router;
