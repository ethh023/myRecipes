import { Button, Flex, Menu, MenuButton, MenuList, MenuItem, Image, Link, useColorMode, Text } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

//header component that shows the navbar

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <>
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
          <Menu>
            <MenuButton as={Button} size={"sm"}>
              Create
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/create-recipe">
                Create Recipe
              </MenuItem>
              <MenuItem as={RouterLink} to="/create-shoppinglist">
                Create Shopping List
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} size={"sm"}>
              View
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/view-recipes">
                View Recipes
              </MenuItem>
              <MenuItem as={RouterLink} to="/view-shoppinglists">
                View Shopping List
              </MenuItem>
            </MenuList>
          </Menu>
          <Link as={RouterLink} to="/search-page">
            <Button size={"sm"}>Search</Button>
          </Link>
        </>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}
      <Text onClick={toggleColorMode}>myRecipes</Text>
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/user/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
