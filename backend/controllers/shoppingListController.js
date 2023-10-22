import ShoppingList from "../models/shoppinglistModel.js";

//creates a new shopping list
//takes in req.body values and stores them into their own vars
//creates new shoppinglist tied to the userID that created it
const createShoppingList = (req, res) => {
  const shoppingListName = req.body.shoppingListName;
  const ingredients = req.body.ingredients;
  const userID = req.body.userID;

  const newShoppingList = new ShoppingList({
    shoppingListName,
    ingredients,
    userID,
  });

  newShoppingList
    .save()
    .then(() => res.status(200).json({ success: "New Shopping List Added" }))
    .catch((err) => res.status(400).json("Error: " + err));
};

//deletes shopping list
//finds shopping list by id -> deletes -> returns rest of shopping lists
const deleteShoppingList = (req, res) => {
  // ShoppingList.findByIdAndDelete(req.params.id).then(() =>
  //   res.status(200).json({ success: "Shopping List Deleted" })
  // );

  //deletes shopping list then returns the list of shopping lists that arent deleted
  ShoppingList.findByIdAndDelete(req.params.id).then(() => {
    ShoppingList.find()
      .then((shoppinglist) => res.status(200).json(shoppinglist))
      .catch((err) => res.status(400).json("Error: " + err));
  });
};

//update shopping list given the request params,
//finds a list from the req.params.id and then updates the given variables with new updated info
const updateShoppingList = (req, res) => {
  ShoppingList.findById(req.params.id)
    .then((shoppingList) => {
      shoppingList.shoppingListName = req.body.shoppingListName;
      shoppingList.ingredients = req.body.ingredients;

      shoppingList
        .save()
        .then(() => res.json("Shopping list Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

//view the info of a shopping list
//finds a shopping list in DB from the id its given then returns a list of info in the shopping list
const viewShoppingList = (req, res) => {
  ShoppingList.findById(req.params.id)
    .then((shoppinglist) => res.status(200).json(shoppinglist))
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
};

//view all shopping lists
const viewAllShoppingLists = (req, res) => {
  ShoppingList.find()
    .then((shoppinglist) => res.status(200).json(shoppinglist))
    .catch((err) => res.status(400).json("Error: " + err));
};

export {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
  viewShoppingList,
  viewAllShoppingLists,
};
