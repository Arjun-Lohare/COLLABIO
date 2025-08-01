import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import dbConnect from "./lib/dbConnect.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
const app = express();

const _dirname = path.resolve();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "COLLABIO API",
      version: "1.0.0",
      description: "API documentation for COLLABIO backend",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        SignupInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "yourPassword123" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "yourPassword123" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64c7b2f1e1a2b3c4d5e6f7a8" },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            isOnboarded: { type: "boolean", example: true },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Invalid credentials" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // adjust as needed
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookie
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

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
