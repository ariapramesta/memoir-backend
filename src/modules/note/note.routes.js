import express from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { createNote, getNote, getNotes } from "./note.controller.js";

const router = express.Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNote);

export default router;
