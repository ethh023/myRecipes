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

//view singular recipe page from someone elses recipe list

export default function EditRecipe() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [currentUser, currentSetUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    recipeName: "",
    description: "",
    ingredients: [""],
    steps: [""],
    setPublic: false,
    userID: currentUser._id,
  });
  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInputs({
            ...data,
            userID: currentUser._id,
          });
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }

    fetchRecipeDetails();
  }, [id, currentUser._id]);

  const addToShoppingList = () => {
    //not implemented yet
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/recipes/add", {
        method: "POST",
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
      showToast("Success", "Recipe saved", "success");
      navigate("/");
    } catch (error) {
      setError(error.message);
      showToast("Error", error, "error");
    }
  };

  return (
    <form>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack spacing={4} w={"full"} maxW={"md"} rounded={"xl"} boxShadow={"lg"} p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            View Recipe
          </Heading>
          <FormControl>
            <FormLabel>Recipe Name</FormLabel>
            <Input
              disabled
              placeholder="..."
              value={inputs.recipeName}
              onChange={(e) => setInputs({ ...inputs, recipeName: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              disabled
              placeholder="..."
              value={inputs.description}
              onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
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
                  disabled
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />

                <Button type="button" onClick={addToShoppingList} colorScheme="blue" size="sm">
                  Add Ingredient to Shopping List
                </Button>
              </div>
            ))}
          </FormControl>
          <FormControl>
            <FormLabel>Steps</FormLabel>
            {inputs.steps.map((step, index) => (
              <div key={index}>
                <Input
                  disabled
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </div>
            ))}
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Link as={RouterLink} to="/search-page">
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
                type="submit"
                isLoading={updating}
                onClick={handleSave}
              >
                Save Recipe
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
