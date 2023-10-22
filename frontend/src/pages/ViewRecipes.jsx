import { Box, Grid, GridItem, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

//viewing your own recipes page

export default function ViewRecipes() {
  const [user, setUser] = useRecoilState(userAtom);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //fetch the list of recipes when the component mounts
    async function fetchRecipes() {
      try {
        const response = await fetch("/api/recipes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleEdit = (recipeId) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  const handleDelete = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/delete/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("List of recipes left: ", data); //<- debugging statement
        setRecipes(data); //<- update the recipes state
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  //filter recipes to display only those created by the current user
  const userRecipes = recipes.filter((recipe) => recipe.userID === user._id);

  return (
    <Box p="4">
      <h1>View Recipes</h1>
      {userRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {userRecipes.map((recipe) => (
            <GridItem key={recipe._id}>
              <Box borderWidth="1px" rounded="lg" p="4">
                <h2>{recipe.recipeName}</h2>
                <p>Descripton: {recipe.description}</p>
                <p>Ingredients</p>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <p key={index}>{ingredient}</p>
                  ))}
                </ul>
                <p>Steps</p>
                <ul>
                  {recipe.steps.map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </ul>
                <p>Public Recipe: {JSON.stringify(recipe.setPublic)}</p>
                <p>User owner ID: {recipe.userID}</p>
                <p>Date of creation: {recipe.createdAt}</p>
                <p>Last update: {recipe.updatedAt}</p>
                <Button colorScheme="blue" onClick={() => handleEdit(recipe._id)}>
                  View & Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(recipe._id)}>
                  Delete
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
}
