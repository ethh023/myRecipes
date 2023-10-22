import Recipe from "../models/recipeModel.js";

//creates a new recipe
//takes in req.body values and stores them into their own vars
//creates new recipe tied to the userID that created it
const createRecipe = (req, res) => {
  const recipeName = req.body.recipeName;
  const description = req.body.description;
  const steps = req.body.steps;
  const ingredients = req.body.ingredients;
  const setPublic = req.body.setPublic;
  const userID = req.body.userID;

  const newRecipe = new Recipe({
    recipeName,
    description,
    steps,
    ingredients,
    setPublic,
    userID,
  });

  newRecipe
    .save()
    .then(() => res.status(200).json({ success: "New Recipe Added" }))
    .catch((err) => res.status(400).json("Error: " + err));
};

//deletes recipe
//finds recipe by id -> deletes -> returns rest of recipe
const deleteRecipe = (req, res) => {
  // Recipe.findByIdAndDelete(req.params.id).then(() =>
  //   res.status(200).json({ success: "Recipe Deleted" })
  // );

  //deletes recipe then returns the list of recipes that arent deleted
  Recipe.findByIdAndDelete(req.params.id).then(() => {
    Recipe.find()
      .then((recipes) => res.status(200).json(recipes))
      .catch((err) => res.status(400).json("Error: " + err));
  });
};

//update recipe given the request params,
//finds a list from the req.params.id and then updates the given variables with new updated info
const updateRecipe = (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipes) => {
      recipes.recipeName = req.body.recipeName;
      recipes.description = req.body.description;
      recipes.steps = req.body.steps;
      recipes.ingredients = req.body.ingredients;
      recipes.setPublic = req.body.setPublic;

      recipes
        .save()
        .then(() => res.json("Recipe Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

//view the info of a recipe
//finds a recipe in DB from the id its given then returns a list of info in the recipe
const viewRecipe = (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
};

//view all recipes
const viewAllRecipes = (req, res) => {
  Recipe.find()
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => res.status(400).json("Error: " + err));
};

export { createRecipe, deleteRecipe, updateRecipe, viewRecipe, viewAllRecipes };
