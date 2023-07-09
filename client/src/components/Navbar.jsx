import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Uploadbox from "./Uploadbox";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 500;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: max-content;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  padding: 2px 10px;;
  font-size: 14px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  outline: none;
`;

const Button = styled.button`
  padding: 5px 15px;
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

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: lightgray;
  cursor: pointer;
`

const Navbar = () => {
  // const currentUser = useSelector((state)=>state.user.currentUser);
  const { currentUser } = useSelector((state) => state.user);
  const [openVDB, setOpenVDB] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
      <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setQuery(e.target.value)}/>
          <SearchIcon onClick={()=>navigate(`/search?q=${query}`)}/>
        </Search>
        {currentUser ? (
          <User>
            <VideoCallOutlinedIcon style={{cursor: "pointer", fontSize: "30px"}} onClick={()=>setOpenVDB(true)}/>
            <NotificationsOutlinedIcon style={{cursor: "pointer"}}/>
            <Avatar src={currentUser.img}/>
            {/* {currentUser.name} */}
          </User>
        ) : (
          <Link to="/signin" className="link">
            <Button>
              <AccountCircleOutlinedIcon />
              Sign In
            </Button>
          </Link>
        )}
      </Wrapper>
    </Container>
      {/* <Profile>
          <Details>

          </Details>
      </Profile> */}
    {openVDB && <Uploadbox setOpenVDB={setOpenVDB}/>}
    </>
  );
};

export default Navbar;
