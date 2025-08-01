import express from "express";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and friend operations
 */
import {
  acceptFriendRequest,
  getFriendReuest,
  getMyFriends,
  getOutGoingRequests,
  incomingFriendRequest,
  getRecommendedUsers,
} from "../controllers/userController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();
// applay auth middleware all routes
router.use(protectedRoute);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get recommended users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of recommended users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", getRecommendedUsers);

/**
 * @swagger
 * /api/users/friends:
 *   get:
 *     summary: Get my friends
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/friends", getMyFriends);

/**
 * @swagger
 * /api/users/friend-request/{id}:
 *   post:
 *     summary: Send a friend request
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to send request to
 *     responses:
 *       200:
 *         description: Friend request sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post("/friend-request/:id", incomingFriendRequest);

/**
 * @swagger
 * /api/users/friend-request/{id}/accept:
 *   put:
 *     summary: Accept a friend request
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID whose request to accept
 *     responses:
 *       200:
 *         description: Friend request accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.put("/friend-request/:id/accept", acceptFriendRequest);

/**
 * @swagger
 * /api/users/friend-requests:
 *   get:
 *     summary: Get incoming friend requests
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of incoming friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/friend-requests", getFriendReuest);

/**
 * @swagger
 * /api/users/outgoing-friend-requests:
 *   get:
 *     summary: Get outgoing friend requests
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of outgoing friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/outgoing-friend-requests", getOutGoingRequests);

export default router;
