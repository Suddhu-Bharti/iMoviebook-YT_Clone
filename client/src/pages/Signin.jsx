import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: calc(100vh - 56px); */
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  width: 450px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3ea6ff;
    color: white;
  }
`;

const More = styled.div`
  display: flex;
  font-size: 13px;
  align-items: center;
  justify-content: space-between;
  width: 450px;
  margin-top: 10px;
`;

const Links = styled.div``;

const LinkItem = styled.span`
  margin: 0px 15px;
  cursor: pointer;
`;

const Signin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      //console.log(res.data);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      //console.log(err);
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        //console.log(result);
        axios
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
          });
      })
      .catch((error) => {
        // console.log(error);
        dispatch(loginFailure());
      });
    navigate("/");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", { name, email, password });
      setMessage("Sign up successful! Go for Sign In.");
      
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage("Something went wrong. try again later!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to PlayTube</SubTitle>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignIn}>Sign In</Button>
        <Title>Or</Title>
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
        <Title>Or</Title>
        <Input
          type="text"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {message ? (
          <LinkItem>{message}</LinkItem>
        ) : (
          <Button onClick={handleSignUp}>Sign Up</Button>
        )}
      </Wrapper>
      <More>
        <LinkItem>English(India)</LinkItem>
        <Links>
          <LinkItem className="link">Help</LinkItem>
          <LinkItem className="link">Privacy</LinkItem>
          <LinkItem className="link">Terms</LinkItem>
        </Links>
      </More>
    </Container>
  );
};

export default Signin;
