import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cors from "cors";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";


dotenv.config({quiet : true});

const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://forever-e-comm.vercel.app",
      "https://forever-admin-sage-eight.vercel.app", // your actual admin URL
      "http://localhost:5173" // for local dev, optional
    ],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res) => res.status(201).send("App Running"));


app.listen(port, () => console.log(`Server running on port ${port}`));