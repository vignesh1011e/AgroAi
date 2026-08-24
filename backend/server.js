const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

console.log(
  "Gemini key loaded:",
  !!process.env.GEMINI_API_KEY
);

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const User = require("./models/User");
const Message = require("./models/Message");
const Notification = require("./models/Notification");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiRoutes = require("./routes/aiRoutes");
const profileRoutes = require("./routes/profileRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const listingRoutes = require("./routes/listingRoutes");

const path = require("path");

const app = express();

const server = http.createServer(app);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/notifications", notificationRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/listings", listingRoutes);

// ==========================================
// BASIC TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Agro AI Server is running",
  });
});

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ==========================================
// SOCKET AUTHENTICATION
// ==========================================

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return next(
        new Error("User not found")
      );
    }

    socket.user = user;

    // ========================================
    // PERSONAL NOTIFICATION ROOM
    // ========================================

    socket.join(user._id.toString());

    next();
  } catch {
    next(
      new Error(
        "Invalid authentication token"
      )
    );
  }
});

// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {
  console.log(
    `User connected: ${socket.user.name}`
  );

  const region = socket.user.region;

  // ========================================
  // JOIN REGION
  // ========================================

  if (region) {
    socket.join(region);

    console.log(
      `${socket.user.name} joined ${region}`
    );
  }

  // ========================================
  // SEND MESSAGE
  // ========================================

  socket.on(
    "send-message",
    async (messageText) => {
      try {
        const message =
          messageText?.trim();

        if (!message) {
          return;
        }

        if (message.length > 1000) {
          return;
        }

        // ======================================
        // SAVE MESSAGE
        // ======================================

        const newMessage =
          await Message.create({
            sender: socket.user._id,
            senderName: socket.user.name,
            region: socket.user.region,
            message,
          });

        // ======================================
        // SEND MESSAGE TO REGION
        // ======================================

        if (socket.user.region) {
          io.to(socket.user.region).emit(
            "receive-message",
            newMessage
          );
        }

        // ======================================
        // FIND OTHER FARMERS IN SAME REGION
        // ======================================

        if (socket.user.region) {
          const otherUsers =
            await User.find({
              region: socket.user.region,
              _id: {
                $ne: socket.user._id,
              },
            }).select("_id");

          // ====================================
          // CREATE NOTIFICATIONS
          // ====================================

          if (otherUsers.length > 0) {
            const notificationData =
              otherUsers.map((user) => ({
                user: user._id,
                title: `New message from ${socket.user.name}`,
                message:
                  message.length > 100
                    ? `${message.substring(
                        0,
                        100
                      )}...`
                    : message,
                type: "Message",
              }));

            await Notification.insertMany(
              notificationData
            );

            // ==================================
            // SEND REAL-TIME NOTIFICATION
            // ==================================

            otherUsers.forEach((user) => {
              io.to(
                user._id.toString()
              ).emit(
                "new-notification",
                {
                  title: `New message from ${socket.user.name}`,
                  message:
                    message.length > 100
                      ? `${message.substring(
                          0,
                          100
                        )}...`
                      : message,
                  type: "Message",
                }
              );
            });
          }
        }
      } catch (error) {
        console.error(
          "Send message error:",
          error.message
        );
      }
    }
  );

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user.name}`
    );
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Agro AI Server running on port ${PORT}`
  );
});