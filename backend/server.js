const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const caRoutes = require("./routes/ca");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");
const subscriptionRoutes = require("./routes/subscription");

app.use("/api/ca", caRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Make uploads folder static
app.use("/uploads", express.static("uploads"));

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver, content } = data;

    // Save message to DB
    const Message = require("./models/Message");
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    // Emit to receiver's room
    io.to(receiver).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/know-your-ca")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
