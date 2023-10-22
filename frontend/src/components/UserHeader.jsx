import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useNavigate } from "react-router-dom";

//user profile page component

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const navigate = useNavigate();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"left"} w={"full"} gap={10}>
        <Box>
          <Avatar
            name={user.username}
            src="https://bit.ly/broken-link"
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
        <Box>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Report Profile
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{user.followers.length} followers</Text>
            <Text color={"gray.light"}>{user.following.length} following</Text> {/* add following list */}
          </Flex>
        </Box>
      </Flex>

      <Text>{user.bio}</Text>
      <Flex gap={2}>
        {currentUser?._id === user._id && (
          <Link as={RouterLink} to="/user/update">
            <Button size={"sm"}>Update Profile</Button>
          </Link>
        )}
        {currentUser?._id !== user._id && (
          <>
            <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
              {following ? "Unfollow" : "Follow"}
            </Button>
            <Button size={"sm"} onClick={() => navigate(`/user/${user.username}/view-recipes`)} isLoading={updating}>
              View Public Recipes
            </Button>
          </>
        )}
        <Button size={"sm"} onClick={copyURL} isLoading={updating}>
          Copy Profile Link
        </Button>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
