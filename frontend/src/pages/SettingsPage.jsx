import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

//current user settings page

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const currentUser = useRecoilState(userAtom);
  const user_id = currentUser[0]._id;

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await fetch(`/api/users/delete/${user_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been deleted", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Text my={1} fontWeight={"bold"}>
        Delete Your Account
      </Text>
      <Text my={1}>
        You can NOT undo this change to your account. <br />
        If you want to continue to use myRecipes again, you will have to create a new account.
      </Text>
      <Button size={"sm"} colorScheme="red" onClick={deleteAccount}>
        Delete Account
      </Button>
    </>
  );
};
