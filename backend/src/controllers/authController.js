import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertstreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if ((!fullname, !email, !password)) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least six character",
      });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "email is not valid, please enter valid email" });
    }

    const emailLowerCase = email.trim().toLowerCase();
    const existedUser = await User.findOne({ email: emailLowerCase });

    if (existedUser) {
      return res
        .status(400)
        .json({ message: "Email already exist, please enter valid email" });
    }

    const newPassword = await bcrypt.hash(password, 10);

    const idx = Math.floor(Math.random() * 100);
    const randomAvtar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullname,
      email,
      password: newPassword,
      profilePic: randomAvtar,
    });

    try {
      await upsertstreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });
      console.log("stream user created successfully");
    } catch (err) {
      console.log("error creating new stream user", err);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );

    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", // prevent CSRF attack
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "error in the signup controoler" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(403).json({ message: "all fields are required" });
    }

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching) {
      return res.status(401).json({ message: "invalid creditials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });

    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", // prevent CSRF attack
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(200)
      .json({ success: true, user, message: "Login Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successfully" });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if ((!fullname || !bio, !nativeLanguage, !learningLanguage, !location)) {
      return res.status(400).json({
        message: "all fields are required",
        missingFields: [
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json({ message: "Unauthorize - user not found" });
    }
    try {
      await upsertstreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullname,
        image: updateUser.profilePic || "",
      });
      console.log(`stream user updated ${updateUser.fullname}`);
    } catch (err) {
      res.status(500).json({ message: "Error on updating stream user" });
      console.log("Error on updating stream user", err);
    }

    res.status(200).json({ success: true, user: updateUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
