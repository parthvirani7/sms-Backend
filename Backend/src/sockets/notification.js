const NotificationModel = require("../models/Notification.model");

const users = {}; // Map user IDs to their socket IDs

// Register a user with their socket ID
const registerUser = (userId, socketId) => {
    users[userId] = socketId;
    console.log(`User registered: ${userId} -> ${socketId}`);
}

// Unregister a user when they disconnect
const unregisterUser = (socketId) => {
    for (const userId in users) {
        if (users[userId] === socketId) {
            delete users[userId];
            console.log(`User unregistered: ${userId}`);
            break;
        }
    }
}

// Send a notification to a specific user or to all users in a society
const sendNotification = async (io, type, recipientId, societyId, message) => {
console.log("🚀 ~ sendNotification ~ io, type, recipientId, societyId, message:", io, type, recipientId, societyId, message)

    // Save the notification in the database
    try {
        const notification = await NotificationModel.create({
            type,
            recipientId,
            message,
        });
        console.log("🚀 ~ sendNotification ~ notification:", notification)
        console.log(`Notification saved to database: ${notification._id}`);
    } catch (error) {
        console.error("Failed to save notification to database:", error);
    }

    if (recipientId) {
        // Send the notification to the specific recipient if online
        const recipientSocketId = users[recipientId];
        if (recipientSocketId) {
            const event = `notification:${type.toLowerCase()}`;
            io.to(recipientSocketId).emit(event, { message });
            console.log(`Sent ${type} notification to ${recipientId}: ${message}`);
        } else {
            console.log(`Recipient ${recipientId} is offline. Notification saved.`);
        }
    } else if (societyId) {
        // Send the notification to all users in the society
        const residentSocketIds = Object.keys(users).filter(
            (userId) => users[userId].societyId === societyId
        );

        for (const socketId of residentSocketIds) {
            const event = `notification:${type.toLowerCase()}`;
            io.to(socketId).emit(event, { message });
            console.log(`Sent ${type} notification to all residents in society ${societyId}: ${message}`);
        }
    }
}

module.exports = {
    registerUser,
    unregisterUser,
    sendNotification,
};
