import { Box, Grid, GridItem, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//viewing other users public recipes from their profile page

function ViewOtherUserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        //fetch the other user's info
        const userResponse = await fetch(`/api/users/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setOtherUser(userData);
        }

        //fetch all recipes
        const recipesResponse = await fetch("/api/recipes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (recipesResponse.ok) {
          const recipesData = await recipesResponse.json();
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!otherUser) {
    return <div>No user data found.</div>;
  }

  const userRecipes = recipes.filter((recipe) => recipe.userID === otherUser._id && recipe.setPublic === true);

  //need to style this

  return (
    <Box p="4">
      <h1>View another user's recipes</h1>
      <p>Recipes by {otherUser.username}:</p>
      {userRecipes.length === 0 ? (
        <p>User has no public recipes.</p>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {userRecipes.map((recipe) => (
            <GridItem key={recipe._id}>
              <Box borderWidth="1px" rounded="lg" p="4">
                <h2>{recipe.recipeName}</h2>
                <p>Description: {recipe.description}</p>
                {/* <p>Ingredients</p>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul> */}
                {/* <p>Steps</p>
                <ul>
                  {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul> */}
                {/* <p>Public Recipe: {JSON.stringify(recipe.setPublic)}</p> */}
                {/* <p>Date of creation: {recipe.createdAt}</p> */}
                <p>Last update: {recipe.updatedAt}</p>
                <Button onClick={() => navigate(`/user/${otherUser.username}/view-recipe/${recipe._id}`)}>
                  View Recipe
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ViewOtherUserRecipes;
