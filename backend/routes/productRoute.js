import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteproductController,
  filterProductController,
  getProductController,
  productCategoryController,
  productCountController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  singleProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
//router object
const router = express.Router();

//routing
//CREATE PRODUCT || METHOD POST
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//UPDATE PRODUCT || METHOD PUT
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//GET PRODUCTS || METHOD GET
router.get("/get-product", getProductController);

//GET SINGLE PRODUCT || METHOD GET
router.get("/single-product/:slug", singleProductController);

//GET PHOTO || METHOD GET
router.get("/product-photo/:pid", productPhotoController);

//FILTER PRODUCT || METHOD POST
router.post("/filter-product", filterProductController);

//COUNT PRODUCT || METHOD GET
router.get("/product-count", productCountController);

//PRODUCT LIST PER PAGE || METHOD GET
router.get("/product-list/:page", productListController);

//SEARCH PRODUCT || METHOD GET
router.get("/search/:keyword", searchProductController);

//DELETE PRODUCT || METHOD DELETE
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteproductController
);

//SIMILAR PRODUCT || METHOD GET
router.get("/related-product/:pid/:cid", relatedProductController);

//CATEGORY-WISE PRODUCT || METHOD GET
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;