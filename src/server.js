import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";


const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.log("❌ MongoDB URI is not defined in environment variables.");
    process.exit(1);
}

mongoose.connect(uri) 
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.log("❌ Error connecting to MongoDB:", err))

app.get("/", (req, res) => {
    console.log(`Server is running on port ${PORT}`);
    res.send("Hello, HireFlow!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
