import { Box, Grid, GridItem, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

//view all your shopping lists

export default function ViewShoppingLists() {
  const [user, setUser] = useRecoilState(userAtom);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //fetch the list of shopping lists when the component mounts
    async function fetchShoppingList() {
      try {
        const response = await fetch("/api/shoppinglists/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setShoppingLists(data);
        }
      } catch (error) {
        console.error("Error fetching shopping lists: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingList();
  }, []);

  const handleEdit = (shoppingListId) => {
    navigate(`/edit-shoppinglist/${shoppingListId}`);
  };

  const handleDelete = async (shoppingListId) => {
    try {
      const response = await fetch(`/api/shoppinglists/delete/${shoppingListId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("List of shopping lists left: ", data); //<- debugging statement
        setShoppingLists(data); //<- update the shopping lists state
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  //filter shopping lists to display only those created by the current user
  const userShoppingList = shoppingLists.filter((list) => list.userID === user._id);

  return (
    <Box p="4">
      <h1>View Shopping Lists</h1>
      {userShoppingList.length === 0 ? (
        <p>No Shopping lists found.</p>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {userShoppingList.map((list) => (
            <GridItem key={list._id}>
              <Box borderWidth="1px" rounded="lg" p="4">
                <h2>{list.shoppingListName}</h2>
                <p>Ingredients</p>
                <ul>
                  {list.ingredients.map((ingredient, index) => (
                    <p key={index}>{ingredient}</p>
                  ))}
                </ul>
                <p>User owner ID: {list.userID}</p>
                <p>Date of creation: {list.createdAt}</p>
                <p>Last update: {list.updatedAt}</p>
                <Button colorScheme="blue" onClick={() => handleEdit(list._id)}>
                  View & Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(list._id)}>
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
