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

//page for editing a recipe

export default function EditRecipe() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [currentUser, currentSetUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    recipeName: "",
    description: "",
    ingredients: [""],
    steps: [""],
    setPublic: "",
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
          setInputs(data);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }

    fetchRecipeDetails();
  }, [id]);

  const addToShoppingList = () => {
    //not implemented yet
  };

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

  //steps
  const handleStepChange = (index, value) => {
    const updatedSteps = [...inputs.steps];
    updatedSteps[index] = value;
    setInputs({ ...inputs, steps: updatedSteps });
  };

  const addStep = () => {
    const updatedSteps = [...inputs.steps, ""];
    setInputs({ ...inputs, steps: updatedSteps });
  };

  const removeStep = (index) => {
    const updatedSteps = inputs.steps.filter((_, i) => i !== index);
    setInputs({ ...inputs, steps: updatedSteps });
  };

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) {
      console.log("updating");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/recipes/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      console.log("and past fetch");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Recipe updated", "success");
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
        <p>This isn't your recipe, therefore you cannot edit it.</p>
        <Button onClick={() => navigate("/view-recipes")}>Back to Recipes</Button>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack spacing={4} w={"full"} maxW={"md"} rounded={"xl"} boxShadow={"lg"} p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            View & Edit Recipe
          </Heading>
          <FormControl>
            <FormLabel>Recipe Name</FormLabel>
            <Input
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
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
                <Button type="button" onClick={() => removeIngredient(index)} colorScheme="red" size="sm">
                  Remove Ingredient
                </Button>
                <Button type="button" onClick={addToShoppingList} colorScheme="blue" size="sm">
                  Add Ingredient to Shopping List
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addIngredient} colorScheme="teal" size="sm">
              Add Ingredient
            </Button>
          </FormControl>
          <FormControl>
            <FormLabel>Steps</FormLabel>
            {inputs.steps.map((step, index) => (
              <div key={index}>
                <Input
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
                <Button type="button" onClick={() => removeStep(index)} colorScheme="red" size="sm">
                  Remove Step
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addStep} colorScheme="teal" size="sm">
              Add Step
            </Button>
          </FormControl>

          <FormControl>
            <FormLabel>Make Recipe Public?</FormLabel>
            <input
              type="checkbox"
              onChange={(e) => setInputs({ ...inputs, setPublic: e.target.checked })}
              checked={inputs.setPublic}
            />
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Link as={RouterLink} to="/view-recipes">
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
