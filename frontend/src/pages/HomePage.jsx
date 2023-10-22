import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
import { useRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";

//home page that will eventually display content feed (recipes, following users posts etc.) (WIP)

const HomePage = () => {
  const currentUser = useRecoilValue(userAtom);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        <Text mb={4} fontWeight={"bold"}>
          Content Feed
        </Text>
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      ></Box>
    </Flex>
  );
};

export default HomePage;
