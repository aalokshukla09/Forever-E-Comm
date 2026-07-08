import express from "express";
import { registerUser, loginUser, adminLogin,registerAdmin, listAdmins } from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

userRouter.post("/admin/register", adminAuth, registerAdmin);
userRouter.get("/admin/list", adminAuth, listAdmins);

export default userRouter;
