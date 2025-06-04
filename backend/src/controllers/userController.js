import FriendRequest from "../models/friendRequest.js";
import User from "../models/userSchema.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { _id: { $nin: currentUser.fiends } }, // exclude current user's friend
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (err) {
    console.log("Error on getRecommendationUser controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullname profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (err) {
    console.error("Erron on Get mu friends controoler", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const incomingFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipiendId } = req.params;

    //prevent request to yourself
    if (myId === recipiendId) {
      res.status(400).json({ message: "User can't send yourself request" });
    }

    const recipient = await User.findById(recipiendId);
    if (!recipient) {
      res.status(400).json({ message: "Recipient is not found" });
    }

    //check user already friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "you are already friend with this user" });
    }
    //check request already exist
    const existingUser = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipiendId },
        { sender: recipiendId, recipient: myId },
      ],
    });

    if (existingUser) {
      res.status(400).json({ message: "friend request already exist" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipiendId,
    });
    res.status(201).json(friendRequest);
  } catch (err) {
    console.error("Erron on send friend request controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(401).json({ message: "Friend request is not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorize to accept this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to each other friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.log("Error on accept friend request controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendReuest = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullname nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullname profilePic");
    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error on the getfriendrequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOutGoingRequests = async (req, res) => {
  try {
    const OutGoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullname profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(OutGoingRequest);
  } catch (error) {
    console.error("Error on getoutgoingrequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
