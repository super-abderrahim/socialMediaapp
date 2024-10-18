import express from "express";
import User from "../models/User.js";  // Ensure the '.js' extension is included.


// Get a user by ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a user's friends
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const friends = await User.find({ _id: { $in: user.friends } });

        const formattedFriends = friends.map(({ _id, firstName, lastName, picturePath, location, occupation }) => ({
            _id,
            firstName,
            lastName,
            picturePath,
            location,
            occupation,
        }));

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add or remove a friend
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        // Return updated list of friends
        const updatedFriends = await User.find({ _id: { $in: user.friends } });

        const formattedFriends = updatedFriends.map(({ _id, firstName, lastName, picturePath, location, occupation }) => ({
            _id,
            firstName,
            lastName,
            picturePath,
            location,
            occupation,
        }));

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
