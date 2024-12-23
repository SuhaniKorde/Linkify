const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.static("uploads"));

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/fileSharingApp2", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define File Schema and Model
const fileSchema = new mongoose.Schema({
    originalName: String,
    uniqueName: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Get Local IP Address
const getLocalIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost"; // Fallback to localhost if no local IP is found
};

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const uniqueName = req.file.filename;
    const localIPAddress = getLocalIPAddress(); // Use the local IP address
    const fileUrl = `${req.protocol}://${localIPAddress}:${PORT}/${uniqueName}`;

    // Save metadata to MongoDB
    try {
        const newFile = new File({
            originalName: req.file.originalname,
            uniqueName,
            fileUrl,
        });

        await newFile.save();
        res.status(200).json({ fileUrl, id: newFile._id });
    } catch (error) {
        console.error("Error saving file metadata:", error);
        res.status(500).send("Error saving file metadata.");
    }
});

// Fetch File Metadata
app.get("/files/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send("File not found.");
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Error fetching file metadata:", error);
        res.status(500).send("Error fetching file metadata.");
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
    const localIPAddress = getLocalIPAddress();
    console.log(`Server running on http://${localIPAddress}:${PORT}`);
});

