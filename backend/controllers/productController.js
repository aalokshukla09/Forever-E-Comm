import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js';
import connectCloudinary from '../config/cloudinary.js';


// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
//   });

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // ✅ Ensure req.files exists
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // ✅ Extract images safely
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        // console.log("Received images:", images);

        // ✅ Upload images to Cloudinary
        connectCloudinary(); // Ensure Cloudinary is connected before uploading
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url;
            })
        );

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true:false,
            images: imagesUrl,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        res.status(200).json({ success: true, message: "Product Added" });

    } 
    catch (error){
        console.log(error);
        res.status(500).json({success:false, message: error.message})
    }

}


export const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.status(200).json({success:true, products})
    }
    catch (error){
        console.log(error);
        res.status(500).json({success:false, message: error.message})
    }

}


export const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        await productModel.findByIdAndDelete(req.body.id)
        res.status(200).json({ success: true, message: "Product removed"})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }

}


export const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.status(200).json({success: true, product})
    }
    catch (error){
        console.log(error)
        res.status(500).json({success:false, message: error.message})
    }

}