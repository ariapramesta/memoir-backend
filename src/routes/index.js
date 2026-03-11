import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import noteRoutes from "../modules/note/note.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/note", noteRoutes);

export default router;
