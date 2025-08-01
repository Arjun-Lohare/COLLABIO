import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { getStreamToken } from "../controllers/chatController.js";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat and token endpoints
 */
const router = express.Router();

/**
 * @swagger
 * /api/chat/token:
 *   get:
 *     summary: Get chat stream token
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Stream token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized
 */
router.get("/token", protectedRoute, getStreamToken);

export default router;
