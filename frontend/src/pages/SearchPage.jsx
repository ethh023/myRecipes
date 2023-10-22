import { Box, Grid, GridItem, Button, Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

//page to search recipes and users

export default function SearchRecipesAndUsersPage() {
  const [currentUser, currentSetUser] = useRecoilState(userAtom);
  const [user, setUser] = useState([]);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        //fetch recipes
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

        //fetch users
        const usersResponse = await fetch("/api/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUser(usersData);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const publicRecipes = recipes.filter((recipe) => recipe.setPublic === true);

  const data = [...publicRecipes, ...user];

  const filteredData = data.filter((item) => {
    if (item.recipeName && item.recipeName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    if (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <Box p="4">
      <h1>Search for Recipes and Users</h1>
      <Input
        placeholder="Search by recipe or username"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button colorScheme="teal" onClick={() => setSearchQuery("")}>
        Clear
      </Button>
      {filteredData.length === 0 ? (
        <p>No matching recipes or users found.</p>
      ) : (
        <>
          <h2>Users</h2>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {filteredData
              .filter((item) => item.username)
              .map((user) => (
                <GridItem key={user._id}>
                  <Box borderWidth="1px" rounded="lg" p="4">
                    <h2>Profile</h2>
                    <p>Username: {user.username}</p>
                    <Button colorScheme="teal" onClick={() => navigate(`/user/${user.username}`)}>
                      View Profile
                    </Button>
                  </Box>
                </GridItem>
              ))}
          </Grid>
          <h2>Recipes</h2>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {filteredData
              .filter((item) => item.recipeName)
              .map((recipe) => {
                const recipeUser = user.find((user) => user._id === recipe.userID);

                return (
                  <GridItem key={recipe._id}>
                    <Box borderWidth="1px" rounded="lg" p="4">
                      <h2>{recipe.recipeName}</h2>
                      <p>Description: {recipe.description}</p>
                      <p>Public Recipe: {JSON.stringify(recipe.setPublic)}</p>
                      <p>Recipe Created by: {recipeUser.username}</p>
                      <p>User owner ID: {recipe.userID}</p>
                      <p>Date of creation: {recipe.createdAt}</p>
                      <p>Last update: {recipe.updatedAt}</p>
                      {currentUser._id === recipe.userID ? (
                        <>
                          <Button onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>Edit Recipe</Button>
                          <p>*You created this recipe*</p>
                        </>
                      ) : recipeUser ? ( // Check if a user is found
                        <Button onClick={() => navigate(`/user/${recipeUser.username}/view-recipe/${recipe._id}`)}>
                          View Recipe
                        </Button>
                      ) : (
                        <p>Unknown User</p>
                      )}
                    </Box>
                  </GridItem>
                );
              })}
          </Grid>
        </>
      )}
    </Box>
  );
}
