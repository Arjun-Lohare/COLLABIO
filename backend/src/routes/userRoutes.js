import express from "express";
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

router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);

router.post("/friend-request/:id", incomingFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendReuest);

router.get("/outgoing-friend-requests", getOutGoingRequests);

export default router;
