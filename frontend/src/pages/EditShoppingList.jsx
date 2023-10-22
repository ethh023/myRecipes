import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Link,
  Box,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

//page for editing a shopping list

export default function EditShoppingList() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [currentUser, currentSetUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    shoppingListName: "",
    ingredients: [""],
  });
  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  useEffect(() => {
    async function fetchShoppingListDetails() {
      try {
        const response = await fetch(`/api/shoppinglists/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInputs(data);
        }
      } catch (error) {
        console.error("Error fetching shopping list details:", error);
      }
    }

    fetchShoppingListDetails();
  }, [id]);

  //ingredients
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...inputs.ingredients];
    updatedIngredients[index] = value;
    setInputs({ ...inputs, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    const updatedIngredients = [...inputs.ingredients, ""];
    setInputs({ ...inputs, ingredients: updatedIngredients });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = inputs.ingredients.filter((_, i) => i !== index);
    setInputs({ ...inputs, ingredients: updatedIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) {
      console.log("updating");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/shoppinglists/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Shopping List updated", "success");
      console.log(inputs);
      navigate("/");
    } catch (error) {
      setError(error.message);
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  if (inputs.userID !== currentUser._id) {
    return (
      <Box>
        <p>This isn't your shopping list, therefore you cannot edit it.</p>
        <Button onClick={() => navigate("/view-shoppinglists")}>Back to Shopping Lists</Button>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack spacing={4} w={"full"} maxW={"md"} rounded={"xl"} boxShadow={"lg"} p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            View & Edit Shopping List
          </Heading>
          <FormControl>
            <FormLabel>List Name</FormLabel>
            <Input
              placeholder="..."
              value={inputs.shoppingListName}
              onChange={(e) => setInputs({ ...inputs, shoppingListName: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Ingredients</FormLabel>
            {inputs.ingredients.map((ingredient, index) => (
              <div key={index}>
                <Input
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
                <Button type="button" onClick={() => removeIngredient(index)} colorScheme="red" size="sm">
                  Remove Ingredient
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addIngredient} colorScheme="teal" size="sm">
              Add Ingredient
            </Button>
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Link as={RouterLink} to="/view-shoppinglists">
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
            </Link>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
