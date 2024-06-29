import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

import easyinvoice from 'easyinvoice';
import nodemailer from 'nodemailer';
import fs from 'fs';

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required" });
      case !description:
        return res.status(400).send({ message: "Description is required" });
      case !price:
        return res.status(400).send({ message: "Price is required" });
      case !category:
        return res.status(400).send({ message: "Category is required" });
      case !quantity:
        return res.status(400).send({ message: "Quantity is required" });
      case !photo && photo.size > 1000000:
        return res.status(400).send({
          message: "Photo is required and it should be less than 1mb",
        });
    }
    //creating copy of product
    const product = new productModel({ ...req.fields, slug: slugify(name),owner:req.user._id});
    //checking photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product creation",
      error,
    });
  }
};

// get all products
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: product.length,
      message: "Products fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching products",
      error,
    });
  }
};

// get single product
export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product",
      error,
    });
  }
};

// get product photo
export const productPhotoController = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product photo",
      error,
    });
  }
};

// update category
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required" });
      case !description:
        return res.status(400).send({ message: "Description is required" });
      case !price:
        return res.status(400).send({ message: "Price is required" });
      case !category:
        return res.status(400).send({ message: "Category is required" });
      case !quantity:
        return res.status(400).send({ message: "Quantity is required" });
      // case !photo && photo.size > 1000000:
      //   return res.status(400).send({
      //     message: "Photo is required and it should be less than 1mb",
      //   });
    }
    //creating copy of product
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product updation",
      error,
    });
  }
};

//delete product
export const deleteproductController = async (req, res) => {
  try {
    const { pid } = req.params;
    await productModel.findByIdAndDelete(pid);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};

//product filter
export const filterProductController = async (req, res) => {
  try {
    const {startDate,endDate} =req.body;
    if(startDate !=null && endDate !=null){
      const unavailableProducts =await orderModel.distinct('products', {
        $or: [
          {
            rentFrom: { $gte: startDate, $lt: endDate }
          },
          {
            rentTill: { $gt: startDate, $lte: endDate }
          },
          {
            $and: [
              { rentFrom: { $lte: startDate } },
              { rentTill: { $gte: endDate } }
            ]
          }
        ]
      });

      const products = await productModel.find({
        _id: { $nin: unavailableProducts }
      });

      res.status(200).send({
        success: true,
        products,
      });
    }
    // const { checked, radio } = req.body;
    // let args = {};
    // if (checked.length > 0) args.category = checked;
    // if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    // const products = await productModel.find(args);
    // res.status(200).send({
    //   success: true,
    //   products,
    // });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// Similar Products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while geting related products",
      error,
    });
  }
};

// get product catgory wise
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

//payment gateway api

//token controller
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment controller
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();

          const productsList=cart.map((item)=>({
            quantity:item.quantity,
            description:"${item.name} (from ${item.owner})",
            price:item.price,
          }));

          const data = {
            // Define your invoice data here
            sender: {
              company: "",
              address: "",
              phone: "",
              email: "",
            },
            client: {
              company: req.user.name,
              address: req.user.address,
              phone: req.user.phone,
              email: req.user.email,
            },
            products: productsList,
            logo:"",
            date:Date.now,
            // Add other necessary invoice fields
          };
        
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

async function generateAndMailInvoice(data,userEmail) {
  
  try {
    // Generate the invoice PDF
    const result = await easyinvoice.createInvoice(data);

    // Save the PDF to a file
    fs.writeFileSync('invoice.pdf', result.pdf, 'base64');

    // Configure the mail transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    // Set up email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: userEmail,
      subject: 'Your Invoice',
      text: 'Please find attached your invoice.',
      attachments: [
        {
          filename: 'invoice.pdf',
          path: './invoice.pdf',
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Invoice sent successfully.');
  } catch (error) {
    console.error('Error generating or sending invoice:', error);
  }
}

async function downloadInvoice(data) {
  try {

    // Generate the invoice PDF
    const result = await easyinvoice.createInvoice(data);

    // Save the PDF to a file
    const fileName = 'invoice.pdf';
    fs.writeFileSync(fileName, result.pdf, 'base64');

    // Send the file to the client for download
    console.log('Invoice generated and saved:', fileName);
    fs.unlinkSync(fileName);
    
  } catch (error) {
    console.error('Error generating or downloading invoice:', error);
  }
}