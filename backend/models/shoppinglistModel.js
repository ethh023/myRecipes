import mongoose from "mongoose";

//Shopping list model to create shopping lists and add/remove ingredients
//because shoppingListName are not unique, we have to get by the receipe ID instead when we have to call them in frontend
const shoppingListSchema = mongoose.Schema(
  {
    shoppingListName: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    userID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ShoppingList = mongoose.model("ShoppingLists", shoppingListSchema);

export default ShoppingList;
