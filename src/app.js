import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Memoir API" });
});

app.use("/api", apiRoutes);

export default app;
