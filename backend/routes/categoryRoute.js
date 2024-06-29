import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deletecategoryController,
  getCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

//router object
const router = express.Router();

//routing
//CREATE CATEGORY || METHOD POST
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//UPDATE CATEGORY || METHOD PUT
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//GET ALL CATEGORY || METHOD GET
router.get("/get-category", getCategoryController);

//GET SINGLE CATEGORY || METHOD GET
router.get("/single-category/:slug", singleCategoryController);

//DELETE CATEGORY || METHOD DELETE
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deletecategoryController
);

export default router;