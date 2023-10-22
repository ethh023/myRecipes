import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Link } from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

//page for creating a shopping list

export default function CreateShoppingList() {
  const [currentUser, currentSetUser] = useRecoilState(userAtom);

  const [inputs, setInputs] = useState({
    shoppingListName: "",
    ingredients: [""],
    userID: currentUser._id,
  });

  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

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

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(inputs);

    if (updating) {
      console.log("updating");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch("/api/shoppinglists/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      console.log("data: ", data);
      if (data.error) {
        setError(data.error);
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Shopping List created", "success");
      navigate("/");
    } catch (error) {
      setError(error.message);
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Create Shopping List
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
            <Link as={RouterLink} to="/">
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
