import express from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js"; 


export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}


export const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email });

        if(userExists) {
            return res.status(400).json({ success : false, message : "User already exists" })
        }

        if(!validator.isEmail(email)){
            return res.json({ success:false, message: "Please enter a valid email" });
        }
        if(password.length < 8){
            return res.json({ success:false, message: "Please enter a strong password"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id)
        res.json({ success: true, token });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal Server Error" })
    }

}


export const loginUser = async (req, res) => {
    // res.status(200).json({message : "Login Successful"})
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user) {
            return res.status(400).json({ success : false, message : "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({ success : false, message : "Invalid credentials" })
        }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : error.message })
    }
}


export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        let admin = await adminModel.findOne({ email });

        // Bootstrap: if no admin exists in the DB yet, allow the very first
        // login using the ADMIN_EMAIL / ADMIN_PASSWORD env vars, and turn
        // that into a real admin record so future admins can be registered
        // by this one.
        if (!admin) {
            const adminCount = await adminModel.countDocuments();
            if (
                adminCount === 0 &&
                email === process.env.ADMIN_EMAIL &&
                password === process.env.ADMIN_PASSWORD
            ) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                admin = await adminModel.create({
                    name: "Super Admin",
                    email,
                    password: hashedPassword,
                });
            } else {
                return res.json({ success: false, message: "Invalid email or password" });
            }
        } else {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid email or password" });
            }
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, token });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


// Register a new admin. Only reachable by an already-authenticated admin
// (enforced by the adminAuth middleware on the route).
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const adminExists = await adminModel.findOne({ email });
        if (adminExists) {
            return res.json({ success: false, message: "An admin with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await adminModel.create({
            name,
            email,
            password: hashedPassword,
            createdBy: req.admin?._id || null,
        });

        res.json({
            success: true,
            message: "Admin registered successfully",
            admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// List all admins (for an "admins" management view in the dashboard).
export const listAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({}).select("-password").sort({ createdAt: -1 });
        res.json({ success: true, admins });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

