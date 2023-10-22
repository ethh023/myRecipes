import express from "express";
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
  viewShoppingList,
  viewAllShoppingLists,
} from "../controllers/shoppingListController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

//routes that we send http requests through, the code for these routes are in the controllers which we call here, and also call protectRoute if we want user auth to be included
router.post("/add", protectRoute, createShoppingList);
router.delete("/delete/:id", protectRoute, deleteShoppingList);
router.put("/update/:id", protectRoute, updateShoppingList);
router.get("/:id", protectRoute, viewShoppingList);
router.get("/", protectRoute, viewAllShoppingLists);

export default router;
