import mongoose from "mongoose";

//recipe schema to create recipes, store and retrieve them
const recipeSchema = mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    steps: {
      type: [String],
      default: [],
    },
    setPublic: {
      type: Boolean,
    },
    userID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
