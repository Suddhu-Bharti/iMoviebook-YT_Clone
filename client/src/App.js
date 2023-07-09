import { ThemeProvider, styled } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
import Search from "./components/Search";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 10;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 20px 10px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu setDarkMode={setDarkMode} darkMode={darkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Navigate to="/" /> : <Signin />}
                  />
                  <Route
                    path="trends"
                    element={
                      currentUser ? (
                        <Home type="trend" />
                      ) : (
                        <Navigate to="/signin" />
                      )
                    }
                  />
                  <Route
                    path="subscriptions"
                    element={
                      currentUser ? (
                        <Home type="sub" />
                      ) : (
                        <Navigate to="/signin" />
                      )
                    }
                  />
                  <Route
                    path="search"
                    element={
                      currentUser ? <Search /> : <Navigate to="/signin" />
                    }
                  />
                  <Route path="video">
                    <Route
                      path=":id"
                      element={
                        currentUser ? <Video /> : <Navigate to="/signin" />
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
