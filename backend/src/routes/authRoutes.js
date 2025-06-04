import express from "express";
import {
  login,
  logOut,
  onboard,
  signup,
} from "../controllers/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logOut);

router.post("/onboarding", protectedRoute, onboard);

// check user loged in or not
router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
