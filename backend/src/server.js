import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import dbConnect from "./lib/dbConnect.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import path from "path";

const app = express();

const _dirname = path.resolve();

//Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookie
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  dbConnect();
});
