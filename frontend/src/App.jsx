import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import CreateRecipe from "./pages/CreateRecipe";
import ViewRecipes from "./pages/ViewRecipes";
import EditRecipe from "./pages/EditRecipe";
import SearchPage from "./pages/SearchPage";
import CreateShoppingList from "./pages/CreateShoppingList";
import ViewShoppingLists from "./pages/ViewShoppingLists";
import EditShoppingList from "./pages/EditShoppingList";
import ViewOtherUserRecipes from "./pages/ViewOtherUserRecipes";
import ViewRecipe from "./pages/ViewRecipe";

//where we tie everything together for the app

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w="full">
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />
        <Routes>
          {/*where we define all of the routes and protected routes with authorization to all of our pages*/}
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/user/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/create-recipe" element={user ? <CreateRecipe /> : <Navigate to="/auth" />} />
          <Route path="/view-recipes" element={user ? <ViewRecipes /> : <Navigate to="/auth" />} />
          <Route path="/edit-recipe/:id" element={user ? <EditRecipe /> : <Navigate to="/auth" />} />
          <Route path="/create-shoppinglist" element={user ? <CreateShoppingList /> : <Navigate to="/auth" />} />
          <Route path="/view-shoppinglists" element={user ? <ViewShoppingLists /> : <Navigate to="/auth" />} />
          <Route path="/edit-shoppinglist/:id" element={user ? <EditShoppingList /> : <Navigate to="/auth" />} />
          <Route path="/search-page" element={user ? <SearchPage /> : <Navigate to="/auth" />} />

          <Route
            path="/user/:username/view-recipes"
            element={user ? <ViewOtherUserRecipes /> : <Navigate to="/auth" />}
          />
          <Route path="/user/:username/view-recipe/:id" element={user ? <ViewRecipe /> : <Navigate to="/auth" />} />

          <Route
            path="/user/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  {/* add post functionality here */}
                </>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
