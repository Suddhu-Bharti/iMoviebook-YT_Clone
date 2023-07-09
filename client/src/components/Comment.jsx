import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import axios from "axios";
import { format } from "timeago.js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../redux/commentSlice";
const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  margin: 30px 0px;
  color: ${({ theme }) => theme.text};
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* color: ${({ theme }) => theme.text}; */
`;
const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 13px;
  text-align: justify;
`;
const Delete = styled.div`
  cursor: pointer;
  background-color: ${({ theme }) => theme.bgLighter};
  padding: 2px;
  transition: all 0.3s ease;
  border-radius: 2px;

  &:hover {
    background-color: red;
  }
`;

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/find/${comment.userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [comment.userId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${comment._id}`);
      dispatch(deleteComment(comment._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Avatar src={user.img} />
        <Details>
          <Name>
            {user.name} <Date>{format(comment.createdAt)}</Date>
          </Name>
          <Text>{comment.comment}</Text>
        </Details>
      </Wrapper>

      {(comment.userId === currentUser._id ||
        currentVideo.userId === currentUser._id) && (
        <Delete onClick={handleDelete}>
          <DeleteOutlineOutlinedIcon />
        </Delete>
      )}
    </Container>
  );
};

export default Comment;
