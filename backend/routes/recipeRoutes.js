import express from "express";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
  viewRecipe,
  viewAllRecipes,
} from "../controllers/recipeController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

//routes that we send http requests through, the code for these routes are in the controllers which we call here, and also call protectRoute if we want user auth to be included
router.post("/add", protectRoute, createRecipe);
router.delete("/delete/:id", protectRoute, deleteRecipe);
router.put("/update/:id", protectRoute, updateRecipe); //maybe try put request
router.get("/:id", protectRoute, viewRecipe);
router.get("/", protectRoute, viewAllRecipes);

export default router;
